export const UserUrl = {
    // 確認是否有登入
    getIsCheckLogin: "User/GetIsCheckLogin",
    // 登入
    postLogin: "User/Login",
    // 登出
    postLogout: "User/Logout",
    // 換發token
    getReFreshToken: "User/ReFreshToken",
    // 取得個人資料
    getUserProfile: "User/GetUserProfile",
    // 註冊帳號
    postSendMail: "User/PostSendMail",
    // 註冊帳號發送信件
    postRegister: "User/PostRegister",
    // 驗證OTP
    postValidOtp: "User/PostValidOtp",
    // 驗證Email
    postValidEmail: "User/PostValidEmail",
    // 取得otp Email
    getOtpEmail: "User/GetOtpEmail",
    // 取得縣市
    getLocation: "User/GetLocation",
    // 修改個人資料
    putUserProfile: "User/PutUserProfile",
    // 修改密碼
    putResetPassword: "User/PutResetPassword",
};
