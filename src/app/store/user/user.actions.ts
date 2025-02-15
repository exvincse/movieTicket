import { createAction, props } from "@ngrx/store";

import { UserDataType } from "./user.state";

export const setUserData = createAction("[User] Set UserData", props<{ userData: UserDataType }>());
