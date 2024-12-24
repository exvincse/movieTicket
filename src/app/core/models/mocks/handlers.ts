// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from "msw";

export const handlers = [
    http.get("https://api.themoviedb.org/3/api/error", () => HttpResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    ))
];
