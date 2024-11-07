import {prisma} from "@/prisma/prismaClient";
import {FavoriteEntity} from "@prisma/client";

class FavoriteRepository {

    async saveFavorite(userId: string, movieId: string): Promise<FavoriteEntity | null> {
        try {
            return await prisma.favoriteEntity.create({
                data: {
                    user_id: userId,
                    movie_id: movieId
                }
            });
        } catch (error) {
            console.error("Error adding favorite:", error);
            throw error;
        }
    }

    async deleteFavorite(user_id: string, movie_id: string): Promise<void> {
        await prisma.favoriteEntity.deleteMany({
            where: { user_id, movie_id },
        });
    }

    async countFavoritesByMovieId(movie_id: string): Promise<number> {
        return prisma.favoriteEntity.count({
            where: { movie_id },
        });
    }

    async isFavorite(userId: string, imdbId: string): Promise<boolean> {
        const favorite = await prisma.favoriteEntity.findFirst({
            where: {
                user_id: userId,
                movie: {
                    imdb_id: imdbId
                }
            },
            include: {
                movie: true
            }
        });
        return favorite !== null;
    }

    async findAllFavorites(userId: string): Promise<FavoriteEntity[]> {
        return prisma.favoriteEntity.findMany({
            where: { user_id: userId }
        });
    }
}

export const favoriteRepository = new FavoriteRepository();