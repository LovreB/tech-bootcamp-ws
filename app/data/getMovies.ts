import { MovieDto } from "../types/MovieDto";
import { fetchEndpoint } from "./fetchEndpoint";

/* This function calls our BFF. The available endpoins are found in the documentation */
export const getMovies = async (title: string) => {
  const url = `/api/movies?title=${title}&userId=${process.env.NEXT_PUBLIC_USERNAME}`;

  return fetchEndpoint<MovieDto[]>(url);
};
