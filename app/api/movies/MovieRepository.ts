import {prisma} from "@/prisma/prismaClient";
import {MovieEntity} from "@prisma/client";

class MovieRepository {

    async createMovie(imdbId: string, title: string, img: string): Promise<MovieEntity | null> {
        try {
            return await prisma.movieEntity.create({
                data: {
                    imdb_id: imdbId,
                    title: title,
                    img: img
                }
            });
        } catch (error) {
            console.error("Could not create Movie:", error);
            throw error;
        }
    }

    async deleteById(movie_id: string): Promise<void> {
        await prisma.movieEntity.delete({
            where: { id: movie_id },
        });
    }

    async findByImdbId(imdb_id: string): Promise<MovieEntity | null> {
        return prisma.movieEntity.findUnique({ where: { imdb_id } });
    }

}

export const movieRepository = new MovieRepository();