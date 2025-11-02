## 0 Getting started - prerequisites

Reading this, you have most likely already checked out the `backend-base` branch.

### 0.1 Access to OMDB API

In order to send requests to the OMDB API, you need to fetch an API-key. Go to the [OMDB API website](https://www.omdbapi.com/apikey.aspx?__EVENTTARGET=freeAcct&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUKLTIwNDY4MTIzNQ9kFgYCAQ9kFggCAQ8QDxYCHgdDaGVja2VkZ2RkZGQCAw8QDxYCHwBoZGRkZAIFDxYCHgdWaXNpYmxlZ2QCBw8WAh8BaGQCAg8WAh8BaGQCAw8WAh8BaGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgMFC3BhdHJlb25BY2N0BQhmcmVlQWNjdAUIZnJlZUFjY3TuO0RQYnwPluQ%2Bi0YJHNTcgo%2BfiAFuPZl7i5U8dCGtzA%3D%3D&__VIEWSTATEGENERATOR=5E550F58&__EVENTVALIDATION=%2FwEdAAV39P5KqwNGJgd%2F4UbyWCx3mSzhXfnlWWVdWIamVouVTzfZJuQDpLVS6HZFWq5fYpioiDjxFjSdCQfbG0SWduXFd8BcWGH1ot0k0SO7CfuulNNHYC5f864PBfygTYVt5wnDXNKUzugcOMyH4eryeeGG&at=freeAcct&Email=)
and generate a FREE API key.

When you have received the API key via e-mail, make sure you have **_activated it_** by clicking the link in the e-mail.

Now you can try using it in your terminal by fetching the titanic movie.

```bash
curl "http://www.omdbapi.com/?t=titanic&apikey=<API-KEY>"
```

This should return a Movie object representing the movie Titanic.

## 0.2 Configure your personal OMDB API key and the URL

Create a `.env` file in the root of your project.
Set the omdb url and your personal api key from 0.1 in the [.env](.env) file.

```markdown
OMDB_API_KEY= #Set your own API key <your_personal_api_key>
OMDB_BASE_URL=http://www.omdbapi.com/
```

# 1 Create your own Database

### 1.1 Create your own cloud database project using Neon

You will create your own free database using Neon. Create an Free account by going to their website: https://neon.com/ and click on the "Start for free". When you have signed in create a new project.

In the Project Dashboard, you can find the "Connect to you database". We need the connection string to be able to access our database from our project. Copy your connection string and add it to the global enviorment variable `DATABASE_URL` in your `.env` file (dont add the psql prefix).

```markdown
DATABASE_URL= #Set your databae URL
```

![alt text](image-2.png)

You now have a connection between your project and your database project.

### 1.2 Create and populate your database

Now you need to create the needed database tables.

The tables we need are:

```
TABLE users (
    id VARCHAR(50) PRIMARY KEY
);
TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    img TEXT NOT NULL,
    imdb_id VARCHAR(50) NOT NULL UNIQUE
);
TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) NOT NULL,
    movie_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);
```

Below is a UML diagram of the tables.

![Database Tables](resources/db-tables.drawio.png "Database Tables")

We will use Prisma schema that we will use to initialise our database tables. Run the following script in your terminal to generate the tables.

```markdown
npm run db:init
```

You should get a green message `Your database is now in sync with your schema.` and it should have generated a migrations folder under /prisma. You can also now see the table in you Neon project under `Tables`.

We now need to generate the Client code based on our schemas. Run the script:

```markdown
npm run db:generate
```

### 1.3 Add you user to the users table

Add the global varaibale `NEXT_PUBLIC_USERNAME` to you .env file. This variable will be used when you seed (add your user to your users db table) and later on during different requests.

```markdown
NEXT_PUBLIC_USERNAME=<firstname.lastname>
```

Once you have added this to you .env file you can seed you database by running:

```markdown
npm run db:seed
```

It should return the text `Added main user { id: 'myName' }`. If you now do a SQL query in your Neon project you should see your user in the table. To do this go to the SQL editor in Neon and run the SQL script:

```markdown
SELECT \* FROM users;
```

Your database is now ready for the next steps!

### 1.4 Service Layer Pattern/Layered Architecture.

In this workshop, we will work according to the Service Layer Pattern, also known as Layered Architecture.
This pattern is a design pattern that separates the different parts of a service into different layers. The layers are:

- Presentation Layer: The layer that presents data to the user (the controller or api in this case).
- Business Logic Layer: The logic that processes the data (also referred to as te service layer).
- Data Access Layer: The layer that interacts with the database (also referred to as the repository layer).
  The pros of this design pattern are:
  Modularity: Encourages separation of concerns, making it easier to understand and maintain the codebase.
  Flexibility: Allows for the evolution of individual layers without affecting the entire system.
  Scalability: Permits scaling of specific layers to accommodate changing requirements.

## 1.5 Enviorment file

When you are done with all steps above your .env file should look something like the .env.sample file.

# 2 Running the application

## 2.1 Starting the application

To run the application, you need to install the dependencies and start the server.
Run

```bash
npm install
```

and then start the server with

```bash
npm run dev
```

The server will start on `http://localhost:3000` and the frontend will be available on `http://localhost:3000`.

Now everything seems to work and we are ready to start coding! 🚀

# 3. Searching for movie titles

We want to be able to search for movie titles in the frontend and display the search results.
First, make sure your server is still running, and go to `http://localhost:3000` in your browser.
There you will see a search field where you can search for movies. Try searching for a movie title, and you will see
the message "Failed to fetch movies".

![Prisma Studio](resources/failed-to-fetch-movies.png)

This is because we have not yet implemented the search functionality
in the backend.
Let's do it together!

## 3.1 What is a RESTful search endpoint

A RESTful search endpoint is designed to allow clients to search or filter resources based on query parameters,
typically using the `GET` HTTP method. Our resource in this case, is movies, and we want to search using partial
movie titles. The endpoint will look as follows:

```bash
GET /api/movies?title=<partial-title>
```

So that when we call for example

```bash
GET /api/movies?title=star
```

and the request would return movies whose titles contain the word "star" (e.g. "Star Wars", "A Star is Born",
"Star Trek").
In this example, the title that we send along to the endpoint is called a query parameter.

## 3.2 Create the API route

In next.js, we can create an API route by placing a file `route.ts` in the `app/api` directory. Since we also want
movies included in the path of our endpoint, we add our `route.ts` file in the
`app/api/movies` directory. This route class represents the Presentation Layer for movies.

## 3.3 Create the GET endpoint

Let's first create a GET-endpoint that extracts the title from the request URL and returns it
as a response. Try creating a GET function by yourself or dd the following code to `app/api/movies/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const partialTitle = url.searchParams.get("title");
  return NextResponse.json([{ partialTitle }]);
}
```

Note that the path of the `route.ts` file corresponds to the path of the HTTP endpoint - this is how next determines
the path of the endpoint. The `GET` function is the handler for the GET request to the endpoint. It extracts the
`title` query parameter from the request URL and returns it as a JSON object.

## 3.2 Verify the endpoint response

To verify that the endpoint works, we can `curl` it in the terminal. Make sure you still have your
server running, and call the endpoint using

```bash
curl -X GET http://localhost:3000/api/movies?title=star&userId=<your-firstname>.<first-letter-of-your-last-name>
```

this should return the response `[{"partialTitle":"star"}]`.

## 3.3 Browse the OMDB API

Since we will get the movies from the OMDB API, we need to search for movies in their API.
We can look at their API at [omdbapi.com](http://www.omdbapi.com/). Browse to see if you find something useful for us.
You may see that they already have a search endpoint that we can use. You may see that they have an
option to specify partial matches - specifying the `s` parameter in the query string will
search for several partial matches instead. We will use this endpoint in our backend.

## 3.4 Integrate with the OMDB API

Now when we know what endpoint and options we should call, we create a client in our backend that fetches
movie titles from the OMDB API.

### 3.4.1 Types

Since we are using TypeScript, we have the advantage of being able to type the response from the OMDB API.
This helps us catch errors early and makes the code easier to read. We have already
created a type `OmdbMovie` in the `types` directory representing the movie object that we get from the OMDB API.

```typescript
export type OmdbMovie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};
```

We also have a type `OmdbSearchResponse` in the same directory representing the response from the OMDB API.

```typescript
import { OmdbMovie } from "@/app/types/omdb/OmdbMovie";

export type OmdbSearchResponse = {
  Search: OmdbMovie[]; // Array of movies matching the search
  totalResults: string; // Total number of results as a string
  Response: string; // "True" if the request was successful, otherwise "False"
};
```

We have also already created a type `MovieDto` representing the movie object that will be sent to the frontend.

```typescript
export type MovieDto = {
  /* Feel free to add more */
  imdbId: string;
  title: string;
  img: string;
  userId: string;
  isFavorite: boolean;
};
```

This is what we call a DTO which stands for Data Transfer Object. It is a design pattern used to transfer
data between software application subsystems. The idea of this is to encapsulate all information needed
by the calling system, without the calling system having to make several calls. It also allows you to
only transfer the data that is required rather than the entire domain object.

Last of all, we also have a class
`InternalMovie` in `api/movies` that will be our domain object, i.e. the representation of a movie
in our backend.

```typescript
export class InternalMovie {
  private _id: string;
  private _imdbId: string;
  private title: string;
  private img: string;

  constructor(id: string, imdbId: string, title: string, img: string) {
    this._id = id;
    this._imdbId = imdbId;
    this.title = title;
    this.img = img;
  }

  get id(): string | null {
    return this._id;
  }

  get imdbId(): string | null {
    return this._imdbId;
  }

  static fromOmdbMovie(omdbMovie: OmdbMovie): InternalMovie {
    return new InternalMovie(
      "",
      omdbMovie.imdbID,
      omdbMovie.Title,
      omdbMovie.Poster
    );
  }

  static fromEntity(movieEntity: MovieEntity): InternalMovie {
    return new InternalMovie(
      movieEntity.id,
      movieEntity.imdb_id,
      movieEntity.title,
      movieEntity.img
    );
  }

  public toDto(isFavorite: boolean): MovieDto {
    return {
      imdbId: this._imdbId,
      title: this.title,
      img: this.img,
      isFavorite: isFavorite,
    };
  }
}
```

It has a static factory method `from` which takes an `OmdbMovie` object and returns an `InternalMovie` instance.
This keeps transformation logic encapsulated within the `Movie` class, meaning that if the `OmdbMovie`
structure changes, you only need to update this method. The `toDto` method returns a `MovieDto` object
customized for the frontend where extra parameters specific for the calling user will be included.

### 3.4.2 Add search method in the omdbClient

We have a separate class `OmdbClient` in `api/movies/omdbClient.ts` which will be responsible
for all communication with the OMDB API. This class already holds the `apiKey` that you generated
for yourself in the beginning, as well as the `baseUrl` for the OMDB API. In this class
we will add a `search`-method that fetches movies and returns a `OmdbSearchResponse` using axios.
Axios is a promise-based HTTP client.

```typescript
import axios from "axios";
import { OmdbSearchResponse } from "@/app/types/omdb/OmdbSearchResponse";

class OmdbClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    const apiKey = process.env.OMDB_API_KEY || "";
    const baseUrl = process.env.OMDB_BASE_URL || "";
    if (!apiKey) {
      throw new Error(
        "OMDb API key not provided. Set the OMDB_API_KEY environment variable in .env."
      );
    } else if (!baseUrl) {
      throw new Error(
        "OMDb API URL not provided. Set the OMDB_API_URL environment variable in .env."
      );
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /* <--------------- Add this method ---------------> */
  async searchByTitle(title: string): Promise<OmdbSearchResponse> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          s: title,
          apikey: this.apiKey,
        },
      });
      if (response.data && response.data.Response === "True") {
        return response.data;
      } else {
        return {} as OmdbSearchResponse;
      }
    } catch (error) {
      console.error("Error fetching movie by title from OMDB:", error);
      throw new Error("Failed to fetch movie from OMDb");
    }
  }
}

export const omdbClient = new OmdbClient();
```

### 3.4.3 Search by title in MovieService

We also have a service class `MovieService` in `api/movies/MovieService.ts` that will use the `omdbClient` to
fetch movies. This service class will represent the Business Logic Layer for movies. In the `MovieService` we add
a method `searchByTitle` which will search for movies by title and return a list of `MovieDto` objects.

```typescript
  async searchByTitle(title: string, userId: string): Promise<MovieDto[]> {
    const response: OmdbSearchResponse = await omdbClient.searchByTitle(title);
    const omdbMovies: OmdbMovie[] = response.Search;
    if (!omdbMovies) {
      return [];
    }
    return movieDtos;
  }
```

The observant reader will notice that we have commented out the `userId` parameter in the `searchByTitle` method.
The reason why the userId is also sent along is that whilst searching in the frontend, the frontend
also wants to know if the movies it displays are favorites for the user. This is why we have the `isFavorite`
boolean value within the `Movie` DTO object. This is of course user-specific, so we need to send along the userId.

### 3.4.3 Search by title and userId in MovieService

Updating the method to also determine if the user has marked the movie as a favorite, we can call the
`favoriteService` responsible for the favorite business logic. This service has a method `isFavorite` that
determines if a user has marked the movie as a favorite. We will add this logic to the search method.
We loop through all the movies and check if the user has marked the movie as a favorite. We then generate
the DTOs based on the result from isFavorite.

```typescript
  async searchByTitle(title: string, userId: string): Promise<MovieDto[]> {
    const response: OmdbSearchResponse = await omdbClient.searchByTitle(title);
    const omdbMovies: OmdbMovie[] = response.Search;
    if (!omdbMovies) {
      return [];
    }
    /* <--------------- Add this block ---------------> */
    const movieDtos: MovieDto[] = await Promise.all(
      omdbMovies.map(async (omdbMovie) => {
        const movie: InternalMovie = InternalMovie.fromOmdbMovie(omdbMovie);
        const isFavorite: boolean = await favoriteService.isFavorite(
          userId,
          movie.imdbId!
        );
        return movie.toDto(isFavorite);
      })
    );
    return movieDtos;
  }
```

### 3.4.4 Call the search method from the Presentation layer

Now we can try calling this method from the api movies route that we created in step 3.3

```typescript
import { NextRequest, NextResponse } from "next/server";
import { movieService } from "@/app/api/movies/MovieService";
import { MovieDto } from "@/app/types/MovieDto";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const partialTitle = request.nextUrl.searchParams.get("title");
  const userId = request.nextUrl.searchParams.get("userId");
  if (!partialTitle) {
    // <--- Some added error handling
    return NextResponse.json(
      { error: "Missing title query parameter" },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId query parameter" },
      { status: 400 }
    );
  }
  const matchingMovies: MovieDto[] = await movieService.searchByTitle(
    partialTitle,
    userId
  ); // <--- HERE
  return NextResponse.json(matchingMovies); // and returning here
}
```

If you do not set the response status yourself, the NextResponse will default to 200 OK.

### 3.4.4 Verify the endpoint response

Curl the endpoint in the terminal to see if it works

```bash
curl -X GET http://localhost:3000/api/movies?title=star&userId=<your-firstname>.<first-letter-of-your-last-name>
```

it should return a list of movies with the word "star" in the title. Where isFavorite is false for all movies
since you have not liked any movies yet.

### 3.4.5 Trying out the search in the frontend

Use your browser and go to `http://localhost:3000` and search for a movie title. You should now see a
visualization of movies with the word you searched for in the title. Well done!! 🎉

## 3.5 Saving favorite movies

We want our users to be able to like their favorite movies by clicking the heart icon on the movie
when searching in the frontend.

### 3.5.0 Trying to add favorites in the frontend.

Use your browser and go to `http://localhost:3000` and search for a movie title. Try liking the movie
by clicking the heart. Then click "Go to my favorites". You will see that the movie
you liked is not added to your favorites. Let's fix it!

### 3.5.1 RESTful POST endpoint for saving favorite movies

We will add a POST endpoint that will save a movie.
The endpoint will look like this:

```bash
POST /api/users/{id}/favorites/{imdbId}
```

where users is still a resource, and favorites is a sub-resource of users. I.e. a users favorites only belongs
to that specific user.

### 3.5.2 Add the POST method for the API route for favorites

In the file `app/api/users/[userId]/favorites/[imdbId]/route.ts`, we already have a DELETE endpoint setup
for deleting favorites, and now we want to be able to POST favorites as well. Note that this is
another route than the one we edited earlier (different path). Add the following function
to the route:

```typescript
export async function POST(
  request: NextRequest,
  context: { params: { userId: string; imdbId: string } }
): Promise<NextResponse> {
  const params = await context.params;
  if (!params.userId || !params.imdbId) {
    return NextResponse.json(
      { error: "Invalid request, missing userId or imdbId" },
      { status: 400 }
    );
  }
  const movieDto: MovieDto = await favoriteService.addFavorite(
    params.userId,
    params.imdbId
  );
  return NextResponse.json({ movieDto }, { status: 201 });
}
```

Note here that we set status `201 Created` when we have successfully added a favorite. This is a common
practice when you create a new resource in a RESTful API.

### 3.5.3 Add the addFavorite method in the favoriteService

In the `app/api/favorites/favoriteService.ts` file, we will add the method `addFavorite` that will add a favorite.
This method needs to do three things:

1. verify that the user exists
1. check if there already exists a movie with the `imdbId` in the database, otherwise create it.
1. save the favorite for the user in the database.

```typescript
  async addFavorite(userId: string, imdbId: string): Promise<MovieDto> {
    const user: UserDto = await userService.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    const favoriteMovie: InternalMovie = await movieService.getOrCreateMovie(
      imdbId
    );
    const favoriteEntity: FavoriteEntity | null =
      await favoriteRepository.saveFavorite(userId, favoriteMovie.id!);
    if (!favoriteEntity) {
      throw new Error(
        `Could not add favorite movie with IMDB ID ${imdbId} for user ${userId}`
      );
    }
    return favoriteMovie.toDto(true);
}
```

### 3.5.4 Add the saveFavorite method in the favoriteRepository

In the `app/api/favorites/favoriteRepository.ts` file, we will for the first time touch the data
access layer of our application. We will add the method `saveFavorite` that will save a favorite
in the favorites table. Since the `favoriteService` has already checked that the
movie exists and extracted the `movieId`, we can safely add the favorite to the database
using the prisma `create`. Under the hood, this method will also make sure that the user
and the movie exist in the database. Prisma does this by keeping track of the relations in
`schema.prisma`. If the user or the movies does not exist, the prisma will throw an error.

```typescript
  async saveFavorite(
    userId: string,
    movieId: string
  ): Promise<FavoriteEntity | null> {
    try {
      return await prisma.favoriteEntity.create({
        data: {
          user_id: userId,
          movie_id: movieId,
        },
      });
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }
```

Now you can go to the frontend again and try searching for and liking a movie. Clicking "Go to my favorites"
and you should see the movie you liked in your favorites list. Hurray! 🎉

Now go ahead and search and like your favorite movies!! 🚀

## What you have learnt

In this workshop, you have touched many of the techniques and patterns
that backend developers use in modern development today. The principles and techniques we have used are:

1. You have worked with DTOs and Domain objects to separate concerns of the frontend from the
   representation of the domain objects in the backend.
1. You have used a relational database, postgresql, setup in Google Cloud SQL and
   interacted with it using an ORM, Object-Relational Mapping, Prisma.
1. You have created a RESTful API with endpoints for searching and saving favorites.
1. You have used a Service Layer Pattern to separate the different parts of the backend
   service into layers (repository, service and controller) - making your code more modular and easy to maintain.
1. You have integrated with a third-party API (OMDB) to fetch data used in your application.

## Feedback

We are super-interested in any feedback you might have on this workshop.
Please reach out to us personally on anyone from Talent Search to provide
your feedback. Looking forward to hearing from you!

## Future work

If you want to continue working on this outside of this workshop,
we suggest you exchange the cloud database with a local database as the common
database we have used in this workshop will be deleted.
We suggest running a PostgreSQL database in a docker container locally
using docker desktop. You can find the docker image for PostgreSQL at
[hub.docker.com](https://hub.docker.com/_/postgres).
Then configure your .env file `DATABASE_URL` to point to your local database.

Another very important part we have not touched on in this workshop is testing.
We highly recommend you to write tests for your code. If you want to practice
testing skills, we recommend you to try adding unit- and integration tests
for your application - for example using Jest.

If this application was to be reached on the internet, we would also need to
deploy it. We want to challenge you to think through the entire deployment
flow of the application from development to having the service spinning in the cloud for
public access. What would this flow look like? What services would you use?
This is a great exercise to understand the entire flow of a modern web application.

- To get some user feedback when search button has been pressed, add a new state that contains if the page is loading. If it is, show something in the UI for the user.

### 2.5 Celebration!

Congrats for completing the first two steps and connecting frontend to the backend! Well done!!

## 3. Add to favorites

Next step is to add the possibility to select favorite movies!

### 3.1 Favorite Icon

In the `MovieDto` type, we have one attribute `isFavorite`, that that defines if you have marked this movie as favorite - this is something we can use in our Movie Cards when displaying the movie.

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
