-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('MOVIE', 'SERIES');
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Profile" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "name")
);

CREATE TABLE "Genre" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Movie" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "releaseYear" INTEGER NOT NULL,
  "maturity" TEXT NOT NULL,
  "runtimeMin" INTEGER NOT NULL,
  "backdropUrl" TEXT NOT NULL,
  "posterUrl" TEXT NOT NULL,
  "trailerUrl" TEXT NOT NULL,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Series" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "releaseYear" INTEGER NOT NULL,
  "maturity" TEXT NOT NULL,
  "backdropUrl" TEXT NOT NULL,
  "posterUrl" TEXT NOT NULL,
  "trailerUrl" TEXT NOT NULL,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Season" (
  "id" TEXT PRIMARY KEY,
  "number" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "seriesId" TEXT NOT NULL REFERENCES "Series"("id") ON DELETE CASCADE,
  UNIQUE("seriesId", "number")
);

CREATE TABLE "Episode" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "synopsis" TEXT NOT NULL,
  "number" INTEGER NOT NULL,
  "runtimeMin" INTEGER NOT NULL,
  "videoUrl" TEXT NOT NULL,
  "seasonId" TEXT NOT NULL REFERENCES "Season"("id") ON DELETE CASCADE,
  UNIQUE("seasonId", "number")
);

CREATE TABLE "Watchlist" (
  "id" TEXT PRIMARY KEY,
  "profileId" TEXT NOT NULL REFERENCES "Profile"("id") ON DELETE CASCADE,
  "contentType" "ContentType" NOT NULL,
  "contentId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("profileId", "contentType", "contentId")
);

CREATE TABLE "ViewingHistory" (
  "id" TEXT PRIMARY KEY,
  "profileId" TEXT NOT NULL REFERENCES "Profile"("id") ON DELETE CASCADE,
  "contentType" "ContentType" NOT NULL,
  "contentId" TEXT NOT NULL,
  "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ContinueWatching" (
  "id" TEXT PRIMARY KEY,
  "profileId" TEXT NOT NULL REFERENCES "Profile"("id") ON DELETE CASCADE,
  "contentType" "ContentType" NOT NULL,
  "contentId" TEXT NOT NULL,
  "progressSec" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE("profileId", "contentType", "contentId")
);

CREATE TABLE "MovieGenre" (
  "movieId" TEXT NOT NULL REFERENCES "Movie"("id") ON DELETE CASCADE,
  "genreId" TEXT NOT NULL REFERENCES "Genre"("id") ON DELETE CASCADE,
  PRIMARY KEY ("movieId", "genreId")
);

CREATE TABLE "SeriesGenre" (
  "seriesId" TEXT NOT NULL REFERENCES "Series"("id") ON DELETE CASCADE,
  "genreId" TEXT NOT NULL REFERENCES "Genre"("id") ON DELETE CASCADE,
  PRIMARY KEY ("seriesId", "genreId")
);

CREATE INDEX "ViewingHistory_profileId_watchedAt_idx" ON "ViewingHistory"("profileId", "watchedAt");
