export interface UserDataType {
    userNo: string;
    name: string;
    email: string;
    countyCode: string;
    districtCode: string;
    postalCode: string;
    address: string;
    sexCode: string;
    birthday: string;
}

export interface UserState {
    userData: UserDataType;
}

export const initUserData: UserState = {
    userData: {
        userNo: "",
        name: "",
        email: "",
        countyCode: "",
        districtCode: "",
        postalCode: "",
        address: "",
        sexCode: "001",
        birthday: ""
    }
};
