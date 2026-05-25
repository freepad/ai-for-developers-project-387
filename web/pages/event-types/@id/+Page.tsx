import { createResource, Show, For } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";
import { api } from "../../../src/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Badge } from "../../../src/components/ui/badge";

export default function Page() {
  const pageContext = usePageContext();
  const id = () => pageContext.routeParams.id;

  const [eventType] = createResource(id, api.getEventType);

  // Запрос слотов на ближайшие 14 дней
  const [slots] = createResource(id, (eventTypeId) => {
    const now = new Date();
    const from = now.toISOString();
    const to = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    return api.listSlots(eventTypeId, from, to);
  });

  function formatSlotTime(iso: string) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div class="space-y-6">
      <Show when={eventType.loading}>
        <div class="text-muted-foreground">Загрузка...</div>
      </Show>

      <Show when={eventType.error}>
        <div class="text-destructive">Ошибка: {String(eventType.error)}</div>
      </Show>

      <Show when={eventType()}>
        {(et) => (
          <>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">{et().name}</h1>
              <p class="text-muted-foreground mt-2">{et().description || "Без описания"}</p>
              <Badge class="mt-2" variant="secondary">{et().durationMinutes} минут</Badge>
            </div>

            <div>
              <h2 class="text-xl font-semibold mb-4">Доступные слоты (ближайшие 14 дней)</h2>

              <Show when={slots.loading}>
                <div class="text-muted-foreground">Загрузка слотов...</div>
              </Show>

              <Show when={slots.error}>
                <div class="text-destructive">Ошибка загрузки слотов: {String(slots.error)}</div>
              </Show>

              <Show when={slots()}>
                <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <For each={slots()}>
                    {(slot) => (
                      <Card class={slot.status === "booked" ? "opacity-60" : ""}>
                        <CardHeader class="pb-2">
                          <CardTitle class="text-base">
                            {formatSlotTime(slot.startAt)} — {formatSlotTime(slot.endAt)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div class="flex items-center justify-between">
                            <Badge variant={slot.status === "free" ? "default" : "destructive"}>
                              {slot.status === "free" ? "Свободно" : "Занято"}
                            </Badge>
                            <Show when={slot.status === "free"}>
                              <a
                                href={`/event-types/${et().id}/book?slotStart=${encodeURIComponent(slot.startAt)}&slotEnd=${encodeURIComponent(slot.endAt)}`}
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
                              >
                                Записаться
                              </a>
                            </Show>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
