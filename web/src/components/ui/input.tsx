import type { ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        props.class
      )}
      {...props}
    />
  );
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      class={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        props.class
      )}
      {...props}
    />
  );
}
