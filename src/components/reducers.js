export default function reducer(state = {}, action) {
    if (action.type === "FRIENDS_INVITATIONS") {
        state = {
            ...state,
            friends: action.friends
        };
    }
    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        accepted: true
                    };
                }
                return friend;
            })
        };
    }
    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friends: state.friends.filter(friend => friend.id != action.id)
        };
    }
    if (action.type === "GET_LAST_MESSAGES") {
        state = {
            message: action.message
        };
    }
    if (action.type === "INSERT_MESSAGE") {
        state = {
            ...state,
            message: state.message.concat(action.data)
        };
    }
    return state;
}
