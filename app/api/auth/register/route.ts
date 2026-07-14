import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { client } from "@/lib/sanity/client";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Datos de registro inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUserQuery = `count(*[_type == "user" && email == $email]) > 0`;
    const userExists = await client.fetch<boolean>(existingUserQuery, { email });
    
    if (userExists) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este correo electrónico" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in Sanity
    const user = await client.create({
      _type: "user",
      email,
      name,
      passwordHash,
      role: "user",
      createdAt: new Date().toISOString(),
    });

    // Return success (without password hash)
    return NextResponse.json(
      { 
        message: "Usuario registrado exitosamente",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}