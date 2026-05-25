import { createResource, For, Show } from "solid-js";
import { api } from "../../src/api/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";

export default function Page() {
  const [eventTypes] = createResource(api.listEventTypes);

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Доступные типы событий</h1>
        <p class="text-muted-foreground mt-2">Выберите тип встречи для записи</p>
      </div>

      <Show when={eventTypes.loading}>
        <div class="text-muted-foreground">Загрузка...</div>
      </Show>

      <Show when={eventTypes.error}>
        <div class="text-destructive">Ошибка загрузки: {String(eventTypes.error)}</div>
      </Show>

      <Show when={eventTypes()}>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <For each={eventTypes()}>
            {(et) => (
              <Card>
                <CardHeader>
                  <CardTitle>{et.name}</CardTitle>
                  <CardDescription>{et.description || "Без описания"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="flex items-center justify-between">
                    <Badge variant="secondary">{et.durationMinutes} мин</Badge>
                    <a href={`/event-types/${et.id}`} class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3">
                      Выбрать
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
