# StreamList+ React Store

A class-project prototype built with React + Vite. It uses the provided `Data.js` products and includes subscription selection, accessories, cart quantity controls, local-storage persistence, and responsive CSS.

## Requirements
- Node.js (current LTS recommended)
- npm

## Run in Visual Studio Code
1. Extract this folder.
2. Open the `streamlist-plus-react` folder in VS Code.
3. Open Terminal > New Terminal.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Main files
- `src/data.js`: assignment product data.
- `src/App.jsx`: app state, navigation, product lists, cart behavior, and local-storage persistence.
- `src/App.css`: responsive visual design.
- `src/main.jsx`: React entry point.
- `package.json`: project scripts and dependencies.

## Business rules implemented
- Product IDs 1-4 are subscriptions.
- Only one subscription can be in the cart at a time.
- Trying to add a subscription while another is in the cart shows a warning.
- Product IDs 5-8 are accessories; users can add multiples.
- Accessory quantities can be changed or removed from the cart.
- The navbar count shows total units in the cart.
- Cart contents persist in browser local storage.
- Checkout is a demonstration only and does not collect payment information.

## Build check
Run `npm run build` to verify the production bundle.
