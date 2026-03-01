import { BaseApiOutputModel } from "../base/base-api-output-model";

// 環境設定回傳資料
export interface UserSettingOutputModel {
    tmdbApiKey: string;
    pdAzureSubKey: string;
}

export type UserSettingOutputModelEntity = BaseApiOutputModel<UserSettingOutputModel>;
