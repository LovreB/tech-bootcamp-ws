import { MovieDto } from "@/app/types/MovieDto";
import { NextRequest, NextResponse } from "next/server";
import { favoriteService } from "../users/[userId]/favorites/FavoriteService";
import { movieService } from "./MovieService";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const partialTitle = request.nextUrl.searchParams.get("title");
  const userId = request.nextUrl.searchParams.get("userId");
  if (!partialTitle) {
    // <--- Some added error handling
    return NextResponse.json(
      { error: "Missing title query parameter" },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId query parameter" },
      { status: 400 }
    );
  }
  const matchingMovies: MovieDto[] = await movieService.searchByTitle(
    partialTitle,
    userId
  ); // <--- HERE
  return NextResponse.json(matchingMovies); // and returning here
}

export async function POST(
  request: NextRequest,
  context: { params: { userId: string; imdbId: string } }
): Promise<NextResponse> {
  const params = await context.params;
  if (!params.userId || !params.imdbId) {
    return NextResponse.json(
      { error: "Invalid request, missing userId or imdbId" },
      { status: 400 }
    );
  }
  const movieDto: MovieDto = await favoriteService.addFavorite(
    params.userId,
    params.imdbId
  );
  return NextResponse.json({ movieDto }, { status: 201 });
}
