import {OmdbMovie} from "@/app/types/omdb/OmdbMovie";
import {Movie} from "@/app/types/Movie";
import {MovieEntity} from "@prisma/client";

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

    public toDto(isFavorite: boolean): Movie {
        return {
            imdbId: this._imdbId,
            title: this.title,
            img: this.img,
            isFavorite: isFavorite
        }
    }
}
