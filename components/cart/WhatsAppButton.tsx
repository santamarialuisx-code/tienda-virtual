"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { generateProductWhatsAppLink, generateCartWhatsAppLink } from "@/lib/whatsapp";
import type { CustomizationData } from "@/lib/sanity/types";
import type { CartItem } from "@/lib/store/cart";

interface WhatsAppButtonBaseProps {
  className?: string;
}

interface ProductWhatsAppButtonProps extends WhatsAppButtonBaseProps {
  productName: string;
  customization?: CustomizationData;
  items?: never;
}

interface CartWhatsAppButtonProps extends WhatsAppButtonBaseProps {
  items: CartItem[];
  productName?: never;
  customization?: never;
}

type WhatsAppButtonProps = ProductWhatsAppButtonProps | CartWhatsAppButtonProps;

export function WhatsAppButton(props: WhatsAppButtonProps) {
  const handleClick = () => {
    let link: string | null = null;
    if ("items" in props && props.items) {
      link = generateCartWhatsAppLink(props.items);
    } else if ("productName" in props) {
      link = generateProductWhatsAppLink(props.productName, props.customization);
    }
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleClick}
      className={props.className}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Pedir por WhatsApp
    </Button>
  );
}