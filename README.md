# EduMind

Webová aplikácia na precvičovanie učiva 5. ročníka ZŠ: slovenčina, matematika, angličtina, geografia, biológia, dejepis.
Funguje v prehliadači, dá sa pridať na plochu tabletu a po prvom otvorení funguje aj bez internetu.

## Súbory

| Súbor | Čo obsahuje |
|---|---|
| `src/app.html` | **zdrojový súbor** – vzhľad (CSS), logika (JavaScript) aj všetko učivo; úpravy robiť tu |
| `tools/build.js` | z `src/app.html` vytvorí `index.html`, `manifest.webmanifest` a `sw.js` (`node tools/build.js`) |
| `index.html` | zostavená aplikácia, ktorú otvárajú deti (generuje sa) |
| `manifest.webmanifest` | názov a ikona pre „Pridať na plochu" |
| `sw.js` | ukladanie aplikácie pre prácu bez internetu |
| `robots.txt` | zákaz indexovania vyhľadávačmi (spolu s meta `noindex`, ktorú pridáva build) |
| `icons/` | ikony aplikácie |

## Kde je učivo (v `src/app.html`)

- Slovenčina: polia `R_SD`, `R_PICK`, `R_TAG`, `R_PM`, `R_PADY`, `R_PREDL`, `R_SPOJ`, `R_CISL`, `R_NEURC`, `R_SL`, `R_TVAR`, `R_VS`, `R_PRAV`, `R_VLAST`, `R_HL`, diktáty `R_DIKT`, `R_DIKT2`
- Matematika: generátory príkladov v objekte `GEN` (príklady sa tvoria náhodne)
- Angličtina: `VOC`, `VOC2`, `EN`, `R_PLUR`, `R_CLEN`, `R_POKYN`, `R_NEPR`, `ABC`, `R_SPELL`
- Geografia: `GEO`, biológia: `BIO`
- Témy z neskoršej časti roka majú označenie `later` – nezaraďujú sa do mixu.

## Učivo zo školských testov

Slovenčina: doplnené témy (`addTo` v `src/app.html`) a nové `s-vety`, `s-anto`, `s-nepatri`, `s-spod`, `s-znel`, `s-szo`, `s-lit`, `s-abc` (abeceda podľa `skCmp`).
Matematika: generátory `porLong`, `rozv`, `zaok2`, `rovn`, `nerov`, `dopln`, `nepr`, `hadanky`.
Testy nanečisto: `buildTest` (vstupný), `buildTest2` (1. štvrťrok), `buildMathTest`.

## Doplnenie podľa štátnej osnovy

Matematika: `m-mil`, `m-geom`, `m-sum`, `m-komb`, `m-tab`. Slovenčina: `s-zasoba`, `s-cit`, `s-zanre`, `s-prejav`.
Geografia: `g-siet`, `g-kraj`, `g-ludia`. Biológia: `b-voda`, `b-pole`, `b-hory`, rozšírené `b-skum`. Dejepis: `d-cas`, `d-cas2`, `d-rod`, `d-pram`.

## Typy úloh

`mc` výber z možností · `typed` písaná odpoveď · `gaps` doplňovačka · `pick` ťukanie na slová ·
`tag` slovný druh každého slova · `det` určovanie rodu/čísla/pádu alebo osoby/čísla/času · `sd` slovný druh

## Ukladanie

Všetko sa ukladá v prehliadači zariadenia (localStorage), bez účtov a databázy:

- `s5.stats` – štatistiky: pre každý deň a tému počet úloh, správnych odpovedí a čas (najviac 3 min na úlohu)
- `s5.name`, `s5.acc` – meno na pozdrav a vybraná farba aplikácie (zadá sa pri prvom spustení, zmena v Štatistikách)
- `s5.seen` – kedy dieťa naposledy videlo ktorú úlohu, `s5.gen` – posledných 300 vygenerovaných príkladov
- `s5.stars` – nazbierané hviezdičky (1 za každú správnu odpoveď)
- `s5.err` – Moje chyby, `s5.best` – najlepšie výsledky tém, `s5.sub` – posledný vybraný predmet

Obrazovka **Štatistiky** ukazuje čas po dňoch, predmety s úspešnosťou, najslabšie a najlepšie témy a prehľad deň po dni.

## Zverejnenie

Statická stránka – stačí nahrať priečinok na GitHub Pages, Netlify alebo Cloudflare Pages. Žiadny build netreba.
Aplikácia beží na GitHub Pages: **https://lumidizajn.github.io/edumind/**

Postup pri zmene: uprav `src/app.html` → spusti `node tools/build.js` → commit a push. Build zmení verziu v `sw.js`, takže tablety si stiahnu novú verziu.

## Výber úloh

Funkcia `pickItems` dáva najprv úlohy, ktoré dieťa ešte nevidelo, primieša asi tretinu úloh s chybou (najskôr o deň neskôr)
a až potom úlohy videné najdávnejšie. Generované príklady (`genRound`) sa vyhýbajú posledným 300 príkladom.
Slovné úlohy majú 26 vzorov s náhodnými číslami a menami.

## Dizajn

Hravý farebný vzhľad: každý predmet má vlastnú farbu a ikonu (triedy `.s-sj`, `.s-mat`, `.s-aj`, `.s-geo`, `.s-bio`),
akcentovú farbu si vyberie dieťa (pole `ACC`). Denný cieľ je 20 úloh (`GOAL`), Dnešná výzva dá 2 úlohy z každého predmetu.
Podporuje svetlý aj tmavý režim a obmedzenie animácií.

## Plán ďalšieho vývoja

1. Inteligentné opakovanie slabých miest a vysvetlenia postupu
2. Minihry ako odmena

## Stav tém

V src/app.html je zoznam TERAZ (témy, ktoré sa práve preberajú). Témy s later:true sú „Dopredu“ (viditeľné, ale nie v mixe a dennej výzve), ostatné sú „Už sme prebrali“. Mix a denná výzva berú asi 60 % úloh z tém „teraz“ a 40 % z prebratých; prebraté témy s úspešnosťou nad 90 % (aspoň 20 odpovedí za 30 dní) sa vracajú len občas.
