import {
    ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { ActivatedRoute, provideRouter, Router } from "@angular/router";
import { TmdbRepositoryService } from "@app/core/api/middleware/tmdb/tmdb-repository.service";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of, Subject } from "rxjs";

import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let routerEvents$: Subject<any>;
    let router: Router;
    const sweetAlertMock = {
        instance: {
            afterClose: new Subject<boolean>()
        }
    };
    const tmdbRepositoryService = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieGenre"]);
    const userRepositoryService = jasmine.createSpyObj("UserRepositoryService", ["getUserProfile", "postLogout"]);
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["getUserData", "getUserIsLogin", "setClearUserData"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    tmdbRepositoryService.getMovieGenre.and.returnValue(of({ genres: [] }));
    userStoreService.getUserIsLogin.and.returnValue(of(true));
    userRepositoryService.postLogout.and.returnValue(of(null));
    beforeEach(async () => {
        routerEvents$ = new Subject();
        const routerMock = {
            createUrlTree: jasmine.createSpy("createUrlTree").and.returnValue({}),
            navigate: jasmine.createSpy("navigate"),
            events: routerEvents$.asObservable(),
            serializeUrl: jasmine.createSpy("serializeUrl").and.returnValue(""),
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                { provide: UserRepositoryService, useValue: userRepositoryService },
                { provide: TmdbRepositoryService, useValue: tmdbRepositoryService },
                { provide: UserStoreService, useValue: userStoreService },
                { provide: SweetAlertService, useValue: sweetAlertService },
                provideRouter([]),
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: { snapshot: { root: {} } } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    beforeEach(() => {
        sweetAlertService.open.and.returnValue(sweetAlertMock);
        tmdbRepositoryService.getMovieGenre.calls.reset();
        userRepositoryService.getUserProfile.calls.reset();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("登出", fakeAsync(() => {
        const spy = spyOn(component, "defaultMenu");
        component.postLogout();
        tick();
        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "success",
            data: {
                text: "已登出"
            }
        });

        sweetAlertService.open.calls.mostRecent().returnValue.instance.afterClose.next(true);

        expect(spy).toHaveBeenCalled();

        expect(userStoreService.setClearUserData).toHaveBeenCalled();

        expect(router.navigate).toHaveBeenCalled();
    }));
});
