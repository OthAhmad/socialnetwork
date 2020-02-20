import React from "react";
import { Link } from "react-router-dom";
import copy from "../axios.js";

export default class Register extends React.Component {
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
        if (
            !this.firstname ||
            !this.lastname ||
            !this.email ||
            !this.password
        ) {
            this.setState({ error: true });
        }
        copy.post("/register", {
            firstname: this.firstname,
            lastname: this.lastname,
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
            .catch(err => console.log("Error in new user axios req", err));
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
                        name="firstname"
                        onChange={e => this.handleChange(e)}
                        placeholder="First name"
                    />
                    <input
                        type="text"
                        name="lastname"
                        onChange={e => this.handleChange(e)}
                        placeholder="Last name"
                    />
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
                        SIGN UP
                    </button>
                    <p>
                        Alredy a member?<Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        );
    }
}
