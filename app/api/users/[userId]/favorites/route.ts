import {NextRequest, NextResponse} from "next/server";
import {favoriteService} from "@/app/api/users/[userId]/favorites/FavoriteService";
import {Movie} from "@/app/types/Movie";

export async function GET(request: NextRequest, context: { params: { userId: string } }): Promise<NextResponse> {
    const params = await context.params;
    if (!params.userId) {
        return NextResponse.json({ error: "Invalid request, missing user ID" }, { status: 400 });
    }
    try {
        const favoriteMovies: Movie[] = await favoriteService.getAllFavorites(params.userId);
        return NextResponse.json({ favoriteMovies });
    } catch {
        return NextResponse.json({ error: "Favorites not found" }, { status: 404 });
    }
}