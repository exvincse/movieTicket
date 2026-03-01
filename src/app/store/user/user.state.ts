export interface UserDataType {
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

export interface SettingDataType {
    tmdbApiKey: string;
    pdAzureSubKey: string;
}

export interface UserState {
    userData: UserDataType;
    isLogin: boolean;
    setting: SettingDataType;
}

export const initUserData: UserState = {
    userData: {
        userNo: 0,
        name: "",
        email: "",
        countyCode: "",
        districtCode: "",
        postalCode: "",
        address: "",
        sexCode: "001",
        birthday: ""
    },
    isLogin: false,
    setting: {
        tmdbApiKey: "",
        pdAzureSubKey: ""
    }
};
