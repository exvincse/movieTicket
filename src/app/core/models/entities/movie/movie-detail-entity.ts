// 電影詳細資料
export interface MovieDetailEntity {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: string;
    cast: string;
    budget: number;
    director: string;
    genres: string;
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: string[],
    production_countries: string[],
    release_date: string;
    revenue: number;
    runtime: number;
    rate: string;
    rateImg: string;
    spoken_languages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
