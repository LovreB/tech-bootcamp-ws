import { OmdbMovie } from '@/app/types/omdb/OmdbMovie';
import { InternalMovie } from '@/app/api/movies/InternalMovie';
import { omdbClient } from '@/app/api/movies/OmdbClient';
import { movieRepository } from '@/app/api/movies/MovieRepository';
import { MovieEntity } from '@prisma/client';
import { OmdbSearchResponse } from '@/app/types/omdb/OmdbSearchResponse';
import { MovieDto } from '@/app/types/MovieDto';

export class MovieService {
  async searchByTitle(title: string, _userId: string): Promise<MovieDto[]> {
    const response: OmdbSearchResponse = await omdbClient.searchByTitle(title);
    const movies: OmdbMovie[] = response.Search;
    return movies
      .map(InternalMovie.fromOmdbMovie)
      .map((movie) => movie.toDto(false));
  }

  async getOrCreateMovie(imdbId: string): Promise<InternalMovie> {
    const movieEntity: MovieEntity | null = await movieRepository.findByImdbId(
      imdbId
    );
    if (movieEntity) {
      return InternalMovie.fromEntity(movieEntity);
    } else {
      const omdbMovie: OmdbMovie = await omdbClient.findByImdbId(imdbId);
      const createdMovieEntity: MovieEntity | null =
        await movieRepository.createMovie(
          imdbId,
          omdbMovie.Title,
          omdbMovie.Poster
        );
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
