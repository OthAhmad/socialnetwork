import React from "react";
import { Link } from "react-router-dom";
import copy from "../axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
        this.submitClick = this.submitClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this[e.target.name] = e.target.value;
    }

    submitClick() {
        if (!this.email || !this.password) {
            this.setState({ error: true });
        }
        copy.post("/login", {
            email: this.email,
            password: this.password
        })
            .then(data => {
                console.log(data);
                if (data.data.success) {
                    location.replace("/");
                } else {
                    this.setState({ error: true });
                }
            })
            .catch(err =>
                console.log("Error in new user axios login req", err)
            );
    }

    render() {
        return (
            <div>
                {this.state.error && (
                    <p style={{ color: "red" }}>Something went wrong</p>
                )}
                <div className="signup-form">
                    <input
                        type="text"
                        name="email"
                        onChange={e => this.handleChange(e)}
                        placeholder="E-mail"
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={e => this.handleChange(e)}
                        placeholder="Password"
                    />
                    <button
                        className="signup-btn"
                        onClick={() => this.submitClick()}
                    >
                        Log in
                    </button>
                    <p>
                        You don't have account?
                        <Link to="/">Register</Link>
                    </p>
                    <Link to="/reset/start">
                        Forgot your password? Click here.
                    </Link>
                </div>
            </div>
        );
    }
}
