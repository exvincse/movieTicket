// 電影分級資料
export interface MovieReleaseDateOutputModel {
    id: number;
    results: {
        iso_3166_1: string;
        release_dates: {
            certification: string;
            descriptors: string[];
            iso_639_1: string;
            note: string;
            release_date: string;
            type: number;
        }[]
    }[]
}

// 電影分級資料(含基本回傳格式)
export type MovieReleaseDateOutputModelEntity = MovieReleaseDateOutputModel;
