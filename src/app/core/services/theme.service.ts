// import { Injectable } from '@angular/core';
// import { THEME, ThemeSettings } from '@config/theme.settings';
// import { BehaviorSubject, Observable } from 'rxjs';

// /**
//  * ThemeService
//  * 管理全站 css 樣式切換
//  * 僅於 Aplus 開發階段使用
//  */
// @Injectable({
//     providedIn: 'root'
// })
// export class ThemeService {

//     private theme: THEME = THEME.AC;
//     private themeLinks?: HTMLLinkElement[];
//     private themeSubject = new BehaviorSubject(this.theme);

//     /**
//      * Gets theme
//      * @returns Observable<THEME>;
//      */
//     get(): Observable<THEME> {
//         return this.themeSubject.asObservable();
//     }

//     /**
//      * Sets theme
//      * @param nextTheme theme
//      */
//     set(nextTheme: THEME) {
//         if (nextTheme === this.theme) {
//             return;
//         }

//         const themeConfig = ThemeSettings[this.theme];
//         const newThemeConfig = ThemeSettings[nextTheme];

//         // control flag
//         $('body').removeClass(themeConfig.flag);
//         $('body').addClass(newThemeConfig.flag);

//         // load css file
//         if (this.themeLinks) {
//             this.themeLinks.forEach(link => {
//                 $(link).remove();
//             });
//         }

//         if (newThemeConfig.globalStyles) {
//             this.themeLinks = [];

//             newThemeConfig.globalStyles.forEach(url => {
//                 const link = document.createElement('link');
//                 link.rel = 'stylesheet';
//                 link.href = url;

//                 $('head').append(link);
//                 this.themeLinks.push(link);
//             });
//         }

//         this.theme = nextTheme;
//         this.themeSubject.next(nextTheme);
//     }
// }
