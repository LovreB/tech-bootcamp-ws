/* 
page.tsx in Next.js always corresponds to the url in the folder. 
This is the root folder, meaning that the route will be localhost:3000/ 
*/
"use client"; // Stating that this is a component to be rendered client-side
import { useState } from "react";
import MovieCard from "./components/MovieCard";
import { Movie } from "./types/Movie";
import { getMovies } from "./data/getMovies";
import MovieCardGrid from "./components/MovieCardGrid";
import Link from "next/link";

const defaultMovies: Movie[] = [
  {
    title: "Titanic",
    imdbId: "tt0120338",
    img: "https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX300.jpg",
    isFavorite: true,
  },
  {
    title: "Notebook",
    imdbId: "tt0332280",
    img: "https://m.media-amazon.com/images/M/MV5BZjE0ZjgzMzYtMTAxYi00NGMzLThmZDktNzFlMzA2MWRmYWQ0XkEyXkFqcGc@._V1_SX300.jpg",
    isFavorite: false,
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState<Movie[]>(defaultMovies);
  const [error, setError] = useState("");

  const onSearch = async () => {
    try {
      const data = await getMovies(input);
      setMovies(data);
    } catch (err) {
      setError("Failed to fetch movies");
    }
  };

  return (
    <>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-700 focus:border-transparent text-gray-800"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
        />
        <button
          className="px-4 py-2 text-white bg-pink-700 rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
      <Link href={"/favorites"}>Go to my favorites</Link>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <MovieCardGrid>
          {movies.map((movie) => (
            <MovieCard
              title={movie.title}
              backgroundImg={movie.img}
              key={movie.imdbId}
              isFavorite={movie.isFavorite}
              imdbId={movie.imdbId}
            />
          ))}
        </MovieCardGrid>
      )}
    </>
    /* MAIN STARTER PAGE 
      <AppContainer> // Component styling the background and general page 
          <main className="flex flex-col gap-8 items-center">
            {movies.map((movie) => (
              <MovieCard
                title={movie.title}
                backgroundImg={movie.img}
                key={movie.imdbId} \\ is needed in React when mapping items.
              />
            ))}
        </main>
      </AppContainer> 
    */
  );
}
