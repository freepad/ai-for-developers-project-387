import { createResource, createSignal, For, Show } from "solid-js";
import { api } from "../../../src/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import { Label } from "../../../src/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../src/components/ui/table";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../src/components/ui/dialog";
import { toast } from "../../../src/components/ui/toast";

export default function Page() {
  const [eventTypes, { refetch }] = createResource(api.listEventTypes);
  const [open, setOpen] = createSignal(false);
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [duration, setDuration] = createSignal(30);
  const [submitting, setSubmitting] = createSignal(false);

  async function handleCreate(e: Event) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createEventType({
        name: name(),
        description: description() || undefined,
        durationMinutes: Number(duration()),
      });
      toast({ title: "Успех!", description: "Тип события создан" });
      setOpen(false);
      setName("");
      setDescription("");
      setDuration(30);
      refetch();
    } catch (err) {
      toast({ title: "Ошибка", description: String(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Типы событий</h1>
          <p class="text-muted-foreground mt-2">Управление доступными типами встреч</p>
        </div>
        <Button onClick={() => setOpen(true)}>Создать тип</Button>
      </div>

      <Show when={eventTypes.loading}>
        <div class="text-muted-foreground">Загрузка...</div>
      </Show>

      <Show when={eventTypes.error}>
        <div class="text-destructive">Ошибка: {String(eventTypes.error)}</div>
      </Show>

      <Show when={eventTypes()}>
        <Card>
          <CardHeader>
            <CardTitle>Список</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Длительность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <For each={eventTypes()}>
                  {(et) => (
                    <TableRow>
                      <TableCell class="font-medium">{et.name}</TableCell>
                      <TableCell>{et.description || "—"}</TableCell>
                      <TableCell>{et.durationMinutes} мин</TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Show>

      <Dialog open={open()} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Новый тип события</DialogTitle>
          <DialogDescription>Заполните поля ниже</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label for="name">Название *</Label>
              <Input id="name" value={name()} onInput={(e) => setName(e.currentTarget.value)} required />
            </div>
            <div class="space-y-2">
              <Label for="description">Описание</Label>
              <Input id="description" value={description()} onInput={(e) => setDescription(e.currentTarget.value)} />
            </div>
            <div class="space-y-2">
              <Label for="duration">Длительность (мин) *</Label>
              <Input id="duration" type="number" value={duration()} onInput={(e) => setDuration(Number(e.currentTarget.value))} required min={1} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button type="submit" disabled={submitting()}>
              {submitting() ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
