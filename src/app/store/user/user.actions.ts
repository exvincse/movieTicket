import { createAction, props } from "@ngrx/store";

import { SettingDataType, UserDataType } from "./user.state";

export const setSettingData = createAction("[User] Set SettingData", props<{ setting: SettingDataType }>());

export const setUserData = createAction("[User] Set UserData", props<{ userData: UserDataType }>());

export const setUserIsLoginData = createAction("[User] Set UserIsLoginData", props<{ isLogin: boolean }>());

export const clearUserData = createAction("[User] Clear User Data");
