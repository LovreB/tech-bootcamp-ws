import {OmdbMovie} from "@/app/types/omdb/OmdbMovie";
import {InternalMovie} from "@/app/api/movies/InternalMovie";
import {omdbClient} from "@/app/api/movies/OmdbClient";
import {Movie} from "@/app/types/Movie";
import {OmdbSearchResponse} from "@/app/types/omdb/OmdbSearchResponse";
import {movieRepository} from "@/app/api/movies/MovieRepository";
import { MovieEntity } from "@prisma/client";
import {favoriteRepository} from "@/app/api/users/[userId]/favorites/FavoriteRepository";

export class MovieService {

    async searchByTitle(title: string, userId: string): Promise<Movie[]> {
        const response: OmdbSearchResponse = await omdbClient.searchByTitle(title);
        const omdbMovies: OmdbMovie[] = response.Search;
        const movieDtos: Movie[] = await Promise.all(omdbMovies.map(async (omdbMovie) => {
            const movie: InternalMovie = InternalMovie.fromOmdbMovie(omdbMovie);
            const isFavorite: boolean = await favoriteRepository.isFavorite(userId, movie.imdbId!);
            return movie.toDto(isFavorite);
        }));
        return movieDtos;
    }

    async getOrCreateMovie(imdbId: string): Promise<InternalMovie> {
        const movieEntity: MovieEntity | null = await movieRepository.findByImdbId(imdbId);
        if (movieEntity) {
            return InternalMovie.fromEntity(movieEntity);
        } else {
            const omdbMovie: OmdbMovie = await omdbClient.findByImdbId(imdbId);
            const createdMovieEntity: MovieEntity | null = await movieRepository.createMovie(imdbId, omdbMovie.Title, omdbMovie.Poster);
            if (createdMovieEntity) {
                return InternalMovie.fromEntity(createdMovieEntity);
            } else {
                throw new Error(`Could not create movie with IMDB ID ${imdbId}`);
            }
        }
    }

    async deleteMovie(id: string) {
        await movieRepository.deleteById(id);
    }

}

export const movieService: MovieService = new MovieService();
