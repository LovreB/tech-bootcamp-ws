import { MovieDto } from "../types/MovieDto";
import { fetchEndpoint } from "./fetchEndpoint";

/* This function calls our BFF, the endpoint that add a new movie as favorite.
 * The available endpoins are found in the documentation */
export const addFavorite = async (movieId: string): Promise<MovieDto[]> => {
  const url = `/api/users/${process.env.NEXT_PUBLIC_USERNAME}/favorites/${movieId}`;
  return fetchEndpoint(url, { method: "POST" });
};
