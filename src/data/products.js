import arroz from '../assets/img/arroz.jpg';
import aceite from '../assets/img/aceite.jpg';
import leche from '../assets/img/leche.jpg';
import fideos from '../assets/img/fideos.jpg';
import agua from '../assets/img/agua.jpg';
import gaseosa from '../assets/img/gaseosa.jpg';
import jugo from '../assets/img/jugo.jpg';
import detergente from '../assets/img/detergente.jpg';
import lejia from '../assets/img/lejia.jpg';
import lavavajillas from '../assets/img/lavavajillas.jpg';
import papel from '../assets/img/papel.jpg';
import desinfectante from '../assets/img/desinfectante.jpg';

import heroBebidas from '../assets/img/hero-bebidas.jpg';
import heroLimpieza from '../assets/img/hero-limpieza.jpg';
import heroDespensa from '../assets/img/hero-despensa.jpg';

export const HERO_IMAGES = {
  bebidas: heroBebidas,
  limpieza: heroLimpieza,
  alimentos: heroDespensa,
};

export const CATEGORIES = [
  { id: 'alimentos', label: 'Alimentos', image: heroDespensa },
  { id: 'bebidas', label: 'Bebidas', image: heroBebidas },
  { id: 'limpieza', label: 'Limpieza', image: heroLimpieza },
];

// stock: 0 = agotado · stock ≤ min = "Últimas N" (también genera alerta en el panel admin)
export const PRODUCTS = [
  { id: 1, name: 'Arroz Extra 5kg', category: 'alimentos', price: 22.9, stock: 48, min: 10, image: arroz },
  { id: 2, name: 'Aceite Vegetal 1L', category: 'alimentos', price: 9.5, stock: 6, min: 12, image: aceite },
  { id: 3, name: 'Leche Evaporada x6', category: 'alimentos', price: 21.0, stock: 30, min: 8, image: leche },
  { id: 4, name: 'Fideos Spaghetti 1kg', category: 'alimentos', price: 5.8, stock: 0, min: 15, image: fideos },
  { id: 5, name: 'Agua Mineral 2.5L', category: 'bebidas', price: 3.5, stock: 72, min: 20, image: agua },
  { id: 6, name: 'Gaseosa 3L', category: 'bebidas', price: 11.9, stock: 14, min: 12, image: gaseosa },
  { id: 7, name: 'Jugo de Naranja 1L', category: 'bebidas', price: 6.2, stock: 25, min: 10, image: jugo },
  { id: 8, name: 'Detergente 2kg', category: 'limpieza', price: 18.9, stock: 4, min: 10, image: detergente },
  { id: 9, name: 'Lejía 1L', category: 'limpieza', price: 4.5, stock: 40, min: 15, image: lejia },
  { id: 10, name: 'Lavavajillas 900ml', category: 'limpieza', price: 7.9, stock: 22, min: 8, image: lavavajillas },
  { id: 11, name: 'Papel Higiénico x12', category: 'limpieza', price: 16.5, stock: 35, min: 10, image: papel },
  { id: 12, name: 'Desinfectante 900ml', category: 'limpieza', price: 8.9, stock: 11, min: 10, image: desinfectante },
];

export const REGIONS = [
  'Huánuco', 'Puno', 'Tacna', 'Lima', 'Arequipa', 'La Libertad', 'Piura', 'Lambayeque',
  'Cajamarca', 'Junín', 'Cusco', 'Ica', 'Áncash', 'San Martín', 'Loreto', 'Ucayali',
];

export const money = (n) => `S/ ${n.toFixed(2)}`;
