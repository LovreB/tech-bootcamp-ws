import { MovieDto } from '../types/MovieDto';
import { fetchEndpoint } from './fetchEndpoint';

/* This function calls our BFF, the endpoint that returns the user's favorites.
 * The available endpoins are found in the documentation */
export const getFavorites = async () => {
  const url = `/api/users/${process.env.NEXT_PUBLIC_USERNAME}/favorites`;
  const user = await fetchEndpoint<{ favoriteMovies: MovieDto[] }>(url);
  return user?.favoriteMovies ?? [];
};
