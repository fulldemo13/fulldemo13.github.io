# fulldemo13.github.io

Eines web gratuïtes, fetes amb ❤️ al País Valencià.

## Eines

| Eina | Descripció |
|------|-------------|
| [🎲 Bingo Musical](https://fulldemo13.github.io/bingo/) | Genera cartrons de bingo musical personalitzats. Introduïx cançons, tria tipografia i colors, i imprimeix-los per jugar en viu. |
| [🌳 Monumental Vilafranca](https://testmonumental.duckdns.org/home) | Descobreix els arbres monumentals de Vilafranca, explora rutes verdes i segueix el teu progrés amb un clic. Tot offline, amb mapes interactius i estadístiques personals. *(En desenvolupament)* |

## Desenvolupament

Cada eina viu en la seua pròpia subcarpeta (`bingo/`, etc.) com a lloc estàtic independent.

```bash
# Amb Docker
docker compose up
# → http://localhost:8080/bingo/

# Sense Docker
python3 -m http.server 8080
# → http://localhost:8080/bingo/
```

## Desplegament

Pujar a la branca `main` publica automàticament a GitHub Pages.

- Pàgina principal: [fulldemo13.github.io](https://fulldemo13.github.io/)
- Bingo Musical: [fulldemo13.github.io/bingo/](https://fulldemo13.github.io/bingo/)