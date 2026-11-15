// Datos generales del sitio e integraciones.
// Todo lo que dependa de un sistema externo se configura acá (o por variable de entorno).

export const SITE = {
  name: 'Blank Hotel Recoleta',
  tagline: 'Hotel & Spa en el corazón de Buenos Aires',
  address: 'Peña 2049',
  district: 'Recoleta, CABA',
  fullAddress: 'Peña 2049, Recoleta, Ciudad Autónoma de Buenos Aires, Argentina',
  phoneLabel: '4800-1992',
  phoneHref: 'tel:+541148001992',
  whatsappLabel: '11 6155-4966',
  whatsappNumber: '5491161554966',
  instagramLabel: '@blankhotelrecoleta',
  instagramHref: 'https://www.instagram.com/blankhotelrecoleta/',
  mapsEmbed: 'https://www.google.com/maps?q=Pe%C3%B1a+2049,+Recoleta,+Buenos+Aires&output=embed',
  mapsLink: 'https://www.google.com/maps/dir/?api=1&destination=Pe%C3%B1a+2049,+Recoleta,+Buenos+Aires',
  checkIn: '15:00 hs',
  checkOut: '12:00 hs',
};

export const INTEGRATIONS = {
  // Motor de reservas hotelero. Con la URL cargada, la barra de búsqueda redirige
  // al motor con las fechas y ocupación como parámetros (ver src/scripts/site.ts).
  bookingEngineUrl: import.meta.env.PUBLIC_BOOKING_ENGINE_URL || '',
  // API de turnos / disponibilidad del Spa (ver src/scripts/availability.ts).
  spaAvailabilityApi: import.meta.env.PUBLIC_SPA_AVAILABILITY_API || '',
  // Endpoint propio (backend) que crea la preferencia de pago en la pasarela.
  // Nunca se exponen credenciales de la pasarela en el frontend.
  paymentCheckoutEndpoint: import.meta.env.PUBLIC_PAYMENT_CHECKOUT_ENDPOINT || '',
};

export const NAV = [
  { label: 'Hotel', href: 'hotel' },
  { label: 'Habitaciones', href: 'habitaciones' },
  { label: 'Spa', href: 'spa' },
  { label: 'Ubicación', href: 'ubicacion' },
  { label: 'Contacto', href: 'contacto' },
];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Arma una URL interna respetando el `base` del sitio. */
export const u = (path = '') => `${base}/${path.replace(/^\//, '')}`;
export const wa = (text = '') =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
