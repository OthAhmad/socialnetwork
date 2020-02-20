import React, { useState, useEffect } from "react";
import copy from "../axios";

export default function FriendBtn(props) {
    const [textBtn, setTextBtn] = useState("");
    useEffect(() => {
        try {
            (async () => {
                if (props.currentId) {
                    const { data } = await copy.get(
                        "/friends-status/" + props.currentId
                    );
                    if (data.length == 0) {
                        setTextBtn("send friend request");
                    } else if (data.accepted == false) {
                        if (data.sender_id == props.currentId) {
                            setTextBtn("accept friend request");
                        } else if (data.recipient_id == props.currentId) {
                            setTextBtn("cancel friend request");
                        }
                    } else if (data.accepted == true) {
                        setTextBtn("end friendship");
                    }
                }
            })();
        } catch (err) {
            console.log("err in mounting: ", err);
        }
    });

    const handleClick = () => {
        if (textBtn == "send friend request") {
            try {
                (async () => {
                    const { data } = await copy.post(
                        "/make-friend-req/" + props.currentId
                    );
                    if (data.success) {
                        setTextBtn("cancel friend request");
                    }
                })();
            } catch (err) {
                console.log("err in /makeFriendRequest: ", err);
            }
        } else if (textBtn == "accept friend request") {
            try {
                (async () => {
                    const { data } = await copy.post(
                        "/accept-friend-request/" + props.currentId
                    );
                    if (data.success) {
                        setTextBtn("end friendship");
                    }
                })();
            } catch (err) {
                console.log("error in /accept friend request: ", err);
            }
        } else if (
            textBtn == "cancel friend request" ||
            textBtn == "end friendship"
        ) {
            (async () => {
                try {
                    (async () => {
                        const { data } = await copy.post(
                            "/end-friendship/" + props.currentId
                        );
                        if (data.success) {
                            setTextBtn("send friend request");
                        }
                    })();
                } catch (err) {
                    console.log("error in /end-friendship: ", err);
                }
            })();
        }
    };

    return (
        <div>
            <button onClick={handleClick}>{textBtn}</button>
        </div>
    );
}
