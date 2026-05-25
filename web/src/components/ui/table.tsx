import type { ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";

export function Table(props: ComponentProps<"table">) {
  return (
    <div class="relative w-full overflow-auto">
      <table class={cn("w-full caption-bottom text-sm", props.class)} {...props}>
        {props.children}
      </table>
    </div>
  );
}

export function TableHeader(props: ComponentProps<"thead">) {
  return <thead class={cn("[&_tr]:border-b", props.class)} {...props} />;
}

export function TableBody(props: ComponentProps<"tbody">) {
  return <tbody class={cn("[&_tr:last-child]:border-0", props.class)} {...props} />;
}

export function TableRow(props: ComponentProps<"tr">) {
  return (
    <tr
      class={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", props.class)}
      {...props}
    />
  );
}

export function TableHead(props: ComponentProps<"th">) {
  return (
    <th
      class={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        props.class
      )}
      {...props}
    />
  );
}

export function TableCell(props: ComponentProps<"td">) {
  return (
    <td class={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", props.class)} {...props} />
  );
}
