// Carrito de experiencias. Se guarda en el navegador (localStorage):
// no se almacenan datos de pago ni información sensible.

export interface CartItem {
  slug: string;
  variantId?: string;
  qty: number;
  /** Fecha preferida (AAAA-MM-DD). Se confirma contra la disponibilidad real. */
  date?: string;
  time?: string;
  people?: number;
}

const KEY = 'blank_cart_v1';

export function getCart(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  document.dispatchEvent(new CustomEvent('cart:change'));
}

const same = (a: CartItem, b: CartItem) => a.slug === b.slug && (a.variantId || '') === (b.variantId || '') && (a.date || '') === (b.date || '');

export function addItem(item: CartItem) {
  const items = getCart();
  const found = items.find((i) => same(i, item));
  if (found) found.qty += item.qty;
  else items.push(item);
  save(items);
}

export function setQty(index: number, qty: number) {
  const items = getCart();
  if (!items[index]) return;
  if (qty <= 0) items.splice(index, 1);
  else items[index].qty = qty;
  save(items);
}

export function removeItem(index: number) {
  const items = getCart();
  items.splice(index, 1);
  save(items);
}

export function clearCart() {
  save([]);
}

export const count = () => getCart().reduce((n, i) => n + i.qty, 0);
export const ars = (n: number) => '$' + n.toLocaleString('es-AR');
