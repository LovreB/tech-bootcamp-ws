import {NextRequest, NextResponse} from "next/server";
import {favoriteService} from "@/app/api/users/[userId]/favorites/FavoriteService";

export async function DELETE(request: NextRequest, context: { params: { userId: string, imdbId: string} }): Promise<NextResponse> {
    const params = context.params;
    if (!params.userId || !params.imdbId) {
        return NextResponse.json({ error: "Invalid request, missing userId or imdbId" }, { status: 400 });
    }
    await favoriteService.deleteFavorite(params.userId, params.imdbId);
    return NextResponse.json({ "message": "Successfully removed movie as favorite" });
}