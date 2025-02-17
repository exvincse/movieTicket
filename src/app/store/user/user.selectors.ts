import { createFeatureSelector, createSelector } from "@ngrx/store";

import { UserState } from "./user.state";

export const selectUserState = createFeatureSelector<UserState>("user");

export const selectUserData = createSelector(selectUserState, (state) => state.userData);

export const selectUserIsLoginData = createSelector(selectUserState, (state) => state.isLogin);
