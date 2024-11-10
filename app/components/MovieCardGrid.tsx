/* A component rendering its children in a grid, to be used if you want to. */
export const MovieCardGrid = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-m">
      {children}
    </div>
  );
};

export default MovieCardGrid;
