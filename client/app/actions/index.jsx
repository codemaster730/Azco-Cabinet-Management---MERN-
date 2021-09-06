export const isLogin = param => ({
    type: 'IS_LOGGED_IN',
    isLoggedIn: param.isLoggedIn,
    role: param.role
});
