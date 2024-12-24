// import { Injectable } from "@angular/core";
// import {
//     ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree
// } from "@angular/router";
// import { UserService } from "@core/services/user.service";
// import { Observable } from "rxjs";

// /**
//  * AuthGuard
//  * 僅於 Aplus 開發階段使用
//  */
// @Injectable({
//     providedIn: "root"
// })
// export class AuthGuard implements CanActivateChild {
//     /**
//      * Creates an instance of auth guard.
//      * @param user UserService
//      */
//     constructor(private user: UserService) { }

//     /**
//      * Determines whether activate child can
//      * @param next ActivatedRouteSnapshot
//      * @param state RouterStateSnapshot
//      * @returns activate child
//      */
//     canActivateChild(
//         next: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot
//     ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//         return this.user.checkLogin();
//     }
// }
