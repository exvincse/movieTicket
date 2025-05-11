export const UserUrl = {
    // 確認是否有登入
    getIsLogin: "User/IsLogin",
    // 登入
    postLogin: "User/Login",
    // google登入
    postGoogleLogin: "User/GoogleLogin",
    // 登出
    postLogout: "User/Logout",
    // 換發token
    getReFreshToken: "User/ReFreshToken",
    // 取得個人資料
    getUserProfile: "User/UserProfile",
    // 修改個人資料
    putUserProfile: "User/UserProfile",
    // 註冊帳號發送信件
    postSendMail: "User/SendMail",
    // 註冊帳號
    postRegisterAccount: "User/RegisterAccount",
    // 驗證OTP
    postValidOtp: "User/ValidOtp",
    // 驗證Email
    postValidEmail: "User/ValidEmail",
    // 取得縣市
    getLocation: "User/Location",
    // 修改密碼
    putResetPassword: "User/ResetPassword",
};
