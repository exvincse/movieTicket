import { BaseApiOutputModel } from "../base/base-api-output-model";

// 縣市鄉鎮區號
export interface AddressOutputModel {
    countyName: string;
    countyCode: string;
    district: {
        districtName: string;
        districtCode: string;
        postalCode: string;
    }[];
}

// 鄉鎮區號
// export type District = Pick<AddressOutputModel["district"][number], "districtName" | "districtCode" | "postalCode">;

// 縣市鄉鎮區號(含基本回傳格式)
export type AddressOutputModelEntity = BaseApiOutputModel<AddressOutputModel[]>;
