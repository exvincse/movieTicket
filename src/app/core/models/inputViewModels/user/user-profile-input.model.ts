import { BaseApiOutputModel } from "../../outputViewModels/base/base-api-output-model";

// 個人資料
export interface UserProfileInputModel {
    userNo: number;
    name: string;
    email: string;
    countyCode: string;
    districtCode: string;
    postalCode: string;
    address: string;
    sexCode: string;
    birthday: string;
}

export type UserProfileInputModelEntity = BaseApiOutputModel<UserProfileInputModel>;
