// Catálogo comercial de experiencias del Spa (precios en ARS).
// Los campos vacíos (descripción, incluye, duración, personas, condiciones, variantes)
// quedan preparados para completarse cuando el hotel envíe la información:
// la ficha los muestra automáticamente apenas tienen contenido.

export interface Variant {
  id: string;
  name: string;
  price: number;
}

export interface Experience {
  slug: string;
  name: string;
  /** Precio fijo, o piso del rango cuando hay variantes. */
  price: number;
  /** Tope del rango. Si existe, la experiencia tiene variantes comerciales. */
  priceMax?: number;
  /** Variantes con su precio individual. Vacío = todavía no configuradas. */
  variants: Variant[];
  description?: string;
  includes?: string[];
  duration?: string;
  people?: string;
  conditions?: string[];
  images: string[];
}

export const experiences: Experience[] = [
  { slug: 'te-de-la-tarde', name: 'Té de la tarde', price: 50000, variants: [], images: ['spa-te.jpg', 'spa-snack.jpg'] },
  { slug: 'desconectate', name: 'Desconectate', price: 120000, priceMax: 330000, variants: [], images: ['spa-toalla.jpg', 'spa-hidro.jpg'] },
  { slug: 'noche-romantica-para-2', name: 'Noche Romántica para 2', price: 290000, variants: [], images: ['spa-tragos.jpg', 'spa-vertical.jpg'] },
  { slug: 'escapada-blank', name: 'Escapada Blank', price: 250000, priceMax: 350000, variants: [], images: ['desayuno-cama.jpg', 'spa-hidro.jpg'] },
  { slug: 'spa-day-mujeres', name: 'Spa Day Mujeres', price: 110000, priceMax: 160000, variants: [], images: ['spa-lectura.jpg', 'spa-sauna-2.jpg'] },
  { slug: 'spa-day', name: 'Spa Day', price: 110000, priceMax: 320000, variants: [], images: ['spa-sauna.jpg', 'spa-vertical.jpg'] },
];

export const ars = (n: number) => '$' + n.toLocaleString('es-AR');
export const hasRange = (e: Experience) => typeof e.priceMax === 'number';
/** Se puede comprar online si tiene precio fijo o variantes ya configuradas. */
export const isPurchasable = (e: Experience) => !hasRange(e) || e.variants.length > 0;
export const priceLabel = (e: Experience) => (hasRange(e) ? `${ars(e.price)} — ${ars(e.priceMax!)}` : ars(e.price));

export const spaServices = ['Circuito de relax', 'Sauna', 'Sala de vapor', 'Hidromasaje', 'Masajes'];

export const hotelServices = [
  'Wi-Fi', 'Estacionamiento', 'Gimnasio', 'Recepción 24 horas', 'Caja de seguridad', 'Guarda equipajes',
  'Servicio de habitaciones', 'Lavandería y limpieza en seco', 'Asistencia turística', 'Bar / salón',
  'Zona de comedor exterior', 'Cunas', 'Spa', 'Sauna', 'Sala de vapor', 'Masajes', 'Aire acondicionado',
  'Habitaciones insonorizadas', 'Ascensor', 'Habitaciones aptas para personas con movilidad reducida',
];
