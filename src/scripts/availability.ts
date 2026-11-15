// Adaptador de disponibilidad del Spa.
// La disponibilidad debe venir SIEMPRE de un sistema real de turnos.
// Mientras no haya API configurada, devuelve `not_configured` y la interfaz
// lo informa: nunca se muestran horarios inventados.
//
// Contrato esperado de la API (ajustable al sistema que provea el hotel):
//   GET {api}/availability?experience={slug}&variant={id}&date=AAAA-MM-DD&people=N
//   -> { "slots": [{ "time": "15:00", "remaining": 4 }] }
// La reserva del turno (y la prevención de duplicados) se resuelve del lado del
// servidor al crear la orden: POST {api}/holds con una clave de idempotencia.

export interface Slot { time: string; remaining: number }
export type Availability =
  | { status: 'ok'; slots: Slot[] }
  | { status: 'not_configured' }
  | { status: 'error' };

export async function getAvailability(api: string, q: { slug: string; variant?: string; date: string; people: number }): Promise<Availability> {
  if (!api) return { status: 'not_configured' };
  try {
    const url = new URL(api.replace(/\/$/, '') + '/availability');
    url.searchParams.set('experience', q.slug);
    if (q.variant) url.searchParams.set('variant', q.variant);
    url.searchParams.set('date', q.date);
    url.searchParams.set('people', String(q.people));
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return { status: 'error' };
    const data = await res.json();
    return { status: 'ok', slots: Array.isArray(data.slots) ? data.slots : [] };
  } catch {
    return { status: 'error' };
  }
}
