# Rediseño de la vista de enlaces de Compacto

## Objetivo
Recrear la vista mostrada como una interfaz funcional de gestión de enlaces, siguiendo estrictamente la guía visual de Compacto y usando la imagen solo como referencia estructural.

## Implementación
- Sustituir la pantalla vacía por la vista de enlaces con navegación fija, encabezado operativo y tabla paginada.
- Aplicar el sistema visual indicado: blanco y gris azulado, acentos esmeralda, Outfit/Inter/JetBrains Mono, bordes finos, sombras discretas, botones píldora y cuadrícula técnica tenue.
- Incluir búsqueda, actualización, acciones por fila, estados de vencimiento, paginación y menú móvil con interacciones accesibles.
- Adaptar la tabla a móvil mediante tarjetas compactas para evitar desplazamiento horizontal de la página.
- Incorporar estados claro, oscuro y alto contraste respetando foco visible y reducción de movimiento.
- Añadir metadatos propios de la página y validar visualmente en escritorio y móvil.

## Detalles técnicos
- Los colores, sombras, tipografías y radios se definirán como tokens semánticos globales.
- Los controles usarán iconografía lineal Lucide y etiquetas accesibles.
- Los datos serán demostrativos y permanecerán en el navegador; no se añadirá almacenamiento ni servicios externos.
