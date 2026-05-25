import { createSignal, type JSX, type ComponentProps, For } from "solid-js";
import { cn } from "@/lib/utils";

export function Tabs(props: { defaultValue: string; children: JSX.Element; class?: string }) {
  const [value, setValue] = createSignal(props.defaultValue);

  return (
    <div class={cn("w-full", props.class)} data-tabs-context={value()}>
      <TabsContext.Provider value={{ value, setValue }}>
        {props.children}
      </TabsContext.Provider>
    </div>
  );
}

import { createContext, useContext } from "solid-js";

const TabsContext = createContext<{ value: () => string; setValue: (v: string) => void } | undefined>(undefined);

export function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used within Tabs");
  return ctx;
}

export function TabsList(props: ComponentProps<"div">) {
  return (
    <div class={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", props.class)} {...props}>
      {props.children}
    </div>
  );
}

export function TabsTrigger(props: ComponentProps<"button"> & { value: string }) {
  const [local, rest] = splitProps(props, ["value", "class"]);
  const ctx = useTabs();

  return (
    <button
      class={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        ctx.value() === local.value
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50 hover:text-foreground",
        local.class
      )}
      onClick={() => ctx.setValue(local.value)}
      {...rest}
    />
  );
}

export function TabsContent(props: ComponentProps<"div"> & { value: string }) {
  const [local, rest] = splitProps(props, ["value", "class"]);
  const ctx = useTabs();

  return (
    <Show when={ctx.value() === local.value}>
      <div class={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", local.class)} {...rest}>
        {props.children}
      </div>
    </Show>
  );
}

import { Show, splitProps } from "solid-js";
