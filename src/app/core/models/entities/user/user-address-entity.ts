// 縣市鄉鎮區號
export interface AddressEntity {
    countyName: string;
    countyCode: string;
    district: {
        districtName: string;
        districtCode: string;
        postalCode: string;
    }[];
}

// 鄉鎮區號
export type DistrictEntity = Pick<AddressEntity["district"][number], "districtName" | "districtCode" | "postalCode">;
