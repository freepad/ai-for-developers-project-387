import { createSignal, type JSX, type ComponentProps, Show } from "solid-js";
import { cn } from "@/lib/utils";

export function Dialog(props: { open: boolean; onClose: () => void; children: JSX.Element; class?: string }) {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/80" onClick={props.onClose} />
        <div class={cn("relative z-50 grid w-full max-w-lg gap-4 rounded-lg border bg-card p-6 shadow-lg", props.class)}>
          {props.children}
        </div>
      </div>
    </Show>
  );
}

export function DialogHeader(props: ComponentProps<"div">) {
  return (
    <div class={cn("flex flex-col space-y-1.5 text-center sm:text-left", props.class)} {...props}>
      {props.children}
    </div>
  );
}

export function DialogTitle(props: ComponentProps<"h2">) {
  return (
    <h2 class={cn("text-lg font-semibold leading-none tracking-tight", props.class)} {...props}>
      {props.children}
    </h2>
  );
}

export function DialogDescription(props: ComponentProps<"p">) {
  return (
    <p class={cn("text-sm text-muted-foreground", props.class)} {...props}>
      {props.children}
    </p>
  );
}

export function DialogFooter(props: ComponentProps<"div">) {
  return (
    <div class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", props.class)} {...props}>
      {props.children}
    </div>
  );
}
