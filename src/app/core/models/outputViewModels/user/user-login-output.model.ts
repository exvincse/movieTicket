import { BaseApiOutputModel } from "../base/base-api-output-model";

// 登入後回傳token
export interface UserLoginOutputModel {
    accessToken: string;
}

export type UserLoginOutputModelEntity = BaseApiOutputModel<UserLoginOutputModel>;
