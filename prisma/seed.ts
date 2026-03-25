import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.continueWatching.deleteMany();
  await prisma.viewingHistory.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.season.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.seriesGenre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.series.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const genres = await Promise.all(
    ['Sci-Fi', 'Drama', 'Adventure', 'Thriller', 'Animation', 'Comedy'].map((name) =>
      prisma.genre.create({ data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } })
    )
  );

  const genreByName = Object.fromEntries(genres.map((g) => [g.name, g]));

  const movies = [
    {
      title: 'Orbital Echo',
      slug: 'orbital-echo',
      description: 'A deep-space salvage crew uncovers a signal that predicts disasters before they happen.',
      releaseYear: 2024,
      maturity: '13+',
      runtimeMin: 118,
      backdropUrl: 'https://picsum.photos/seed/orbital-echo/1600/900',
      posterUrl: 'https://picsum.photos/seed/orbital-poster/600/900',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      tags: ['space', 'mystery', 'crew'],
      genres: ['Sci-Fi', 'Thriller']
    },
    {
      title: 'Neon Alley',
      slug: 'neon-alley',
      description: 'A courier in a rain-soaked megacity is pulled into a conspiracy around synthetic memories.',
      releaseYear: 2023,
      maturity: '16+',
      runtimeMin: 104,
      backdropUrl: 'https://picsum.photos/seed/neon-alley/1600/900',
      posterUrl: 'https://picsum.photos/seed/neon-poster/600/900',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      tags: ['cyberpunk', 'crime'],
      genres: ['Drama', 'Thriller']
    }
  ];

  for (const movie of movies) {
    const created = await prisma.movie.create({
      data: {
        title: movie.title,
        slug: movie.slug,
        description: movie.description,
        releaseYear: movie.releaseYear,
        maturity: movie.maturity,
        runtimeMin: movie.runtimeMin,
        backdropUrl: movie.backdropUrl,
        posterUrl: movie.posterUrl,
        trailerUrl: movie.trailerUrl,
        tags: movie.tags
      }
    });

    await Promise.all(
      movie.genres.map((name) =>
        prisma.movieGenre.create({ data: { movieId: created.id, genreId: genreByName[name].id } })
      )
    );
  }

  const series = await prisma.series.create({
    data: {
      title: 'Harbor 9',
      slug: 'harbor-9',
      description: 'Residents of a floating city struggle to survive after a global communications blackout.',
      releaseYear: 2025,
      maturity: '12+',
      backdropUrl: 'https://picsum.photos/seed/harbor-backdrop/1600/900',
      posterUrl: 'https://picsum.photos/seed/harbor-poster/600/900',
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      tags: ['survival', 'ensemble']
    }
  });

  await prisma.seriesGenre.createMany({
    data: [
      { seriesId: series.id, genreId: genreByName['Drama'].id },
      { seriesId: series.id, genreId: genreByName['Adventure'].id }
    ]
  });

  const season1 = await prisma.season.create({
    data: { number: 1, title: 'Season One', seriesId: series.id }
  });

  await prisma.episode.createMany({
    data: [
      {
        title: 'Static Horizon',
        synopsis: 'The lights flicker out as the city receives one final distress packet.',
        number: 1,
        runtimeMin: 49,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        seasonId: season1.id
      },
      {
        title: 'Signal Loss',
        synopsis: 'A rescue mission reveals a hidden district beneath the harbor.',
        number: 2,
        runtimeMin: 51,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        seasonId: season1.id
      }
    ]
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@streamvault.local',
      passwordHash: await hash('Admin1234!', 12),
      name: 'Admin User',
      role: Role.ADMIN
    }
  });

  const demo = await prisma.user.create({
    data: {
      email: 'demo@streamvault.local',
      passwordHash: await hash('Demo1234!', 12),
      name: 'Demo Viewer'
    }
  });

  const profile = await prisma.profile.create({
    data: { name: 'Alex', userId: demo.id, avatarUrl: 'https://picsum.photos/seed/avatar-alex/200/200' }
  });

  const firstMovie = await prisma.movie.findFirstOrThrow();
  await prisma.watchlist.create({
    data: { profileId: profile.id, contentType: 'MOVIE', contentId: firstMovie.id }
  });

  await prisma.viewingHistory.create({
    data: { profileId: profile.id, contentType: 'SERIES', contentId: series.id }
  });

  await prisma.continueWatching.create({
    data: { profileId: profile.id, contentType: 'SERIES', contentId: series.id, progressSec: 1300 }
  });

  console.log('Seed completed. Admin: admin@streamvault.local / Admin1234!');
  console.log('Demo: demo@streamvault.local / Demo1234!');
  console.log(`Created admin ${admin.email}`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
