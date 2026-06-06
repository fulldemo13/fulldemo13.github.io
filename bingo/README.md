# Bingo Musical — Generador de cartrons

Generador de cartrons de bingo musical per a festes i esdeveniments. Introduïx una llista de cançons, tria quants cartrons vols generar, selecciona el tamany, les tipografies i els colors, i imprimeix-los per jugar en viu.

Cada cartró és una graella de 3×3 amb 9 cançons triades aleatòriament de la vostra llista. L'amfitrió reprodueix fragments de les cançons i els jugadors marquen les que tenen al seu cartró. Qui complete una línia, crida «Bingo!».

## Com arrancar en local

### Amb Docker

```bash
docker compose up
```

Obri el navegador en [http://localhost:8080](http://localhost:8080).

### Sense Docker

Qualsevol servidor estàtic serveix. Per exemple:

```bash
python3 -m http.server 8080
```

I obri [http://localhost:8080](http://localhost:8080).

## Com funciona

1. **Introduïx les cançons** — Una cançó per línia al quadre de text. Mínim 9 ítems únics.
2. **Tria la quantitat de cartrons** — Cada cartró conté 9 cançons diferents, seleccionades aleatòriament.
3. **Tria el tamany de cartró** — Des de 200×200 mm (1 per pàgina) fins a 67×67 mm (12 per pàgina). Per defecte, 96×96 mm (6 per pàgina).
4. **Posa un títol** — Si ho deixes buit, s'utilitza «Bingo Benitandús fest».
5. **Tria tipografia i colors** — Selecciona la lletra del títol i de les cançons, i personalitza els colors de la capçalera i les cel·les.
6. **Genera** — Es creen els cartrons, tots únics (cap repetit). Si alguna cançó o el títol no cap a la cel·la, es mostra un avís en roig.
7. **Imprimeix** — El botó d'imprimir apareix després de generar. Si hi ha errors de desbordament, no es pot imprimir fins que es corregeixin.

## Detalls tècnics

- Lloc estàtic pur: `index.html` + `app.js` + `style.css`
- Sense npm, sense bundler, sense framework
- Barreja amb Fisher-Yates i unicitat per signatura ordenada (C(n,9) màxim de combinacions possibles)
- Detecció de desbordament: es comprova després de renderitzar (amb `document.fonts.ready`) que el títol i les cançons capiguen a les cel·les
- Tamany de cartró dinàmic: `calculateGrid()` calcula el millor layout (columnes×files) per a A4 portrait i la mida del cartró en mm
- Disseny inspirat en GitHub amb colors personalizables via selectores de color
- Desplegat a GitHub Pages des de la branca `main`