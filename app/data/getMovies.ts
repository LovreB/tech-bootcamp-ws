import { Movie } from "../types/Movie";

/* This function calls our BFF. The available endpoins are found in the documentation */
export const fetchMovies = async (title: string): Promise<Movie[]> => {
  console.log("You called the fetchMovies function - amazing!");
  return [];
};
