import { inject, Injectable } from "@angular/core";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";

import { setUserIsLoginData } from "./user.actions";

/**
 * UserEffects
 */
@Injectable()
export class UserEffects {
    private actions$ = inject(Actions);
    private userRepositoryService = inject(UserRepositoryService);

    setUserIsLoginData$ = createEffect(() => this.actions$.pipe(
        ofType(setUserIsLoginData),
        tap((res) => {
            if (res.isLogin === true) {
                this.userRepositoryService.getUserProfile();
            }
        })
    ), { dispatch: false });
}
