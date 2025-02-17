import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";

import { UserStoreService } from "../../store/user/service/user-store.service";

/**
 * Functional Auth Guard
 * @returns A boolean indicating whether the user is authenticated or a UrlTree to redirect the user.
 */
export const authGuard: CanActivateChildFn = async () => {
    const router = inject(Router);
    const userStoreService = inject(UserStoreService);
    const res = await lastValueFrom(userStoreService.getUserIsLogin());
    if (res === true) {
        return true;
    }

    return router.createUrlTree(["/"]);
};
