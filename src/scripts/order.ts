// Utilidades compartidas por el carrito y el checkout.
import { getCart, type CartItem } from './cart';

export interface CatalogEntry { name: string; price: number; priceMax: number | null; variants: { id: string; name: string; price: number }[]; image: string; url: string }
export interface Line { item: CartItem; index: number; entry: CatalogEntry; variantName?: string; unit: number; total: number }

export const catalog = (): Record<string, CatalogEntry> => JSON.parse(document.getElementById('catalog')?.textContent || '{}');
export const ars = (n: number) => '$' + n.toLocaleString('es-AR');
export const nice = (s?: string) => (s ? s.split('-').reverse().join('/') : '');

/** Líneas válidas del carrito con su precio unitario real (según catálogo). */
export function lines(): Line[] {
  const cat = catalog();
  const out: Line[] = [];
  getCart().forEach((item, index) => {
    const entry = cat[item.slug];
    if (!entry) return;
    const v = entry.variants.find((x) => x.id === item.variantId);
    // Una experiencia con rango de precios solo se puede comprar con variante definida.
    if (entry.priceMax && !v) return;
    const unit = v ? v.price : entry.price;
    out.push({ item, index, entry, variantName: v?.name, unit, total: unit * item.qty });
  });
  return out;
}
export const subtotal = (ls: Line[]) => ls.reduce((n, l) => n + l.total, 0);
