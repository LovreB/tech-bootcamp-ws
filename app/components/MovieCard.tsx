"use client"; // Stating that this is a component to be rendered client-side
/* This is the props / attributes you will be able to send to the component*/
type MovieProps = {
  title: string;
  img: string;
};

/* This is the React component which will be rendered on your page */
export const MovieCard = ({ title, img }: MovieProps) => {
  /* title and background is now available to use within your component */

  /* The render function returns the html to render */
  return <p>My movie card</p>;
};

export default MovieCard;
