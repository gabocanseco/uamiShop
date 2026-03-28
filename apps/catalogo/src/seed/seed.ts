import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductoOrmEntity } from '@catalogo/infrastructure/persistence/entities/producto-orm.entity';
import { CategoriaOrmEntity } from '@catalogo/infrastructure/persistence/entities/categoria-orm.entity';
import { MoneyOrmEmbeddable } from '@app/shared/infrastructure/persistance/embeddables/money-orm.embeddable';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307', 10),
  username: process.env.DB_USERNAME || 'uamishop',
  password: process.env.DB_PASSWORD || 'uamishop',
  database: process.env.DB_DATABASE || 'uamishop_catalogo',
  synchronize: false,
  logging: false,
  entities: [ProductoOrmEntity, CategoriaOrmEntity],
});

const categorias = [
  { id: uuidv4(), nombre: 'Electrónica', descripcion: 'Devices and gadgets' },
  { id: uuidv4(), nombre: 'Ropa', descripcion: 'Fashion and apparel' },
  { id: uuidv4(), nombre: 'Hogar', descripcion: 'Home and living' },
  { id: uuidv4(), nombre: 'Deportes', descripcion: 'Sports and fitness' },
  { id: uuidv4(), nombre: 'Libros', descripcion: 'Books and literature' },
];

function makePrecio(cantidad: number, moneda: string): MoneyOrmEmbeddable {
  const p = new MoneyOrmEmbeddable();
  p.cantidad = cantidad;
  p.moneda = moneda;
  return p;
}

const electronicaId = categorias[0].id;
const ropaId = categorias[1].id;
const hogarId = categorias[2].id;
const deportesId = categorias[3].id;
const librosId = categorias[4].id;

const productos: Partial<ProductoOrmEntity>[] = [
  {
    id: uuidv4(),
    nombre: 'Auriculares Inalámbricos Pro',
    descripcion:
      'Auriculares con cancelación de ruido, batería de 30 horas y sonido premium.',
    precio: makePrecio(149.99, 'MX'),
    categoriaId: electronicaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/headphones1/400/400',
        alt: 'Auriculares',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Smartwatch Fitness',
    descripcion:
      'Reloj inteligente con monitor de frecuencia cardíaca, GPS y resistencia al agua.',
    precio: makePrecio(199.99, 'MX'),
    categoriaId: electronicaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/smartwatch1/400/400',
        alt: 'Smartwatch',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Cámara Digital Compacta',
    descripcion: 'Cámara de 24MP con zoom óptico 10x y grabación en Full HD.',
    precio: makePrecio(349.99, 'MX'),
    categoriaId: electronicaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/camera1/400/400',
        alt: 'Cámara',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Altavoz Bluetooth Resistente',
    descripcion:
      'Altavoz portátil con sonido 360°, resistente al agua y batería de 20 horas.',
    precio: makePrecio(79.99, 'MX'),
    categoriaId: electronicaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/speaker1/400/400',
        alt: 'Altavoz',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Chaqueta de Cuero Premium',
    descripcion:
      'Chaqueta de cuero genuino con forro de satén. Estilo clásico y atemporal.',
    precio: makePrecio(299.99, 'MX'),
    categoriaId: ropaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/jacket1/400/400',
        alt: 'Chaqueta',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Zapatillas Running Elite',
    descripcion:
      'Zapatillas con tecnología de amortiguación avanzada para máximo rendimiento.',
    precio: makePrecio(129.99, 'MX'),
    categoriaId: ropaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/sneakers1/400/400',
        alt: 'Zapatillas',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Camiseta Algodón Orgánico',
    descripcion:
      'Camiseta 100% algodón orgánico, suave y transpirable. Colores variados.',
    precio: makePrecio(29.99, 'MX'),
    categoriaId: ropaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/tshirt1/400/400',
        alt: 'Camiseta',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Gorra Deportivo Pro',
    descripcion:
      'Gorra con tecnología antihumedad y protección UV. Ajuste cómoda.',
    precio: makePrecio(24.99, 'MX'),
    categoriaId: ropaId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/cap1/400/400',
        alt: 'Gorra',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Lámpara de Mesa Minimalista',
    descripcion:
      'Lámpara LED con brillo regulable y diseño moderno. Perfecta para escritorio.',
    precio: makePrecio(59.99, 'MX'),
    categoriaId: hogarId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/lamp1/400/400',
        alt: 'Lámpara',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Juego de Sábanas Egyptian',
    descripcion:
      'Juego de sábanas de egipcio de 400 hilos. Suavidad y durabilidad extrema.',
    precio: makePrecio(89.99, 'MX'),
    categoriaId: hogarId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/bedsheet1/400/400',
        alt: 'Sábanas',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Espejo Decorativo Redondo',
    descripcion:
      'Espejo de pared con marco de madera natural. Diseño minimalista.',
    precio: makePrecio(79.99, 'MX'),
    categoriaId: hogarId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/mirror1/400/400',
        alt: 'Espejo',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Set de Cojines Decorativos',
    descripcion:
      'Set de 4 cojines con fundas removibles. Diferentes tamaños y texturas.',
    precio: makePrecio(49.99, 'MX'),
    categoriaId: hogarId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/pillow1/400/400',
        alt: 'Cojines',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Mancuras Dumbbells 20kg',
    descripcion:
      'Set de mancuernas ajustables de 20kg. Acero inoxidable con recubrimiento.',
    precio: makePrecio(159.99, 'MX'),
    categoriaId: deportesId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/dumbbell1/400/400',
        alt: 'Mancuernas',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Esterilla Yoga Premium',
    descripcion: 'Esterilla antideslizante de 6mm. Ecológica y biodegradable.',
    precio: makePrecio(39.99, 'MX'),
    categoriaId: deportesId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/yogamat1/400/400',
        alt: 'Esterilla',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Cuerda para Saltar Profesional',
    descripcion:
      'Cuerda con rodamientos internos. Velocidad ultra-rápida y regulable.',
    precio: makePrecio(19.99, 'MX'),
    categoriaId: deportesId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/ropeskip1/400/400',
        alt: 'Cuerda',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Balón de Fútbol Profesional',
    descripcion:
      'Balón oficial con tecnología de paneles Sync. Varios tamaños disponibles.',
    precio: makePrecio(34.99, 'MX'),
    categoriaId: deportesId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/football1/400/400',
        alt: 'Balón',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'El Arte de la Guerra',
    descripcion:
      'Clásico de Sun Tzu sobre estrategia militar y liderazgo. Edición premium.',
    precio: makePrecio(24.99, 'MX'),
    categoriaId: librosId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/book1/400/400',
        alt: 'Libro',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Cien Años de Soledad',
    descripcion:
      'Obra maestra de Gabriel García Márquez. Edición aniversario hardcover.',
    precio: makePrecio(29.99, 'MX'),
    categoriaId: librosId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/book2/400/400',
        alt: 'Libro',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'Steve Jobs Biografía',
    descripcion:
      'Biografía autorizada por Walter Isaacson. Ed. actualizada con nuevos capítulos.',
    precio: makePrecio(19.99, 'MX'),
    categoriaId: librosId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/book3/400/400',
        alt: 'Libro',
        orden: 1,
      },
    ],
  },
  {
    id: uuidv4(),
    nombre: 'El Poder del Hábito',
    descripcion:
      'Charles Duhigg explica la ciencia de los hábitos. Bestseller mundial.',
    precio: makePrecio(16.99, 'MX'),
    categoriaId: librosId,
    disponible: true,
    fechaCreacion: new Date(),
    imagenes: [
      {
        id: uuidv4(),
        url: 'https://picsum.photos/seed/book4/400/400',
        alt: 'Libro',
        orden: 1,
      },
    ],
  },
];

async function seed() {
  console.log('Iniciando seed de datos...\n');

  try {
    await AppDataSource.initialize();
    console.log('Conexión a base de datos establecida\n');

    const categoriaRepo = AppDataSource.getRepository(CategoriaOrmEntity);
    const productoRepo = AppDataSource.getRepository(ProductoOrmEntity);

    // Insertar categorías (upsert)
    console.log('Insertando categorías...');
    for (const cat of categorias) {
      await categoriaRepo.save(cat);
      console.log(` ${cat.nombre}`);
    }

    // Insertar productos (upsert)
    console.log('\nInsertando productos...');
    for (const prod of productos) {
      await productoRepo.save(prod);
      console.log(`  ${prod.nombre}`);
    }

    console.log('\nSeed completado exitosamente!');
    console.log(`Categorías: ${categorias.length}`);
    console.log(`Productos: ${productos.length}`);
  } catch (error) {
    console.error(' Error durante el seed:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('\nConexión cerrada.');
  }
}

seed();
