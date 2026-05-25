// https://vike.dev/Layout

import "../src/styles/globals.css";

import type { JSX } from "solid-js";
import { Link } from "../components/Link";
import { Toaster } from "../src/components/ui/toast";

export default function Layout(props: { children?: JSX.Element }) {
  return (
    <div class="min-h-screen bg-background text-foreground">
      <header class="border-b bg-card px-4 py-3">
        <div class="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/" class="text-lg font-semibold tracking-tight">
            Calendar App
          </a>
          <nav class="flex items-center gap-4 text-sm font-medium">
            <Link href="/" class="hover:text-primary transition-colors">
              Записаться
            </Link>
            <Link href="/admin/event-types" class="hover:text-primary transition-colors">
              Управление
            </Link>
            <Link href="/admin/bookings" class="hover:text-primary transition-colors">
              Бронирования
            </Link>
          </nav>
        </div>
      </header>
      <main class="mx-auto max-w-5xl px-4 py-6">
        {props.children}
      </main>
      <Toaster />
    </div>
  );
}
