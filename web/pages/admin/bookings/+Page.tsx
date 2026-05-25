import { createResource, For, Show } from "solid-js";
import { api } from "../../../src/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../src/components/ui/table";
import { Badge } from "../../../src/components/ui/badge";

export default function Page() {
  const [bookings] = createResource(api.listBookings);

  function formatTime(iso: string) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Бронирования</h1>
        <p class="text-muted-foreground mt-2">Все предстоящие записи</p>
      </div>

      <Show when={bookings.loading}>
        <div class="text-muted-foreground">Загрузка...</div>
      </Show>

      <Show when={bookings.error}>
        <div class="text-destructive">Ошибка: {String(bookings.error)}</div>
      </Show>

      <Show when={bookings()}>
        <Card>
          <CardHeader>
            <CardTitle>Список бронирований</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Гость</TableHead>
                  <TableHead>Контакт</TableHead>
                  <TableHead>Время начала</TableHead>
                  <TableHead>Время окончания</TableHead>
                  <TableHead>Создано</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <For each={bookings()}>
                  {(b) => (
                    <TableRow>
                      <TableCell class="font-medium">{b.guestName || "—"}</TableCell>
                      <TableCell>{b.guestContact || "—"}</TableCell>
                      <TableCell>{formatTime(b.slotStart)}</TableCell>
                      <TableCell>{formatTime(b.slotEnd)}</TableCell>
                      <TableCell>{formatTime(b.createdAt)}</TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Show>
    </div>
  );
}
