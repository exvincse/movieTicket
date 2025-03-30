import { EnvironmentInjector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
    ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree
} from "@angular/router";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { Observable, of } from "rxjs";

import { UserStoreService } from "../../store/user/service/user-store.service";
import { CheckLoginAuthGuard } from "./check-login.auth.guard";

describe("CheckLoginAuthGuard", () => {
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["getUserIsLogin"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const router = jasmine.createSpyObj("Router", ["createUrlTree"]);

    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: UserStoreService, useValue: userStoreService },
                { provide: SweetAlertService, useValue: sweetAlertService },
                { provide: Router, useValue: router }
            ]
        });
    });

    beforeEach(() => {
        sweetAlertService.open.calls.reset();
        userStoreService.getUserIsLogin.calls.reset();
    });

    it("使用者已登入", () => {
        userStoreService.getUserIsLogin.and.returnValue(of(true));

        const injector = TestBed.inject(EnvironmentInjector);
        const guardResult = runInInjectionContext(injector, () => CheckLoginAuthGuard(route, state)) as Observable<boolean | UrlTree>;

        guardResult.subscribe((value) => {
            expect(value).toBe(true);
            expect(sweetAlertService.open).not.toHaveBeenCalled();
        });
    });

    it("使用者未登入", async () => {
        userStoreService.getUserIsLogin.and.returnValue(of(false));

        const injector = TestBed.inject(EnvironmentInjector);
        const guardResult = runInInjectionContext(injector, () => CheckLoginAuthGuard(route, state)) as Observable<boolean | UrlTree>;

        guardResult.subscribe((value) => {
            expect(value).toEqual(router.createUrlTree(["/"]));
            expect(sweetAlertService.open).toHaveBeenCalled();
        });
    });
});
