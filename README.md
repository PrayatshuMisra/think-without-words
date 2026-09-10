# Think Without Words

An interactive field guide to hidden computation for technically curious learners. This project explores how latent reasoning can be made inspectable, demonstrating that hidden state updates can perform useful computation without emitting a verbal trace.

## Overview

*Think Without Words* is a web application designed with a "Field Notes / Editorial Lab" aesthetic. It provides a warm, paper-toned research interface combining scientific notation, editorial typography, and tactile instrument panels. The experience is meant to feel like an annotated lab notebook made interactive.

## Design Philosophy & Theme

- **Design Movement**: Swiss editorial design translated into a contemporary scientific field notebook.
- **Core Principles**:
  - Clarify the central claim: hidden states perform useful computation without verbal traces.
  - The interface feels observed and measured, not gamified.
  - Controls behave like laboratory instruments, exposing trade-offs and honest uncertainty.
- **Visuals**: A warm mineral paper background (`#F3F0E8`), near-black ink (`#191A18`) for authority, graphite borders (`#B8B4AA`), and a restrained burnt-copper signal (`#C45A3A`) for active computation and state markers.

## Tech Stack

This project is built using modern web technologies:

- **Frontend**: React (v19), Vite, TypeScript
- **Styling**: Tailwind CSS (v4), Radix UI Primitives, Framer Motion for precise animations
- **Data Visualization**: Recharts
- **Backend**: Express.js
- **Routing**: Wouter

## Getting Started

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io/) package manager

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd think-without-words
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running Locally

To start the development server (both frontend and backend running via Vite):

```bash
pnpm run dev
```

### Building for Production

To build the application for production:

```bash
pnpm run build
```

To start the production server:

```bash
pnpm run start
```

## License

This project is licensed under the MIT License.
