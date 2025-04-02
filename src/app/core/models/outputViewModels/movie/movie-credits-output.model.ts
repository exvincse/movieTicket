// 電影演員資料
export interface MovieCreditsOutputModel {
    id: number;
    cast: {
        adult: number;
        gender: number;
        id: number;
        known_for_department: string;
        name: string;
        original_name: string;
        popularity: number;
        profile_path: string;
        cast_id: number;
        character: string;
        credit_id: string;
        order: number;
    }[];
    crew: {
        adult: number;
        gender: 0,
        id: number;
        known_for_department: string;
        name: string;
        original_name: string;
        popularity: number;
        profile_path: null,
        credit_id: string;
        department: string;
        job: string;
    }[]
}

// 電影演員資料(含基本回傳格式)
export type MovieCreditsOutputModelEntity = MovieCreditsOutputModel;
