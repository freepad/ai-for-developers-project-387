import type { JSX, ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";

export function Button(props: ComponentProps<"button"> & { variant?: "default" | "outline" | "ghost" | "destructive"; size?: "default" | "sm" | "lg" }) {
  const [local, rest] = splitProps(props, ["variant", "size", "class"]);

  return (
    <button
      class={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": local.variant === "default" || !local.variant,
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": local.variant === "outline",
          "hover:bg-accent hover:text-accent-foreground": local.variant === "ghost",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": local.variant === "destructive",
        },
        {
          "h-10 px-4 py-2": local.size === "default" || !local.size,
          "h-9 rounded-md px-3": local.size === "sm",
          "h-11 rounded-md px-8": local.size === "lg",
        },
        local.class
      )}
      {...rest}
    />
  );
}

import { splitProps } from "solid-js";
