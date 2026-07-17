"use client";

import { cn } from "@/lib/utils";

interface CustomTextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export function CustomTextInput({
  value,
  onChange,
  maxLength = 100,
  placeholder = "Escribe tu texto personalizado aquí...",
}: CustomTextInputProps) {
  const charCount = value.length;
  const isOverLimit = charCount > maxLength;

  const textareaId = "custom-text-input";

  return (
    <div>
      <label htmlFor={textareaId} className="text-sm font-medium mb-2 block">
        Texto personalizado
      </label>
      <div className="relative">
        <textarea
          id={textareaId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={3}
          className={cn(
            "w-full rounded-lg border bg-transparent px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "resize-none",
            isOverLimit
              ? "border-destructive focus-visible:ring-destructive/50"
              : "border-input"
          )}
        />
        <span
          className={cn(
            "absolute bottom-2 right-2 text-xs",
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}
