# PeakForm

PeakForm is a form builder built as a pnpm/Turborepo monorepo. It has a Next.js web app, an Express API server, shared tRPC contracts, Drizzle/PostgreSQL persistence, and service packages for auth, forms, fields, and form submissions.

The current product flow covers:

- Email/password signup and login with an auth cookie.
- Authenticated dashboard access.
- Form creation and listing.
- Form field CRUD for building forms.
- Public form rendering and submission.
- Submission viewing for form owners.
- API documentation through OpenAPI and Scalar.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS, shadcn/Radix-style components, TanStack Query, tRPC React Query.
- **API:** Express 5, tRPC, `trpc-to-openapi`, Scalar API Reference.
- **Database:** PostgreSQL, Drizzle ORM, Drizzle Kit migrations.
- **Workspace:** pnpm 9, Turborepo, TypeScript.

## Monorepo Layout

```txt
apps/
  api/        Express API server. Mounts tRPC, OpenAPI REST routes, Scalar docs.
  web/        Next.js app for landing/auth/dashboard/public form pages.

packages/
  database/   Drizzle schema, database client, and migrations.
  services/   Business logic for users, forms, fields, and submissions.
  trpc/       Shared tRPC router, procedures, context, and typed client exports.
  logger/     Shared logger package.
  eslint-config/
  typescript-config/
```

## Local Setup

Install dependencies:

```sh
pnpm install
```

Create a root `.env` file:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/dev
JWT_SECRET=replace-with-a-long-secret
BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/trpc
PORT=8000
```

Optional OAuth variables are already supported by `packages/services/env.ts`, but the current auth flow is email/password:

```env
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=
```

Start PostgreSQL with Docker:

```sh
docker compose up -d
```

Run migrations:

```sh
pnpm db:migrate
```

Start the full workspace:

```sh
pnpm dev
```

Default local URLs:

- Web app: `http://localhost:3000`
- API server: `http://localhost:8000`
- Scalar docs: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`
- tRPC endpoint: `http://localhost:8000/trpc`
- OpenAPI/REST endpoint base: `http://localhost:8000/api`

## Useful Scripts

Run from the repo root:

```sh
pnpm dev          # Start all dev tasks through Turbo
pnpm build        # Build apps/packages
pnpm check-types  # Run TypeScript checks
pnpm lint         # Run lint tasks
pnpm format       # Format TS/TSX/MD files
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Apply Drizzle migrations
pnpm migrate      # Alias for pnpm db:migrate
```

Package-level scripts:

```sh
pnpm --filter web dev       # Next.js on port 3000
pnpm --filter @repo/api dev # Express API on port 8000
```

## Frontend Routes

Important routes in `apps/web/app`:

- `/` - app entry/landing page.
- `/login` - user login.
- `/signup` - user registration.
- `/dashboard` - authenticated dashboard shell.
- `/dashboard/forms` - list and create forms.
- `/dashboard/forms/[id]` - form field editor.
- `/dashboard/forms/[id]/submissions` - view submissions for a form.
- `/form/[form_id]` - public form page for respondents.

There are also older/alternate route files currently present under `dashboard/form/[form_id]` and `forms/[id]/submissions`; the active dashboard flow is the plural `/dashboard/forms` route family.

## API Shape

The server exposes the same `serverRouter` in two ways:

- tRPC: `POST/GET http://localhost:8000/trpc/<namespace>.<procedure>`
- OpenAPI REST: `http://localhost:8000/api/<path-from-route-meta>`

The frontend uses the tRPC endpoint through `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:8000/trpc`.

### Server Utility Routes

These are Express routes outside the tRPC/OpenAPI router:

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Basic server status message. |
| GET | `/health` | Basic Express health response. |
| GET | `/openapi.json` | Generated OpenAPI document. |
| GET | `/docs` | Scalar API documentation UI. |

### tRPC Namespaces

The root router is defined in `packages/trpc/server/index.ts`:

```ts
serverRouter = {
  health,
  auth,
  form,
  formSubmission,
}
```

### OpenAPI / REST Endpoints

All paths below are mounted under `/api`.

#### Health

| Method | Path | Auth | tRPC procedure | Description |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | No | `health.getHealth` | Typed health check. |

#### Authentication

| Method | Path | Auth | tRPC procedure | Body/query |
| --- | --- | --- | --- | --- |
| POST | `/api/createUserWithEmailAndPassword` | No | `auth.createUserWithEmailAndPassword` | `{ fullName, email, password }` |
| POST | `/api/signInUserWithEmailAndPassword` | No | `auth.signInUserWithEmailAndPassword` | `{ email, password }` |
| GET | `/api/getLoggedInUserInfo` | Yes | `auth.getLoggedInUserInfo` | No input |

Signup and login set the auth cookie from the API response context. Protected routes use that cookie through `credentials: "include"`.

#### Forms and Fields

| Method | Path | Auth | tRPC procedure | Body/query |
| --- | --- | --- | --- | --- |
| POST | `/api/createForm` | Yes | `form.createForm` | `{ title, description?, expiresAt? }` |
| GET | `/api/listForms` | Yes | `form.listForms` | No input |
| GET | `/api/getFormById` | No | `form.getFormById` | `{ formId }` |
| POST | `/api/createField` | Yes | `form.createField` | `{ formId, label, description?, placeholder?, isRequired?, type, index }` |
| GET | `/api/getFields` | Yes | `form.getFields` | `{ formId }` |
| PATCH | `/api/updateField` | Yes | `form.updateField` | `{ id, label?, description?, placeholder?, isRequired?, type?, index? }` |
| DELETE | `/api/deleteField` | Yes | `form.deleteField` | `{ id }` |

Supported field types:

```txt
TEXT, TEXTAREA, SELECT, RADIO, CHECKBOX, PASSWORD, EMAIL, YES_NO, DATE, NUMBER
```

#### Form Submissions

| Method | Path | Auth | tRPC procedure | Body/query |
| --- | --- | --- | --- | --- |
| POST | `/api/createFormSubmission` | No | `formSubmission.createFormSubmission` | `{ formId, values: [{ formFieldId, value }] }` |
| GET | `/api/getFormSubmissionsByFormId` | Yes | `formSubmission.getFormSubmissionsByFormId` | `{ formId }` |

The public submission endpoint validates the form, checks required fields, and stores submitted values. The owner-only listing endpoint joins submissions back to forms so users can only read submissions for their own forms.

## Database

The database package uses Drizzle with PostgreSQL. Main tables/models:

- `users`
- `forms`
- `form_fields`
- `form_submissions`

Drizzle config lives in `packages/database/drizzle.config.ts`, schema exports are in `packages/database/schema.ts`, and generated migrations are stored in `packages/database/drizzle`.

## Development Notes

- The API CORS config allows `http://localhost:3000` and `http://127.0.0.1:3000` with credentials.
- The API dev script explicitly loads the root `.env` with `dotenv -e ../../.env`.
- Turbo runs with strict env forwarding, so new environment variables should also be added to `turbo.json` `globalEnv`.
- API docs are generated from tRPC route metadata; when adding procedures, keep input schemas compatible with `trpc-to-openapi`.
