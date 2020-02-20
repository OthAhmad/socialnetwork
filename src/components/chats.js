import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chats() {
    const chatMessages = useSelector(state => state && state.message);
    const keyEnter = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("chatMessage", e.target.value);
            e.target.value = "";
        }
    };

    const elem = useRef();

    useEffect(() => {
        let { clientHeight, scrollHeight } = elem.current;
        elem.current.scrollTop = scrollHeight - clientHeight;
    }, [chatMessages]);

    console.log(chatMessages);
    return (
        <div className="chat">
            <h1>Chats</h1>
            <div className="chat-container" ref={elem}>
                {chatMessages &&
                    chatMessages.map(msg => (
                        <div className="message" key={msg.id}>
                            <img
                                src={msg.imageurl || "/default.png"}
                                alt={msg.firstname}
                            />
                            <p>
                                {msg.firstname} {msg.lastname}:
                            </p>
                            <p>{msg.message}</p>
                        </div>
                    ))}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyEnter}
            ></textarea>
        </div>
    );
}
