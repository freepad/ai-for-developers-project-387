import type { ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";

export function Badge(props: ComponentProps<"span"> & { variant?: "default" | "secondary" | "outline" | "destructive" }) {
  const [local, rest] = splitProps(props, ["variant", "class"]);

  return (
    <span
      class={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": local.variant === "default" || !local.variant,
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": local.variant === "secondary",
          "text-foreground": local.variant === "outline",
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80": local.variant === "destructive",
        },
        local.class
      )}
      {...rest}
    />
  );
}

import { splitProps } from "solid-js";
