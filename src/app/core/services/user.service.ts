// import { delay, map, tap } from 'rxjs/operators';
// import { AC_ROLE, BR_ROLE, FID_ROLE, ROLE } from './../enums/role.enum';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { BusinessTheme } from '@config/theme.settings';
// import { AgentProfile, UserInfoEntity } from '@entities/common/user-info-entity';
// import { ThemeService } from './theme.service';

// import { UserInfoMock } from '@mocks/common/user-info-mock';

// /**
//  * Identity strategy
//  */
// class Identity {
//     role: AC_ROLE | BR_ROLE | FID_ROLE;

//     /**
//      * Creates an instance of identity strategy.
//      * @param business business
//      * @param role role
//      */
//     constructor (public business: 'AC' | 'BR' | 'FID', role: string) {
//         if (business === 'BR') {
//             this.role = getBrFuncCode(role);
//         } else if (business === 'AC') {
//             this.role = AC_ROLE.AGENT;
//         } else if (business === 'FID') {
//             this.role = FID_ROLE.AGENT;
//         }
//     }

//     /**
//      * Verifys identity
//      * @param business business
//      * @param [role] role
//      * @returns true if verify
//      */
//     verify(business: 'AC' | 'BR' | 'FID', role?: AC_ROLE | BR_ROLE | FID_ROLE | (AC_ROLE | BR_ROLE | FID_ROLE)[]): boolean {
//         if (business === this.business) {
//             if (typeof role === 'object') {
//                 return !!role.find(r => r === this.role);
//             } else if (role !== undefined) {
//                 return this.role === role;
//             } else {
//                 return true;
//             }
//         } else {
//             return false;
//         }
//     }
// }

// /**
//  * UserService
//  * 僅於 Aplus 開發階段使用
//  */
// @Injectable({
//     providedIn: 'root'
// })
// export class UserService {

//     profile$: Observable<UserInfoEntity['data']['agentProfile']>
//         = of(UserInfoMock.data.agentProfile);

//     identity$: Observable<Identity>
//         = of(UserInfoMock.data.agentProfile).pipe(map(profile => new Identity(profile.businesCode as 'AC' | 'BR' | 'FID', profile.role)));

//     private isLogin = false;

//     /**
//      * Creates an instance of user service.
//      * @param theme ThemeService
//      */
//     constructor (private theme: ThemeService) { }

//     /**
//      * Checks login
//      * @returns isLogin
//      */
//     checkLogin() {
//         return of(true).pipe(delay(30), tap(isLogin => {
//             this.isLogin = isLogin;
//             this.theme.set(BusinessTheme[UserInfoMock.data.agentProfile.businesCode]);
//         }));
//     }

//     /**
//      * Gets business code$
//      * @deprecated
//      * @returns business code$
//      */
//     getBusinessCode$(): Observable<string> {
//         return of(UserInfoMock.data.agentProfile.businesCode);
//     }

//     /**
//      * Gets br role
//      * @deprecated
//      * @returns brRole
//      */
//     getFuncRole$(): Observable<ROLE> {
//         if (UserInfoMock.data.agentProfile.businesCode === 'AC') {
//             return of(ROLE.AC);
//         }

//         if (UserInfoMock.data.agentProfile.businesCode === 'FID') {
//             return of(ROLE.FID);
//         }

//         switch (UserInfoMock.data.agentProfile.role) {
//             case 'BRAgent':
//                 return of(ROLE.BR_AGENT);
//             case 'BRComp':
//                 return of(ROLE.BR_WINDOW);
//             case 'BRLeader':
//                 return of(ROLE.BR_WINDOW);
//             case 'BRStaff':
//                 return of(ROLE.BR_STAFF);
//             case 'SPABR':
//                 return of(ROLE.BR_ADMIN);
//         }
//     }

//     /**
//      * Gets agent profile$
//      * @returns agent profile$
//      */
//     getUserProfile$(): Observable<AgentProfile> {
//         return of(UserInfoMock.data.agentProfile);
//     }
// }

// /**
//  * Gets br func code
//  * @param role role
//  * @returns br func code
//  */
// function getBrFuncCode(role: string | number): BR_ROLE | null {
//     switch (role) {
//         case 'BRAgent':
//             return BR_ROLE.AGENT;
//         case 'BRComp':
//             return BR_ROLE.WINDOW;
//         case 'BRLeader':
//             return BR_ROLE.WINDOW;
//         case 'BRStaff':
//             return BR_ROLE.STAFF;
//         case 'SPABR':
//             return BR_ROLE.ADMIN;
//         default:
//             return null;
//     }
// }
