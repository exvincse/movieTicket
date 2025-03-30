import { clearUserData, setUserData, setUserIsLoginData } from "./user.actions";
import { userReducer } from "./user.reducer";
import { initUserData } from "./user.state";

describe("User Reducer", () => {
    const userDataMock = {
        userNo: 100,
        name: "",
        email: "",
        countyCode: "",
        districtCode: "",
        postalCode: "",
        address: "",
        sexCode: "001",
        birthday: ""
    };
    it("更新userdata", () => {
        const state = userReducer(initUserData, setUserData({ userData: userDataMock }));
        expect(state.userData).toEqual(userDataMock);
    });

    it("更新UserIsLogin", () => {
        const state = userReducer(initUserData, setUserIsLoginData({ isLogin: true }));
        expect(state.isLogin).toEqual(true);
    });

    it("清除userdata", () => {
        const mockData = {
            userData: userDataMock,
            isLogin: true
        };
        const state = userReducer(mockData, clearUserData());
        expect(state.userData).toEqual(initUserData.userData);
    });
});
