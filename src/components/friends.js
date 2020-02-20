import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FindPeople from "./findPeople";
import copy from "../axios";
import { friendsInvitations, unfriend, acceptFriendReq } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.friends && state.friends.filter(friend => friend.accepted)
    );
    const invitations = useSelector(
        state =>
            state.friends && state.friends.filter(friend => !friend.accepted)
    );

    useEffect(() => {
        dispatch(friendsInvitations());
    }, []);

    if (!friends && !invitations) {
        return null;
    } else if (friends.length == 0 && invitations.length == 0) {
        return (
            <div>
                <h1>You have no friends in your list yet</h1>
                <Link to="/users">click here to find people</Link>
            </div>
        );
    }

    return (
        <div>
            {friends && <h1>Friends</h1>}
            <div>
                {friends &&
                    friends.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/user/${friend.id}`}>
                                {friend.url && (
                                    <img
                                        src={friend.imageurl}
                                        alt={friend.lastname}
                                    />
                                )}
                                {!friend.url && (
                                    <img
                                        src={friend.imageurl || "/default.png"}
                                        alt={friend.lastname}
                                    />
                                )}
                                <h2>
                                    {friend.firstname} {friend.lastname}
                                </h2>
                            </Link>
                            <button
                                onClick={e => dispatch(unfriend(friend.id))}
                            >
                                {" "}
                                end friendship{" "}
                            </button>
                        </div>
                    ))}
            </div>
            {invitations && <h1>Invitations</h1>}
            <div>
                {invitations &&
                    invitations.map(invit => (
                        <div key={invit.id}>
                            <Link to={`/user/${invit.id}`}>
                                {invit.imageurl && (
                                    <img
                                        src={invit.imageurl}
                                        alt={invit.lastname}
                                    />
                                )}
                                {!invit.imageurl && (
                                    <img
                                        src="/default.png"
                                        alt={invit.lastname}
                                    />
                                )}
                                <h2>
                                    {invit.firstname} {invit.lastname}
                                </h2>
                            </Link>
                            <button
                                onClick={e =>
                                    dispatch(acceptFriendReq(invit.id))
                                }
                            >
                                {" "}
                                accept friend request{" "}
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
