import { createMemo, type JSX } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";
import { cn } from "../src/lib/utils";

export function Link(props: { href: string; children: JSX.Element; class?: string }) {
  const pageContext = usePageContext();
  const isActive = createMemo(() =>
    props.href === "/"
      ? pageContext.urlPathname === props.href
      : pageContext.urlPathname.startsWith(props.href),
  );
  return (
    <a
      href={props.href}
      class={cn(
        "transition-colors",
        isActive() ? "text-primary font-semibold" : "text-foreground/60 hover:text-foreground",
        props.class
      )}
    >
      {props.children}
    </a>
  );
}
