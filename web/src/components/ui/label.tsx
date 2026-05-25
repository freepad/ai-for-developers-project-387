import type { ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";

export function Label(props: ComponentProps<"label">) {
  return (
    <label
      class={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", props.class)}
      {...props}
    />
  );
}
