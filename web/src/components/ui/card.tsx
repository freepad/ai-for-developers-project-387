import type { JSX, ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";

export function Card(props: ComponentProps<"div">) {
  return (
    <div
      class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", props.class)}
      {...props}
    >
      {props.children}
    </div>
  );
}

export function CardHeader(props: ComponentProps<"div">) {
  return (
    <div class={cn("flex flex-col space-y-1.5 p-6", props.class)} {...props}>
      {props.children}
    </div>
  );
}

export function CardTitle(props: ComponentProps<"h3">) {
  return (
    <h3 class={cn("text-2xl font-semibold leading-none tracking-tight", props.class)} {...props}>
      {props.children}
    </h3>
  );
}

export function CardDescription(props: ComponentProps<"p">) {
  return (
    <p class={cn("text-sm text-muted-foreground", props.class)} {...props}>
      {props.children}
    </p>
  );
}

export function CardContent(props: ComponentProps<"div">) {
  return (
    <div class={cn("p-6 pt-0", props.class)} {...props}>
      {props.children}
    </div>
  );
}

export function CardFooter(props: ComponentProps<"div">) {
  return (
    <div class={cn("flex items-center p-6 pt-0", props.class)} {...props}>
      {props.children}
    </div>
  );
}
