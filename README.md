# Market Express · Frontend (React)

Réplica del frontend de la tienda. Solo **React + JavaScript + HTML + CSS** (sin backend).

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # versión de producción en /dist
```

## Estructura

```
src/
  assets/img/        imágenes (productos, banners, foto de "Sobre nosotros")
  components/        Header, Hero (carrusel), Ticker, Features, Categories,
                     Catalog, ProductCard, About, CartDrawer, Toast, Footer, Logo
  context/           CartContext (carrito) y AuthContext (sesión simulada)
  data/products.js   productos, categorías y regiones (datos de ejemplo)
  pages/             Home y AuthPage (login, registro y acceso administrador)
  styles.css         todos los estilos
```

## Rutas

- Tienda: `/` · `/login` · `/registro`
- Admin: `/admin` (acceso) → `/admin/resumen` · `/admin/productos` · `/admin/entradas` · `/admin/salidas` · `/admin/alertas`

## Notas

- Los productos están en `src/data/products.js`; cambia nombres, precios o `stock` ahí
  (`stock: 0` muestra "Agotado" y `stock ≤ 6` muestra "Últimas N").
- El carrito se guarda en `localStorage`. El login/registro solo valida el formulario y
  simula la sesión en el navegador: no se conecta a ningún servidor.

## Tienda y panel admin conectados

Comparten un inventario (`src/context/InventoryContext.jsx`, guardado en `localStorage`):

- Comprar en la tienda (Finalizar compra) descuenta el stock y crea una salida "Venta online" en el panel.
- Registrar una **entrada** sube el stock; una **salida** lo baja (no deja sacar más de lo disponible).
- Un producto con `stock ≤ mínimo` muestra "Últimas N" en la tienda y aparece en **Alertas** y en el **Resumen**.
- Productos nuevos, retirados, mínimos editados y fotos subidas desde el panel se reflejan en la tienda.
- "Registrar reposición" (Alertas) abre Entradas con el producto ya seleccionado.
- El acceso admin es simulado: en `/admin` cualquier correo y contraseña válidos entran.
