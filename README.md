# Roman Numerals Converter (TypeScript, Express, Jest)

A small web app and API that converts integers in the range [1, 100] into Roman numerals. Built with TypeScript and Express, featuring an AJAX converter by default and an SSE (Server‑Sent Events) demo on a dedicated branch.

## Features
- **AJAX converter (default)**: `POST /api/convert` accepts JSON `{ number }` and returns `{ number, roman }`.
- **Server‑Sent Events (SSE) demo**: available on the `sse-converter` branch as `GET /api/convert-sse/:number`.
- **Robust validation & error handling**: range and type checks (1–100, integer only), safe JSON parsing, timeouts on the client, and graceful failures.
- **Unit + integration tests**: Jest + Supertest.
- **Modern TypeScript setup**: strict TS config, async/await, ESLint.

## Quick start
```bash
# install
npm install

# build TypeScript to dist/
npm run build

# run server (http://localhost:3000)
npm start

# dev mode (TS directly)
npm run dev

# run tests
npm test
```

## API
### POST /api/convert
- Request JSON: `{ "number": <integer 1..100> }`
- Success 200:
  ```json
  { "number": 44, "roman": "XLIV" }
  ```
- Client errors 400 (examples):
  - `{ "error": "Field 'number' is required" }`
  - `{ "error": "Invalid number provided" }`
  - `{ "error": "Number must be between 1 and 100" }`
- Server errors 500:
  - `{ "error": "Internal server error" }` (message may be simplified in production)

### SSE (optional; on branch `sse-converter`)
- `GET /api/convert-sse/:number` streams one event then closes:
  ```text
data: {"number":9,"roman":"IX"}

  ```
- Emits `{ "error": string }` payload for invalid input; includes heartbeat and disconnect handling.
 - Client includes retry with exponential backoff (max 3 retries) on connection errors.

## Frontend
- Served from `public/index.html`.
- AJAX: uses `fetch` with `AbortController` (timeout) and content-type checks.
- SSE (only on `sse-converter`): simple demo button wiring an `EventSource` with cleanup on error/end.

## Testing
- Framework: Jest with `ts-jest` preset.
- Unit tests: `tests/roman.test.ts` (conversion logic).
- Integration tests: `tests/server.test.ts` (API + SSE on branch).

Run:
```bash
npm test
```
Coverage is enabled by default.

## Project structure
```
.
├─ public/                # Static UI (index.html)
├─ src/
│  ├─ roman.ts            # Pure conversion logic (docstring + validations)
│  └─ server.ts           # Express app (REST + optional SSE on branch)
├─ tests/                 # Jest tests (TS)
├─ jest.config.js
├─ tsconfig.json
├─ .eslintrc.json
└─ package.json
```

## Branches
- `master`: AJAX converter only.
- `ajax-converter`: same focus on AJAX; baseline for the feature.
- `sse-converter`: adds SSE endpoint + UI + tests.

Switch to SSE branch:
```bash
git fetch origin
git switch sse-converter
```

## Configuration
- `PORT` env var overrides default 3000.

## Notes & constraints
- Supported input: integers 1–100 only. Input `0` is explicitly rejected (there is no standard Roman numeral for zero).
- Server never crashes on invalid input; returns 400 with a clear message.
- Client-side handles network timeouts and malformed responses.

## License
ISC (per `package.json`).
