import { createAction, props } from "@ngrx/store";

import { UserDataType } from "./user.state";

export const setUserData = createAction("[User] Set UserData", props<{ userData: UserDataType }>());

export const setUserIsLoginData = createAction("[User] Set UserIsLoginData", props<{ isLogin: boolean }>());

export const clearUserData = createAction("[User] Clear User Data");
