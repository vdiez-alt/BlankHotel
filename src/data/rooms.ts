// Catálogo de habitaciones (datos oficiales). Para sumar o editar una categoría
// alcanza con modificar este archivo: las páginas se generan a partir de acá.

export interface Room {
  slug: string;
  name: string;
  beds: string;
  area: string;
  areaShort: string;
  highlight: string;
  description: string;
  amenities: string[];
  notice?: string;
  images: string[];
  featured?: boolean;
}

const common = [
  'Smart TV con deco 4K',
  'Escritorio de trabajo',
  'Wi-Fi',
  'Aire acondicionado frío-calor con control individual',
  'Caja de seguridad con capacidad para laptop',
  'Secador de cabello',
  'Pava eléctrica',
  'Minibar',
];

export const rooms: Room[] = [
  {
    slug: 'deluxe-queen',
    name: 'Deluxe Queen',
    beds: 'Dos camas Queen Size',
    area: '34 m²',
    areaShort: '34 m²',
    highlight: 'Ideal para una estadía en familia en Recoleta.',
    description:
      'Exclusivas habitaciones de 34 metros cuadrados, ideales para disfrutar de una estadía en familia en el barrio de Recoleta.',
    amenities: [...common, 'Ventanales con doble vidrio para reducir sonidos del exterior', 'Antebaño', 'Un baño'],
    images: ['deluxe-queen-1.jpg', 'deluxe-queen-2.jpg', 'deluxe-queen-3.jpg', 'deluxe-queen-4.jpg'],
    featured: true,
  },
  {
    slug: 'grand-deluxe-queen',
    name: 'Grand Deluxe Queen',
    beds: 'Dos camas Queen Size',
    area: '37 m²',
    areaShort: '37 m²',
    highlight: 'Con hidromasaje y sofá de lectura.',
    description:
      'Amplias habitaciones de 37 metros cuadrados, todas con hidromasaje para tomar un baño relajante, además cuentan con un sofá de lectura y escritorio de trabajo.',
    amenities: [...common, 'Ventanales con doble vidrio para reducir sonidos del exterior', 'Antebaño y baño completo', 'Hidromasaje', 'Sofá de lectura'],
    images: ['grand-deluxe-queen-1.jpg', 'grand-deluxe-queen-2.jpg', 'grand-deluxe-queen-3.jpg'],
  },
  {
    slug: 'grand-deluxe-king',
    name: 'Grand Deluxe King',
    beds: 'Una cama King Size',
    area: '37 m²',
    areaShort: '37 m²',
    highlight: 'Con hidromasaje y sofá de lectura.',
    description:
      'Amplias habitaciones de 37 metros cuadrados, todas con hidromasaje para tomar un baño relajante, además cuentan con un sofá de lectura y escritorio de trabajo.',
    amenities: [...common, 'Ventanales con doble vidrio para reducir sonidos del exterior', 'Antebaño y baño completo', 'Hidromasaje', 'Sofá de lectura'],
    images: ['grand-deluxe-king-1.jpg', 'grand-deluxe-king-2.jpg', 'grand-deluxe-king-3.jpg', 'grand-deluxe-king-4.jpg'],
    featured: true,
  },
  {
    slug: 'balcony-junior',
    name: 'Balcony Junior',
    beds: 'Una cama King Size',
    area: '26 m² interiores + 6 m² de balcón',
    areaShort: '26 m² + 6 m² balcón',
    highlight: 'Balcón privado con vista al barrio de Recoleta.',
    description:
      'De estilo elegante, las habitaciones Balcony cuentan con 26 metros cuadrados y un balcón privado con vista al barrio de Recoleta.',
    amenities: [...common, 'Baño con dos duchas', 'Balcón privado'],
    notice: 'No apta para personas con movilidad reducida.',
    images: ['balcony-junior-1.jpg', 'balcony-junior-2.jpg', 'balcony-junior-3.jpg', 'balcony-junior-4.jpg'],
    featured: true,
  },
  {
    slug: 'suite-ejecutiva-buenos-aires',
    name: 'Suite Ejecutiva Buenos Aires',
    beds: 'Una cama King Size',
    area: '62 m² totales (54 m² interiores + 8 m² de balcón)',
    areaShort: '62 m²',
    highlight: 'Dos ambientes y balcón privado aterrazado.',
    description:
      'Suite de dos ambientes con un tamaño total de 62 metros cuadrados con un balcón privado aterrazado. Incluye un sofá de lectura y escritorio de trabajo.',
    amenities: [
      'Dos ambientes',
      'Una habitación en suite',
      'Dos baños completamente equipados',
      'Baño completo con bañera de hidromasaje',
      'Segundo baño con box de ducha',
      'Living equipado',
      'Escritorio de trabajo',
      'Smart TV con deco 4K en ambos ambientes',
      'Wi-Fi',
      'Mini cava',
      'Caja de seguridad con capacidad para laptop',
      'Secador de cabello',
      'Pava eléctrica',
      'Minibar',
      'Amplios placares',
      'Balcón terraza',
    ],
    images: ['suite-1.jpg', 'suite-2.jpg', 'suite-3.jpg', 'suite-4.jpg'],
    featured: true,
  },
];
