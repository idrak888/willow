var initialState = {
    userData: {},
    posts: [],
    myPosts: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'UPDATE_USER_DATA':
            return {
                ...state,
                userData: action.updatedUser
            }
        case 'UPDATE_POSTS':
            return {
                ...state,
                posts: action.posts
            }
        case 'UPDATE_MY_POSTS':
            return {
                ...state,
                myPosts: action.myPosts
            }
        case 'EMPTY_ALL':
            return {
                ...state,
                userData: {},
                post: [],
                myPosts: []
            }
        default: 
            return state;
    }
}