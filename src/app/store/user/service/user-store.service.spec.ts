import { TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";

import { clearUserData, setUserData, setUserIsLoginData } from "../user.actions";
import { selectUserData, selectUserIsLoginData } from "../user.selectors";
import { UserStoreService } from "./user-store.service";

describe("UserStoreService", () => {
    let service: UserStoreService;
    let store: MockStore;
    const mockUserData = {
        userNo: 123,
        name: "test",
        email: "",
        countyCode: "",
        districtCode: "",
        postalCode: "",
        address: "",
        sexCode: "001",
        birthday: ""
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserStoreService,
                provideMockStore()
            ]
        });

        store = TestBed.inject(MockStore);
        service = TestBed.inject(UserStoreService);
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });

    it("設定使用者資料", () => {
        const spy = spyOn(service.store, "dispatch");
        service.setUserData(mockUserData);
        expect(spy).toHaveBeenCalledWith(setUserData({ userData: mockUserData }));
    });

    it("取得使用者資料", () => {
        store.overrideSelector(selectUserData, mockUserData);

        service.getUserData().subscribe((data) => {
            expect(data).toEqual(mockUserData);
        });
    });

    it("設定使用者是否登入", () => {
        const spy = spyOn(service.store, "dispatch");
        service.setUserIsLogin(true);
        expect(spy).toHaveBeenCalledWith(setUserIsLoginData({ isLogin: true }));
    });

    it("取得使用者是否登入", () => {
        store.overrideSelector(selectUserIsLoginData, true);

        service.getUserIsLogin().subscribe((data) => {
            expect(data).toBeTrue();
        });
    });

    it("清除使用者資料", () => {
        const spy = spyOn(service.store, "dispatch");

        service.setClearUserData();

        expect(spy).toHaveBeenCalledWith(clearUserData());
    });
});
