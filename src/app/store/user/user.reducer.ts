import { createReducer, on } from "@ngrx/store";

import * as UserActions from "./user.actions";
import { initUserData } from "./user.state";

export const userReducer = createReducer(
    initUserData,
    on(UserActions.setUserData, (state, { userData }) => ({ ...state, userData }))
);
