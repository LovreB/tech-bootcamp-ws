import { NextRequest, NextResponse } from 'next/server';
import { favoriteService } from '@/app/api/users/[userId]/favorites/FavoriteService';
import { MovieDto } from '@/app/types/MovieDto';

export async function POST(
  request: NextRequest,
  context: { params: { userId: string; imdbId: string } }
): Promise<NextResponse> {
  const params = await context.params;
  if (!params.userId || !params.imdbId) {
    return NextResponse.json(
      { error: 'Invalid request, missing userId or imdbId' },
      { status: 400 }
    );
  }
  const movieDto: MovieDto = await favoriteService.addFavorite(
    params.userId,
    params.imdbId
  );
  return NextResponse.json({ movieDto }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  context: { params: { userId: string; imdbId: string } }
): Promise<NextResponse> {
  const params = await context.params;
  if (!params.userId || !params.imdbId) {
    return NextResponse.json(
      { error: 'Invalid request, missing userId or imdbId' },
      { status: 400 }
    );
  }
  await favoriteService.deleteFavorite(params.userId, params.imdbId);
  return NextResponse.json({
    message: 'Successfully removed movie as favorite',
  });
}
