// 電影類型
export interface MovieGenreOutputModel {
    id: number;
    name: string;
}

// 電影類型
export interface MovieGenreOutputModelEntity {
    genres: MovieGenreOutputModel[]
}
