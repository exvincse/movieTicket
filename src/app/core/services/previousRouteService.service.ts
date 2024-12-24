// import { Injectable } from "@angular/core";
// import {
//     ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterEvent
// } from "@angular/router";
// import { BehaviorSubject, Observable } from "rxjs";
// import { filter, map } from "rxjs/operators";

// /**
//  * 紀錄上一頁路由網址
//  */
// @Injectable({
//     providedIn: "root"
// })
// export class PreviousRouteService {
//     public previousUrl: BehaviorSubject<string>;
//     public previousName: BehaviorSubject<string>;

//     private currentUrl = "/policy/search-ac/";
//     private currentName = "回保單查詢";

//     /**
//      * Creates an instance of Previous Route
//      * @param router Router
//      * @param route ActivatedRoute
//      */
//     constructor(private router: Router, private route: ActivatedRoute) {
//         this.previousUrl = new BehaviorSubject("/policy/search-ac/");
//         this.currentUrl = "/policy/search-ac/";

//         this.previousName = new BehaviorSubject("回保單查詢");

//         this.router.events
//             .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
//             .subscribe((event: NavigationEnd) => {
//                 this.previousUrl.next(this.currentUrl);
//                 this.currentUrl = event.urlAfterRedirects;
//             });

//         this.router.events
//             .pipe(
//                 filter((event) => event instanceof NavigationEnd),
//                 map(() => this.route.snapshot),
//                 map((route) => {
//                     while (route.firstChild) {
//                         route = route.firstChild;
//                     }
//                     return route;
//                 })
//             )
//             .subscribe((event: ActivatedRouteSnapshot) => {
//                 this.previousName.next(this.currentName);
//                 if (event.data.funcName) {
//                     this.currentName = `回${event.data.funcName}`;
//                 } else {
//                     this.currentName = null;
//                 }
//             });
//     }

//     /**
//      * 取得上一頁Url
//      * @returns previousUrl url路徑
//      */
//     getPreviousUrl(): Observable<string> {
//         return this.previousUrl.asObservable();
//     }
// }
