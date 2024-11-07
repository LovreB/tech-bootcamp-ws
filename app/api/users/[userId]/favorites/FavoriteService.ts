import {Movie} from "@/app/types/Movie";
import {userService} from "@/app/api/users/UserService";
import {movieService} from "@/app/api/movies/MovieService";
import {InternalMovie} from "@/app/api/movies/InternalMovie";
import {favoriteRepository} from "@/app/api/users/[userId]/favorites/FavoriteRepository";
import {FavoriteEntity, MovieEntity} from "@prisma/client";
import {prisma} from "@/prisma/prismaClient";
import {movieRepository} from "@/app/api/movies/MovieRepository";
import {UserDto} from "@/app/types/UserDto";

export class FavoriteService {

    async addFavorite(userId: string, imdbId: string, ): Promise<Movie> {
        const user: UserDto = await userService.getUser(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        const favoriteMovie: InternalMovie = await movieService.getOrCreateMovie(imdbId);
        const favoriteEntity: FavoriteEntity | null = await favoriteRepository.saveFavorite(userId, favoriteMovie.id!);
        if (!favoriteEntity) {
            throw new Error(`Could not add favorite movie with IMDB ID ${imdbId} for user ${userId}`);
        }
        return favoriteMovie.toDto(true);
    }

    async deleteFavorite(user_id: string, imdb_id: string): Promise<void> {
        await prisma.$transaction(async () => {
            const movie = await movieRepository.findByImdbId(imdb_id);
            if (!movie) throw new Error(`Movie with imdb_id ${imdb_id} not found`);
            const movie_id = movie.id;
            await favoriteRepository.deleteFavorite(user_id, movie_id);
            const remainingReferences = await favoriteRepository.countFavoritesByMovieId(movie_id);
            if (remainingReferences === 0) {
                await movieService.deleteMovie(movie_id);
            }
        });
    }

    async getAllFavorites(userId: string): Promise<Movie[]> {
        const favoriteEntities: FavoriteEntity[] = await favoriteRepository.findAllFavorites(userId);
        const favoriteMovies:  Promise<Movie>[] = favoriteEntities.map(async (favoriteEntity: FavoriteEntity) => {
            const favoriteMovie: MovieEntity | null = await movieRepository.findById(favoriteEntity.movie_id)
            if (!favoriteMovie) {
                throw new Error(`Movie with ID ${favoriteEntity.movie_id} not found`);
            }
            return InternalMovie.fromEntity(favoriteMovie).toDto(true)
        });
        return Promise.all(favoriteMovies);
    }
}

export const favoriteService: FavoriteService = new FavoriteService();
