import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import {
    distinctUntilChanged,
    map, of, switchMap, take
} from "rxjs";

import { UserStoreService } from "../../store/user/service/user-store.service";

/**
 * 確認使用者是否登入
 * @returns 使用者是否登入
 */
export const CheckLoginAuthGuard: CanActivateChildFn = () => {
    const router = inject(Router);
    const userStoreService = inject(UserStoreService);
    const sweetAlertService = inject(SweetAlertService);

    return userStoreService.getUserIsLogin().pipe(
        distinctUntilChanged(),
        switchMap((isLogin) => {
            if (isLogin === true) {
                return of(true);
            }

            const ref = sweetAlertService.open(TextAlertComponent, {
                icon: "error",
                data: {
                    text: "登入已逾時，請重新登入"
                }
            });

            return ref.instance.afterClose.pipe(
                map(() => router.createUrlTree(["/"]))
            );
        }),
        take(1)
    );
};
