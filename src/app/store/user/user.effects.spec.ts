// user.effects.spec.ts
import { TestBed } from "@angular/core/testing";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { Observable, of } from "rxjs";

import { setUserIsLoginData } from "./user.actions";
import { UserEffects } from "./user.effects";

describe("UserEffects", () => {
    let actions$: Observable<any>;
    let effects: UserEffects;
    const userRepositoryServiceMock = jasmine.createSpyObj("UserRepositoryService", ["getUserProfile"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserEffects,
                provideMockActions(() => actions$),
                provideMockStore(),
                {
                    provide: UserRepositoryService,
                    useValue: userRepositoryServiceMock
                }
            ]
        });

        effects = TestBed.inject(UserEffects);
    });

    it("觸發setUserIsLoginData為true Action取得個人資料", () => {
        const action = setUserIsLoginData({ isLogin: true });

        actions$ = of(action);

        effects.setUserIsLoginData$.subscribe();

        expect(userRepositoryServiceMock.getUserProfile).toHaveBeenCalled();
    });

    it("觸發setUserIsLoginData為false Action不取得個人資料", () => {
        const action = setUserIsLoginData({ isLogin: false });

        actions$ = of(action);

        effects.setUserIsLoginData$.subscribe();

        expect(userRepositoryServiceMock.getUserProfile).not.toHaveBeenCalled();
    });
});
