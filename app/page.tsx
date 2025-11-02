/* 
page.tsx in Next.js always corresponds to the url in the folder. 
This is the root folder, meaning that the route will be localhost:3000/ 
*/
"use client"; // Stating that this is a component to be rendered client-side
import { useState } from "react";
import MovieCard from "./components/MovieCard";
import { MovieDto } from "./types/MovieDto";
import { getMovies } from "./data/getMovies";
import MovieCardGrid from "./components/MovieCardGrid";
import Link from "next/link";



export default function Home() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [error, setError] = useState("");

  const onSearch = async () => {
    try {
      const data = (await getMovies(input)) ?? [];
      setMovies(data);
    } catch (e) {
      const errorMessage = "Failed to fetch movies";
      setError(errorMessage);
      console.error(`${errorMessage}: ${e}`);
    }
  };

  return (
    <>
      <div className='flex gap-4'>
        <input
          type='text'
          placeholder='Search for a movie...'
          className='px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-700 focus:border-transparent text-gray-800'
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
        />
        <button
          className='px-4 py-2 text-white bg-pink-700 rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
          onClick={onSearch}
        >
          Search
        </button>
      </div>
      <Link href={"/favorites"} className="text-white">Go to my favorites</Link>
      {error ? (
        <p className='text-red-500'>{error}</p>
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
  );
}
