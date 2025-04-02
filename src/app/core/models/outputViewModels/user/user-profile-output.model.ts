import { BaseApiOutputModel } from "../base/base-api-output-model";

// 個人資料
export interface UserProfileOutputModel {
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

export type UserProfileOutputModelEntity = BaseApiOutputModel<UserProfileOutputModel>;
