const initialState = {
    isLoggedIn: false,
    role: 'user'
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case 'IS_LOGGED_IN':
            return Object.assign({}, state, {
                isLoggedIn: action.isLoggedIn,
                role: action.role
            });
            break;
        default:
            return state
    }
}

export default auth;