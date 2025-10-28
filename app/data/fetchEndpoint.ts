/* This function calls our BFF
 * endpoint - the endpoint to call
 * init - the options to use (ex. {method: POST}) for post requests
 * The available endpoins are found in the documentation */
export const fetchEndpoint = async <T>(
  endpoint: string,
  init?: RequestInit
): Promise<T | null> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`,
    init
  );
  return await response.json();
};
