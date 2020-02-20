import React, { useState, useEffect } from "react";
import copy from "../axios";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [findUser, setFindUser] = useState("");

    useEffect(() => {
        let cancel;

        if (findUser == "") {
            (async () => {
                const { data } = await copy.get("/api/getUsers");
                if (!cancel) {
                    setUsers(data);
                }
            })();
        } else {
            (async () => {
                const { data } = await copy.get(
                    "/api/getMatchingUsers/" + findUser
                );
                if (!cancel) {
                    setUsers(data);
                }
            })();
        }

        return () => {
            cancel = true;
        };
    }, [findUser]);

    const onChange = ({ target }) => {
        setFindUser(target.value);
    };

    return (
        <div>
            <h1>Check out the new users</h1>
            {users.map(user => (
                <div key={user.id}>
                    <a href={`/user/${user.id}`}>
                        <img
                            className="bigger-picture"
                            src={user.imageurl || "/default.png"}
                            alt={user.lastname}
                        />
                    </a>
                    <h2>
                        {user.firstname} {user.lastname}
                    </h2>
                </div>
            ))}
            <div>
                <h1>find your friends?</h1>
                <input
                    type="text"
                    onChange={onChange}
                    placeholder="Find Users.."
                />
            </div>
        </div>
    );
}
