import copy from "../axios";

export async function friendsInvitations() {
    const { data } = await copy.get("/friends-invitations");
    return {
        type: "FRIENDS_INVITATIONS",
        friends: data
    };
}

export async function acceptFriendReq(id) {
    await copy.post("/accept-friend-req/" + id);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function unfriend(id) {
    await copy.post("/end-friendship/" + id);
    return {
        type: "UNFRIEND",
        id
    };
}

export function chatMessages(message) {
    return {
        type: "GET_LAST_MESSAGES",
        message
    };
}

export function chatMessage(data) {
    return {
        type: "INSERT_MESSAGE",
        data
    };
}
