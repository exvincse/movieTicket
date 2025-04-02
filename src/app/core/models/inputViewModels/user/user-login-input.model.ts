// 登入帳號密碼
export interface UserLoginInputModel {
    email: string;
    password: string;
}

type Replace<T, K extends keyof T, V extends string, Z> = Omit<T, K> & { [P in V]: Z };

export type UserValidOtpInputModel = Replace<UserLoginInputModel, "password", "otp", string>;

export type UserValidEmailInputModel = Omit<UserLoginInputModel, "password">;
