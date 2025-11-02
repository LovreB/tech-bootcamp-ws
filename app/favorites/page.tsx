import Link from "next/link";
import MovieCard from "../components/MovieCard";
import MovieCardGrid from "../components/MovieCardGrid";
import { getFavorites } from "../data/getFavorites";
import { MovieDto } from "../types/MovieDto";

export default async function Home() {
  let movies: MovieDto[] = [];
  let error = null;

  try {
    movies = await getFavorites();
  } catch (e) {
    error = "Failed to fetch favorites";
    console.error(`${error}: ${e}`);
  }

  return (
    <>
      <h1>My favorites</h1>
      <Link href={"/"}>Go to start page</Link>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : movies.length === 0 ? (
        <p className="text-white">No favorites yet - go ahead and add some!</p>
      ) : (
        <MovieCardGrid>
          {movies?.map((movie) => (
            <MovieCard
              title={movie.title}
              backgroundImg={movie.img}
              key={movie.imdbId}
              imdbId={movie.imdbId}
              isFavorite={movie.isFavorite}
            />
          ))}
        </MovieCardGrid>
      )}
    </>
  );
}
