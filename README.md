# StreamVault – Netflix-inspirierter Streaming-Clone

StreamVault ist ein vollständiges Full-Stack-Demo-Projekt mit Next.js (App Router), TypeScript, Tailwind, Prisma und PostgreSQL. Es bildet typische Streaming-Produktlogik nach, ohne geschützte Markenassets oder Originalinhalte zu verwenden.

## 1) Architektur (Kurzüberblick)

- **Frontend + API:** Next.js 15 App Router
- **Auth:** NextAuth Credentials (JWT-Session)
- **DB-Zugriff:** Prisma ORM auf PostgreSQL
- **State-Management:** Zustand (aktives Profil)
- **UI:** Tailwind CSS, Dark Theme, Hero + Content-Reihen + Detail- und Watch-Seiten
- **Admin:** Rollenbasiert (`USER`, `ADMIN`) mit Admin-APIs und Admin-Übersichtsseite

## 2) Projektstruktur

```txt
src/
  app/
    (auth)/login, (auth)/register
    admin/content
    watch/[id], title/[id], profile, search
    api/
      auth/[...nextauth], auth/register
      profiles, content, content/[id]
      watchlist, history
      admin/content, admin/genres, admin/series
  components/
  lib/
  store/
prisma/
  schema.prisma
  seed.ts
  migrations/
```

## 3) Datenbankmodell

Enthaltene Modelle:
- `User`, `Profile`
- `Movie`, `Series`, `Season`, `Episode`
- `Genre`, `MovieGenre`, `SeriesGenre`
- `Watchlist`, `ViewingHistory`, `ContinueWatching`
- Rollenmodell via `Role`-Enum (`USER`, `ADMIN`)

## 4) Backend/API

Wichtige Endpunkte:
- `POST /api/auth/register` – Registrierung mit Hashing
- `GET/POST /api/profiles` – Profilverwaltung
- `GET /api/content` – Suche/Filter
- `GET /api/content/:id` – Detaildaten
- `GET/POST/DELETE /api/watchlist` – Merkliste
- `POST /api/history` – Verlauf + Continue Watching
- `POST /api/admin/content` – Content CRUD (Create)
- `POST /api/admin/genres` – Genre erstellen
- `POST /api/admin/series` – Season/Episode anlegen

## 5) Frontend

- Startseite mit Hero-Banner und Reihen
- Login/Registrierung
- Profilseite
- Suche mit Query + Genre-Filter
- Detailseite für Film/Serie inkl. Episodenliste
- Watch-Seite mit eingebettetem Player
- Admin-Übersicht für Inhalte

## 6) Seed-Daten

`prisma/seed.ts` legt an:
- 6 Genres
- mehrere Filme und eine Serie mit Staffel/Episoden
- Demo-User + Admin-User
- Watchlist/Verlauf/Continue-Watching Beispieldaten

Default Accounts:
- `admin@streamvault.local` / `Admin1234!`
- `demo@streamvault.local` / `Demo1234!`

## 7) Setup-Anleitung

### Voraussetzungen
- Node.js 20+
- Docker (optional, empfohlen für Postgres)

### Installation

1. Abhängigkeiten installieren
   ```bash
   npm install
   ```

2. Umgebungsvariablen setzen
   ```bash
   cp .env.example .env
   ```

3. PostgreSQL starten (optional via Docker)
   ```bash
   docker compose up -d
   ```

4. Prisma Migration + Client
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed ausführen
   ```bash
   npm run prisma:seed
   ```

6. Dev-Server starten
   ```bash
   npm run dev
   ```

App läuft auf `http://localhost:3000`.

## 8) Offene Punkte / sinnvolle Erweiterungen

- Vollständige Admin-UI für Edit/Delete (aktuell API-first und Übersicht)
- Passwort-Reset-Flow (Token-Tabelle + Mailversand) vorbereiten
- E2E-Tests (Playwright) und API-Tests ergänzen
- Caching/ISR für Content-Listen
- Upload-Pipeline für eigene Media-Assets
- Observability (structured logs, metrics)

## Sicherheitshinweise

- Secrets nie hardcoden (siehe `.env.example`)
- Passwort-Hashing per `bcryptjs`
- Input-Validierung mit `zod`
- Schutz sensibler Routen via Middleware + Session/Rolle
