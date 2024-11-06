import {Movie} from "@/app/types/Movie";
import {userService, UserService} from "@/app/api/users/UserService";
import {movieService, MovieService} from "@/app/api/movies/MovieService";
import {InternalMovie} from "@/app/api/movies/InternalMovie";
import {favoriteRepository} from "@/app/api/users/[userId]/favorites/FavoriteRepository";
import {FavoriteEntity} from "@prisma/client";
import {prisma} from "@/prisma/prismaClient";
import {movieRepository} from "@/app/api/movies/MovieRepository";
import {UserDto} from "@/app/types/UserDto";

export class FavoriteService {
    private movieService: MovieService;
    private userService: UserService;

    constructor(movieService: MovieService, userService: UserService) {
        this.movieService = movieService;
        this.userService = userService;
    }

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
                await this.movieService.deleteMovie(movie_id);
            }
        });
        }

}

export const favoriteService: FavoriteService = new FavoriteService(movieService, userService);
