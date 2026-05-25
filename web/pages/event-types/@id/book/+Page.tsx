import { createResource, createSignal, Show } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";
import { api } from "../../../../src/api/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Input } from "../../../../src/components/ui/input";
import { Label } from "../../../../src/components/ui/label";
import { toast } from "../../../../src/components/ui/toast";

export default function Page() {
  const pageContext = usePageContext();
  const id = () => pageContext.routeParams.id;
  const search = () => pageContext.urlParsed.search;
  const slotStart = () => search().slotStart as string;
  const slotEnd = () => search().slotEnd as string;

  const [eventType] = createResource(id, api.getEventType);
  const [guestName, setGuestName] = createSignal("");
  const [guestContact, setGuestContact] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createBooking({
        eventTypeId: id(),
        slotStart: slotStart(),
        slotEnd: slotEnd(),
        guestName: guestName() || undefined,
        guestContact: guestContact() || undefined,
      });
      toast({ title: "Успех!", description: "Бронирование создано" });
      window.location.href = "/";
    } catch (err) {
      toast({ title: "Ошибка", description: String(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div class="max-w-md mx-auto space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Бронирование</h1>
        <p class="text-muted-foreground mt-2">Подтвердите запись на встречу</p>
      </div>

      <Show when={eventType()}>
        {(et) => (
          <Card>
            <CardHeader>
              <CardTitle>{et().name}</CardTitle>
              <CardDescription>
                {formatTime(slotStart())} — {formatTime(slotEnd())}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">Длительность: {et().durationMinutes} минут</p>
            </CardContent>
          </Card>
        )}
      </Show>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle class="text-lg">Ваши данные</CardTitle>
            <CardDescription>Заполните контактную информацию</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="guestName">Имя</Label>
              <Input
                id="guestName"
                value={guestName()}
                onInput={(e) => setGuestName(e.currentTarget.value)}
                placeholder="Иван Петров"
              />
            </div>
            <div class="space-y-2">
              <Label for="guestContact">Контакт</Label>
              <Input
                id="guestContact"
                value={guestContact()}
                onInput={(e) => setGuestContact(e.currentTarget.value)}
                placeholder="email или телефон"
              />
            </div>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Назад
            </Button>
            <Button type="submit" disabled={submitting()}>
              {submitting() ? "Создание..." : "Подтвердить запись"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
