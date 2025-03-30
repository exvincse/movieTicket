import {
    ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of } from "rxjs";

import { BaseComponent } from "./base.component";

describe("BaseComponent", () => {
    let component: BaseComponent;
    let fixture: ComponentFixture<BaseComponent>;
    const userRepositoryService = jasmine.createSpyObj("UserRepositoryService", ["getLocation", "putUserProfile", "getUserProfile"]);
    const usetStoreApiMock = jasmine.createSpyObj("UserStoreService", ["getUserData"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const loactionMock = [
        {
            countyName: "1",
            countyCode: "1",
            district: [
                {
                    districtName: "12",
                    districtCode: "12",
                    postalCode: "12"
                },
                {
                    districtName: "13",
                    districtCode: "13",
                    postalCode: "13"
                }
            ]
        },
        {
            countyName: "2",
            countyCode: "2",
            district: [
                {
                    districtName: "21",
                    districtCode: "21",
                    postalCode: "21"
                },
                {
                    districtName: "22",
                    districtCode: "22",
                    postalCode: "22"
                }
            ]
        }
    ];

    const userDataMock = {
        userNo: 123456,
        name: "xxxx",
        email: "xxxx@gmail.com",
        countyCode: "xxx",
        districtCode: "xxx",
        postalCode: "xxx",
        address: "xxxxx",
        sexCode: "001",
        birthday: "2024-11-12"
    };

    userRepositoryService.getLocation.and.returnValue(of({ result: loactionMock }));
    usetStoreApiMock.getUserData.and.returnValue(of(userDataMock));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BaseComponent,
                ReactiveFormsModule
            ],
            providers: [
                { provide: UserRepositoryService, useValue: userRepositoryService },
                { provide: UserStoreService, useValue: usetStoreApiMock },
                { provide: SweetAlertService, useValue: sweetAlertService },
                FormBuilder
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        sweetAlertService.open.calls.reset();
        userRepositoryService.getUserProfile.calls.reset();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("取得地址選單", () => {
        component.getLocation();
        expect(component.loaction).toEqual(loactionMock);
    });

    it("從ngrx store取得個人資料", fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(component.personalForm.getRawValue()).toEqual({
            userNo: 123456,
            name: "xxxx",
            countyCode: "xxx",
            districtCode: "xxx",
            postalCode: "xxx",
            address: "xxxxx",
            sexCode: "001",
            birthday: "2024-11-12"
        });
    }));

    it("成功送出修改後資料", () => {
        userRepositoryService.putUserProfile.and.returnValue(of({ result: true }));
        component.personalForm.setValue({
            userNo: 123456,
            name: "xxxx",
            countyCode: "xxx",
            districtCode: "xxx",
            postalCode: "xxx",
            address: "xxxxx",
            sexCode: "001",
            birthday: "2024-11-12"
        });
        component.putUserData();
        expect(userRepositoryService.getUserProfile).toHaveBeenCalled();
        expect(sweetAlertService.open).toHaveBeenCalledOnceWith(TextAlertComponent, {
            icon: "success",
            data: {
                text: "修改成功"
            }
        });
    });
    it("失敗送出修改後資料", () => {
        userRepositoryService.putUserProfile.and.returnValue(of({ result: false }));
        component.personalForm.patchValue({
            userNo: 123456,
            name: "xxxx",
            countyCode: "xxx",
            districtCode: "xxx",
            postalCode: "xxx",
            address: "xxxxx",
            sexCode: "001",
            birthday: "2024-11-12"
        });
        component.putUserData();
        expect(userRepositoryService.getUserProfile).not.toHaveBeenCalled();
        expect(sweetAlertService.open).toHaveBeenCalledOnceWith(TextAlertComponent, {
            icon: "error",
            data: {
                text: "修改失敗"
            }
        });
    });

    it("選擇縣市，地區選單資料是否正確", () => {
        component.personalForm.get("countyCode")?.setValue("2");
        fixture.detectChanges();
        expect(component.district).toEqual([
            {
                districtName: "21",
                districtCode: "21",
                postalCode: "21"
            },
            {
                districtName: "22",
                districtCode: "22",
                postalCode: "22"
            }
        ]);
        expect(component.personalForm.get("postalCode")?.value).toBe("");
    });

    it("選擇地區，區號資料是否正確", () => {
        component.personalForm.get("countyCode")?.setValue("2");
        component.personalForm.get("districtCode")?.setValue("22");
        fixture.detectChanges();
        expect(component.personalForm.get("districtCode")?.value).toBe("22");
    });
});
