# Resin Print Prijscalculator

Een interactieve calculator om de verkoopprijs van resin 3D-prints te berekenen. Houdt rekening met alle kosten: resin, stroom, verbruiksartikelen, afschrijving, arbeid en winstmarge.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Resinkosten** — prijs per gram op basis van flesprijs en inhoud
- **Stroomkosten** — printer + wash & cure station
- **Verbruiksartikelen** — FEP-folie, filters, IPA/reiniger, handschoenen
- **Afschrijving** — printerkosten verdeeld over levensduur in printuren
- **Arbeid** — nabewerkingstijd × uurtarief
- **Winstmarge** — instelbaar percentage bovenop de kostprijs
- **Platformkosten** — optioneel percentage voor Etsy, eBay, etc.

## Aan de slag

### Vereisten

- [Node.js](https://nodejs.org/) (v16 of hoger)
- npm of yarn

### Installatie

```bash
git clone https://github.com/<jouw-username>/resin-print-calculator.git
cd resin-print-calculator
npm install
```

### Development server starten

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

### Productie build

```bash
npm run build
```

## Gebruik

1. Pas de standaardwaarden aan naar jouw situatie (jouw resinmerk, stroomprijs, printer, etc.)
2. Klap secties open/dicht door op de titels te klikken
3. De verkoopprijs wordt live berekend bovenaan het scherm

## Berekening

```
Kostprijs = Resin + Stroom + Verbruiksartikelen + Afschrijving + Arbeid
Verkoopprijs = Kostprijs + Winstmarge (%) + Platformkosten (%)
```

## Technologie

- React 18
- Geen externe UI-libraries — puur React met inline styling
- Google Fonts: JetBrains Mono + Inter

## Licentie

MIT — vrij te gebruiken en aan te passen.
