# Medi-Drive

A React application for managing service logs. Create drafts, auto-save form data, and view, search, filter, edit, and delete service logs. All data persists in the browser (localStorage) across page reloads.

## Tech stack

- **React** + **TypeScript**
- **Redux Toolkit** + **redux-persist** (state and persistence)
- **MUI** (Material UI) + **Emotion** (CSS-in-JS)
- **React Hook Form** + **Yup** (forms and validation)
- **Vite** (build and dev server)
- **React Router**

## What it does

- **Service log form**: Provider, service order, car, odometer, engine hours, dates, type (planned / unplanned / emergency), description.
- **Drafts**: Create drafts, auto-save as you type, resume later. Drafts and logs survive reload.
- **Service logs table**: List all logs with search (provider, order, car, description) and filters (date range, type). Edit or delete from the table.

## How to run

### Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm** (or yarn / pnpm)

### Install dependencies

```bash
npm install
```

### Development (with hot reload)

```bash
npm run dev
```

Then open **http://localhost:5173/** in your browser. The app will redirect to `/service-logs`.

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview production build locally

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project structure (main parts)

- `src/pages/ServiceLogsPage.tsx` – main page (form, drafts, table)
- `src/components/` – `ServiceLogForm`, `DraftList`, `ServiceLogsTable`, `EditServiceLogDialog`
- `src/store/` – Redux store and slices (`draftsSlice`, `serviceLogsSlice`), persisted with redux-persist
- `src/types/`, `src/schemas/` – TypeScript types and Yup validation
- `src/theme.ts` – MUI theme

## Routes

- `/` – redirects to `/service-logs`
- `/service-logs` – service logs management page
