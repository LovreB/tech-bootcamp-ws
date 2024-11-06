import {NextRequest, NextResponse} from "next/server";
import {movieService} from "@/app/api/movies/MovieService";
import {Movie} from "@/app/types/Movie";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const partialTitle = request.nextUrl.searchParams.get("title")
    const userId = request.nextUrl.searchParams.get("userId");
    if (!partialTitle) {
        return NextResponse.json({ error: "Missing title query parameter" }, { status: 400 });
    }
    if (!userId) {
        return NextResponse.json({ error: "Missing userId query parameter" }, { status: 400 });
    }
    const matchingMovies: Movie[] = await movieService.searchByTitle(partialTitle, userId);
    return NextResponse.json(matchingMovies);
}