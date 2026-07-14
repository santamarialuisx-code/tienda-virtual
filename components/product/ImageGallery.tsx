"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

interface ImageGalleryProps {
  images: SanityImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Sin imágenes</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];
  const mainUrl = urlFor(selectedImage).width(800).height(800).url();

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        ref={mainImageRef}
        className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
        onMouseMove={(e) => {
          if (!mainImageRef.current) return;
          const rect = mainImageRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          mainImageRef.current.style.setProperty("--zoom-x", `${x}%`);
          mainImageRef.current.style.setProperty("--zoom-y", `${y}%`);
        }}
      >
        <Image
          src={mainUrl}
          alt={`${productName} - imagen ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-contain transition-transform duration-200 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden ring-2 transition-all ${
                index === selectedIndex
                  ? "ring-primary"
                  : "ring-transparent hover:ring-foreground/20"
              }`}
            >
              <Image
                src={urlFor(image).width(64).height(64).url()}
                alt={`${productName} - miniatura ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background text-foreground z-10"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full aspect-square">
            <Image
              src={mainUrl}
              alt={`${productName} - imagen ${selectedIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                className="p-2 rounded-full bg-background/80 hover:bg-background text-foreground"
                aria-label="Imagen anterior"
              >
                ←
              </button>
              <span className="self-center text-sm text-muted-foreground">
                {selectedIndex + 1} / {images.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  );
                }}
                className="p-2 rounded-full bg-background/80 hover:bg-background text-foreground"
                aria-label="Siguiente imagen"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
