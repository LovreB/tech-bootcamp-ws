/* 
page.tsx in Next.js always corresponds to the url in the folder. 
This is the root folder, meaning that the route will be localhost:3000/ 
*/
"use client"; // Stating that this is a component to be rendered client-side
import { useState } from "react";
import MovieCard from "./components/MovieCard";
import MovieCardGrid from "./components/MovieCardGrid";
import { Movie } from "./types/Movie";

// Some moves to be used before searching for new ones.
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
  const [movies, setMovies] = useState<Movie[]>(defaultMovies);

  return (
    <MovieCardGrid>
      {/* The MovieCardGrid component lay out its children in a grid. Feel free to change  */}
      {movies.map((movie) => (
        <MovieCard
          key={
            movie.imdbId
          } /* key is needed in React when mapping items - not part of component props */
          title={movie.title}
          img={movie.img}
        />
      ))}
    </MovieCardGrid>
  );
}
