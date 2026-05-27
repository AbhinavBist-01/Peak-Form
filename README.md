# PeakForm

PeakForm is a form builder built as a pnpm/Turborepo monorepo. It has a Next.js web app, an Express API server, shared tRPC contracts, Drizzle/PostgreSQL persistence, and service packages for auth, forms, fields, and form submissions.

The current product flow covers:

- Email/password signup and login with an auth cookie.
- Authenticated dashboard access.
- Form creation and listing.
- Form field CRUD for building forms.
- Custom form slugs, password-protected public links, QR sharing, clone/archive actions, and multi-page public form filling.
- Conditional logic for showing fields based on earlier answers.
- Public form rendering and submission.
- Submission viewing, filtering, pagination, analytics, CSV export, and deletion for form owners.
- Admin overview dashboard for seeded admin users.
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

Optional email notification variables for Nodemailer:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
SMTP_SECURE=false
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

Seed the database with demo data (creates an admin user, 3 themed forms with fields and responses):

```sh
pnpm db:seed
```

Demo credentials: `demo@peakform.com` / `demo1234`

Seeded protected form password: `peakbeta`

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
pnpm db:seed      # Seed database with demo data
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
- `/dashboard/admin` - admin-only platform overview for demo operators.
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
| GET | `/api/listPublicForms` | No | `form.listPublicForms` | No input |
| GET | `/api/getFormById` | No | `form.getFormById` | `{ formId, password? }` |
| PATCH | `/api/updateFormSettings` | Yes | `form.updateFormSettings` | `{ formId, title?, slug?, visibility?, expiresAt?, pageSize?, password?, themeConfig? }` |
| POST | `/api/publishForm` | Yes | `form.publishForm` | `{ formId }` |
| POST | `/api/unpublishForm` | Yes | `form.unpublishForm` | `{ formId }` |
| POST | `/api/archiveForm` | Yes | `form.archiveForm` | `{ formId }` |
| POST | `/api/cloneForm` | Yes | `form.cloneForm` | `{ formId }` |
| POST | `/api/createField` | Yes | `form.createField` | `{ formId, label, description?, placeholder?, options?, validationRules?, isRequired?, type, index }` |
| GET | `/api/getFields` | Yes | `form.getFields` | `{ formId }` |
| PATCH | `/api/updateField` | Yes | `form.updateField` | `{ id, label?, description?, placeholder?, options?, validationRules?, isRequired?, type?, index? }` |
| DELETE | `/api/deleteField` | Yes | `form.deleteField` | `{ id }` |
| GET | `/api/getAdminOverview` | Admin | `form.getAdminOverview` | No input |

Supported field types (11 total):

```txt
TEXT, TEXTAREA, SELECT, RADIO, CHECKBOX, PASSWORD, EMAIL, YES_NO, DATE, NUMBER, RATING
```

#### Form Submissions

| Method | Path | Auth | tRPC procedure | Body/query |
| --- | --- | --- | --- | --- |
| POST | `/api/createFormSubmission` | No | `formSubmission.createFormSubmission` | `{ formId, password?, values: [{ formFieldId, value }] }` |
| GET | `/api/getFormSubmissionsByFormId` | Yes | `formSubmission.getFormSubmissionsByFormId` | `{ formId, page?, pageSize?, search? }` |
| GET | `/api/getFormSubmissionAnalytics` | Yes | `formSubmission.getFormSubmissionAnalytics` | `{ formId }` |
| GET | `/api/getFormSubmissionById` | Yes | `formSubmission.getFormSubmissionById` | `{ submissionId }` |
| DELETE | `/api/deleteFormSubmission` | Yes | `formSubmission.deleteFormSubmission` | `{ submissionId }` |
| GET | `/api/exportFormSubmissionsCsv` | Yes | `formSubmission.exportFormSubmissionsCsv` | `{ formId }` |

The public submission endpoint validates the form, checks required fields, and stores submitted values. The owner-only listing endpoint joins submissions back to forms so users can only read submissions for their own forms.

The public submission endpoint also includes **rate limiting**: max 10 requests per IP per 60-second window, enforced by an in-memory rate limiter middleware (`packages/trpc/server/utils/rate-limit.ts`).

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
