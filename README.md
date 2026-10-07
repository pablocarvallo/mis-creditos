# Mis Créditos

App web personal para seguir el avance de pago de créditos de consumo y de un crédito hipotecario en UF.
Se publica con GitHub Pages desde la rama `gh-pages` y se usa en el iPhone agregándola a la pantalla de inicio desde Safari.

## Qué hace

- Muestra el monto pendiente de cada crédito y el total de los créditos de consumo.
- Permite registrar el pago de cada cuota y recalcula el monto pendiente.
- Guarda los datos solo en el dispositivo (`localStorage`). Este repositorio no contiene datos de ningún crédito.
- Incluye respaldo e importación mediante un código de texto.
- Funciona sin conexión después de la primera carga (`sw.js`).

## Cálculo

Monto pendiente = cuota × ((1 + i)^D − 1) / (i × (1 + i)^D) + ajuste, donde `i` es la tasa mensual y `D` las cuotas pendientes.
Los créditos en pesos se redondean a $10.000 y el total de consumo a $100.000. El hipotecario se muestra en UF con dos decimales.

## Archivos

- `index.html`: la app completa (estructura, estilos y lógica).
- `manifest.webmanifest`, `icons/`: nombre e ícono de la app.
- `sw.js`: copia local para abrir sin conexión.
- `fonts/`: tipografías Bricolage Grotesque, Figtree y JetBrains Mono, distribuidas bajo la licencia SIL Open Font License 1.1.
