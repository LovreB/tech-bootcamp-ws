## 0 Getting started

- Information about how to read the readme, tools using

### 0.1 **How to read this README**

---

To easily follow this Workshop and README file, the README is structured according to a few conventions.

- Code and file names are written like `CodeExample`.
- Larger code parts are written as below, with the name of the viable file is included at the top after two `//`

```
// File Name

Newly added code together with some older code to understand where the new code should be put in
```

- If there are previous written code in the same file as the new code, this is implied by

```
/* ... */ (Previous code written)
```

- When Next.js concepts or other important words are mentioned, they are written in bold, as **Next.js Concept**

- If there are some deeper explainations to either concepts or why, these are written as the citation shown below. These can be skipped depending on how much in detail you want to go.
  > Example explaination of a concept

---

### 0.2 Technologies used

The technologies that we will be using in this project is TypeScript for both backend and frontend, [React.js](https://react.dev/) for the frontend, and [Next.js](https://nextjs.org/docs) which is a React framework where you can create Server Side Rendered (SSR) application and Backend-For-Frontends (BFFs) smoothly. For styling in the frontend we will use a utility based css library [Tailwindcss](https://tailwindcss.com/)

### 0.3 Download the repo and start the application

If you haven't already, please download the repo from [TODO INSERT LINK]

To start the application you need to run:

- `npm install` - installing everything that is needed
- `npm run dev` - starts the application

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 0.4 Problems running the application?

Make sure you have a node version >=18.18.0

# Frontend Path

This is the path for you who wants to dig deeper into the frontend world! To get started:

Some tips to get maximal value out of the workshop:

- Styling is FUN to add, but fully optional and up to you! However, we recommend to not put too much time on the styling to begin with.
- `enhancements` sections are smaller detailes that should be skipped to begin with, but can return to if there is time at the end.

## 0. Getting stared Frontend path

1. Check out the `frontend` branch - this has already implemented all API endpoints, but lack the frontend components.
2. Rename the `.env.sample` file to `.env`, and fill in the values as follows:

- _OMDB_API_KEY_ - the api key you have retrieved from OMDB
- _DATABASE_URL_ - Set db url as postgresql://yourFirstname.yourLastname:password.38.7.50:5432/postgres, where password will be retrieved in the workshop.
- _NEXT_PUBLIC_USERNAME_ - set username as yourFirstname.yourLastname

Password will be retrieved in the workshop.

> The .env file is used to store environment variables that configure your application, such as API keys and database URLs. These variables are loaded at runtime and help keep sensitive information secure and separate from your codebase.

Our BFF is a REST API, with the available endpoints:

- GET `/api/movies?title={title}&userId={userId}`, where `title` is something to search movies on, and `userId` is your own name + first letter of last name. Returns list of type `Movie`.

- GET `/users/{userId}/favorites`, Returns list of type `Movie`, which is the users movies marked as favorite.

- POST `/users/{userId}/favorites/{movieId}`, the sent movie will be marked as favorite for user with id `userId`.

> A REST API, also known as a RESTful API, is a simple, uniform interface that is used to make data available through web URLs. REST APIs are the most common APIs used across the web today.

In `types/Movie.ts` we have the `Movie` type, which we will use througout the project - please have a look!

## 1. Present movie

First task for us is to show a single movie. To do this, we will create a React component.

> A [React Component](https://react.dev/learn/your-first-component#components-ui-building-blocks) is a UI building block, that can contain markup + logic and be reused in the application. The component can contain other components, _child components_, and will then consequently become a _parent component_. It is often (and in our case) written using [tsx](https://react.dev/learn/writing-markup-with-jsx#jsx-putting-markup-into-javascript) files, which lets you embed markup inside javascript.

In `app/components/MovieCard.tsx` we have the component to use, which takes a `title` and `img` as props. Let's dig in how it works!

```
type MovieCardProps = {
  title: string;
  img: string;
};
```

- This is the props you will be able to send to the component, defined by a name - `title` and `img`, and their corresponding type - both are of type `string`.

> A [prop](https://react.dev/learn/passing-props-to-a-component) is how a parent component can pass information to a child component.

```
export const MovieCard = ({ title, img }: MovieCardProps) => {
  /*  */
};
```

- This is the name of the React Component, and specifying that it takes props as type `MovieCardProps`.

```
  return <p>My movie card</p>;
```

- As return value, we have the markup for the component. Here you can specify all normal html tags that you know of, such as `div` and `h1`.

### 1.1 Create your own MovieCard

Time to be playful!

**Task**: Display the movie title and the img in the react component.

To invoke javascript into the markup, you need to contain the variable in curly brackets, as:

```
  return (
    <>
      {myVariable}
    </>
  );
```

As told earlier, we are using Tailwind CSS for our styling (CSS).

> [Tailwind CSS](https://tailwindcss.com/) is a utility based CSS framework, where you build up your stylings by adding multiple CSS classes to your markup, where each class only sets one thing, such as `m-8` sets a margin of `8px`.

When styling html tags in React, we are using `className` instead of `class`. Example:

```
  return (
    <div className="my-tailwind-class">
      {myVariable}
    </div>
  );
```

Let the creativity flow with the styling, but don't put too much time on it :)

### 1.2 (Enhancements)

**Task**: Extend the props and MovieCard to also show a description and other attributes available in the `Movie` type.

## 2. Search for movie

... but wouldn't it be more fun if it was YOUR favorite movies that were shown here? Next part will allow us to search, and find, your faviourite movies!

But first, let us understand the index page. In Next.js, the file `app/page.tsx` is what is shown when you enter the `localhost:3000`

```
{movies.map((movie) => (
  <MovieCard
    title={movie.title}
    backgroundImg={movie.img}
    key={movie.imdbId}
    isFavorite={movie.isFavorite}
  />
))}
```

- This part maps each example movie (of type `Movie`) to your own `MovieCard`.

### 2.1 Add UI components

To be able to search, we need an input field and a button. This correspond to the html elements `input` and `button`

**Task:** Add an input field + button to `page.tsx`. Style them as you wish.

> In Next.js, there is a concept called [Layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates), which allows us to keep layout and state if route changes - for performance, but also handy for UI cohesiveness. In the top layout file, `layout.tsx`, one can specify styling that is to be applied to all pages. In out `layout.tsx`, for example we have specified the purple background color, given by the tailwind class `bg-rose-950` - feel free to change it!

### 2.2 Search logic

So how do we act based on what the user searches for?

In React, when we want to share and maintain a value used between components close to each other, we can use the React built-in hook `useState`.

> A [React hook](https://react.dev/learn#using-hooks) is like a tool that lets you add special features (like state and side effects) to your React components.

The `useState` hook returns two variables - one that contains the value, and one that is a function that updates the state. It can be used like:

```
  const [myState, setMyState] = useState(0); // 0 is the initial value in the state
  setMyState(2) /7 this sets 2 as the new value

  return <div>{myState}</div> // Will display "2", and update once the state updates.
```

_note_: hooks needs to be called at the top of the React Component, like

```
export const MyComponent = () => {
  const [myState, setMyState] = useState();
  /* ... */
  return <></>;
}
```

**Task:** When the user writes in the input field, save the value in a state.

To perform an action in code when the user performs an action, we can use the `onClick` attribute to buttons. `onClick` takes in a function, that is performed when the button is clicked, like:

```
  /* ... */
  return <>
    <button
      type="button"
      onClick={() => console.log('you are awesome!!')}
      >
      Click me
    </button>
  </>;

```

**Task:** When the user clicks on the search button, call the method `fetchMovies` with the input value. This is where we in the next step will fetch the movies!

### 2.3 Use BFF

Time to get some real data in your application! If you remember from the intro, this Next.js project also contains a Backend-For-Frontend. All `route.ts` files corresponds to an endpoint, where the path is given by the folder structure. For example `app/api/myPath/route.ts` corresponds to the endpoint `/api/myPath`.

> More documentation about Next.js routes found [here](https://nextjs.org/docs/app/building-your-application/routing/defining-routes).

To fetch something from our frontend, we can use the method `fetch` which is available globally within all js applications, such as:

```
  const url = "yourUrl";

  const response = await fetch(url);
  return await response.json();

```

**Task:** Update the `fetchMovies` function so that it calls our api backend instead of logging to the console. Hint: The available endpoints and what data to send are defined in the section [Getting Started](#0-getting-stared-frontend-path).

**Task:** Use the return value you get from `fetchMovies` and update the `movies` variable in `page.tsx`. Hint: How do we set state?

### 2.4 (Enhancements)

Some enhancements to your page - but skip at first and go back to these if there is time available at the end :)

**a) Initial view**

- Instead of showing static movies from the start, show a text "search for your favourite movie".

**b) Loading state**

- To get some user feedback when search button has been pressed, add a new state that contains if the page is loading. If it is, show something in the UI for the user.

### 2.5 Celebration!

Congrats for completing the first two steps and connecting frontend to the backend! Well done!!

## 3. Add to favorites

Next step is to add the possibility to select favorite movies!

### 3.1 Favorite Icon

In the `Movie` type, we have one attribute `isFavorite`, that that defines if you have marked this movie as favorite - this is something we can use in our Movie Cards when displaying the movie.

> To use assets (images / icons etc) in Next.js, you need to add your picture to the `public` folder. once there, it will be available to use in `<img>` components by defining `<img src=/your-image-name.png`. You will likely be prompted to use a NextImage, but you can in this workshop just as well use normal `<img>` tag.

**Task**: Add the prop `isFavorite` to your MovieCard.tsx component, and display in the card if the movie is your favorite or not.

To not only display, but also be able to change the favorite status, we need a mechanism for that! To make it easier for you, we have prepared a method `addToFavorites` which calls the api endpoint `/users/{userId}/favorites/{movieId}` that adds a movie to the favorites. Use that function, or implement your own.

**Task**: Add a button to your MovieCard, that on click, calls the method `addToFavorites` with the `imdbId`. Give the user some feedback that favorite has been added.

### 3.2 (Enhancements)

**a) Toggle favorite on change**

- We want to be able to remove movies we have set as favorites as well. Implement a new button which removes a movie as a favorite on click. To remove a movie, you can use the same endpoint as when adding, but with a `DELETE` request instead of `POST`.

**a) Update the state on favorite change**

- When you are adding or removing an item as a favorite, we want to visualise directly if the card is a favorite or not.

## 4. Show favorites

Lastly, we want to be able to show our own favouries on a new page!

### 4.1 Add new route

To create a new page with Next.js, we need to create another `page.tsx` file. You might remember that in Next.js, the file `app/page.tsx` is what is shown when you enter the `localhost:3000`. It is due to that the route depends on where in the folder structure is placed, so that a `page.tsx` placed under `app/foo/boo/page.tsx` would correspond to the page `localhost:3000/foo/boo` This is just like the API endpoint depends on where the `route.ts` is located.

**Task**: Create a new page `localhost:3000/favorites` that displays a title "My Favorites".

### 4.2 Fetch and show your favorites

But for it to be a favorites page, we need to add favorites, right?

**Task**: Fetch all your favorites, and show them in your MovieCards.

### 4.3 (Enhancements)

**a) Link to pages**

- For easy access to your favorites page, link to it from your home page. Hint: the [anchor HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a), `<a>` tag, is used for linking to other pages.

**b) Loading state**

- Add a loading symbol when the movies are loading

### 4.4 Celebration!

Now you have completed the "main" part of this workshop - congratulations! Either go back and do the enhancements, or challenge yourself with improving the [responsiveness](https://www.w3schools.com/html/html_responsive.asp) or [A11y](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - two very important aspects for a frontend engineer!

## Learn More

Did you like the tools we used in the workshop?

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
