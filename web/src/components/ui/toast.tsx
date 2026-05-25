import { createSignal, createEffect, type JSX, For } from "solid-js";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

const [toasts, setToasts] = createSignal<Toast[]>([]);

export function toast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  setToasts((prev) => [...prev, { ...toast, id }]);
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3000);
}

export function Toaster() {
  return (
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <For each={toasts()}>
        {(t) => (
          <div
            class={`rounded-lg border p-4 shadow-lg ${
              t.variant === "destructive"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : "bg-background text-foreground"
            }`}
          >
            <div class="font-semibold">{t.title}</div>
            {t.description && <div class="text-sm opacity-90">{t.description}</div>}
          </div>
        )}
      </For>
    </div>
  );
}
