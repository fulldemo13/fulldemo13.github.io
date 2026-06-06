# Bingo Musical — Generador de cartrons

Generador de cartrons de bingo musical per a festes i esdeveniments. Introduïx una llista de cançons, tria quants cartrons vols generar i imprimeix-los per jugar en viu.

Cada cartró és una graella de 3×3 amb 9 cançons triades aleatòriament de la vostra llista. S'imprimeixen 6 cartrons per pàgina. L'amfitrió reprodueix fragments de les cançons i els jugadors marquen les que tenen al seu cartró. Qui complete una línia, crida «Bingo!».

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
3. **Posa un títol** — Si ho deixes buit, s'utilitza «Bingo Benitandús fest».
4. **Genera** — Es creen els cartrons, tots únics (cap repetit).
5. **Imprimeix** — El botó d'imprimir apareix després de generar. S'imprimeixen 6 cartrons per pàgina.

## Detalls tècnics

- Lloc estàtic pur: `index.html` + `app.js` + `style.css`
- Sense npm, sense bundler, sense framework
- Barreja amb Fisher-Yates i unicitat per signatura ordenada (C(n,9) màxim de combinacions possibles)
- Desplegat a GitHub Pages des de la branca `main`