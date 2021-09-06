const initialState = {
    isShowPlusFilterOfBlogs: false,
    isShowPlusFilterOfVideos: false,
    isShowPlusFilterOfImages: false,
    isShowPlusFilterOfProducts: false,
    isShowPlusFilterOfDashboard: false
}

const events = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_PLUSFILTER':
            if(action.isShowPlusFilter === 'videos') {
                return Object.assign({}, state, {
                    isShowPlusFilterOfVideos: !state.isShowPlusFilterOfVideos
                });
            }
            if(action.isShowPlusFilter === 'products') {
                return Object.assign({}, state, {
                    isShowPlusFilterOfProducts: !state.isShowPlusFilterOfProducts
                });
            }
            if(action.isShowPlusFilter === 'blogs') {
                return Object.assign({}, state, {
                    isShowPlusFilterOfBlogs: !state.isShowPlusFilterOfBlogs
                });
            }
            if(action.isShowPlusFilter === 'images') {
                return Object.assign({}, state, {
                    isShowPlusFilterOfImages: !state.isShowPlusFilterOfImages
                });
            }
            if(action.isShowPlusFilter === '') {
                return Object.assign({}, state, {
                    isShowPlusFilterOfDashboard: !state.isShowPlusFilterOfDashboard
                });
            }
            break;
        default:
            return state
    }
}

export default events;