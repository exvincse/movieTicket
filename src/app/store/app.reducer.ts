import { ActionReducerMap } from "@ngrx/store";

import { AppState } from "./app.state";
import { userReducer } from "./user/user.reducer";

export const appReducer: ActionReducerMap<AppState> = {
    user: userReducer
};
