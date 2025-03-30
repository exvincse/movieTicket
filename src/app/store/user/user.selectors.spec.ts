import { selectUserData, selectUserIsLoginData } from "./user.selectors";
import { UserState } from "./user.state";

describe("User Selectors", () => {
    const userDataMock: UserState = {
        userData: {
            userNo: 0,
            name: "",
            email: "",
            countyCode: "",
            districtCode: "",
            postalCode: "",
            address: "",
            sexCode: "",
            birthday: ""
        },
        isLogin: false,
    };
    it("取得userdata", () => {
        expect(selectUserData.projector(userDataMock)).toEqual(userDataMock.userData);
    });

    it("取得userIsLoginData", () => {
        expect(selectUserIsLoginData.projector(userDataMock)).toEqual(userDataMock.isLogin);
    });
});
