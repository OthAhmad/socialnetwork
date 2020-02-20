import React from "react";
import { Link } from "react-router-dom";
import copy from "../axios";

export default class ResetPass extends React.Component {
    constructor(props) {
        super(props);
        // this.submitClick = this.submitClick.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.newPass = this.newPass.bind(this);
        this.state = {
            step: 1
        };
    }

    getCurrentDisplay(step) {
        if (this.state.step == 1) {
            return (
                <div>
                    <input
                        type="text"
                        name="email"
                        placeholder="E-mail"
                        onChange={e => this.handleChange(e)}
                    />
                    <button onClick={() => this.submitClick()}>Send</button>
                </div>
            );
        } else if (this.state.step == 2) {
            return (
                <div>
                    <input
                        type="text"
                        name="code"
                        placeholder="Code"
                        onChange={e => this.handleChange(e)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        onChange={e => this.handleChange(e)}
                    />
                    <button onClick={() => this.newPass()}>Reset</button>
                </div>
            );
        } else if (this.state.step == 3) {
            return (
                <div>
                    <h1>Password successfuly reseted</h1>
                    <Link to="/login">Try to login with new password</Link>
                </div>
            );
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitClick() {
        console.log(this.state.email);
        copy.post("/reset/start", {
            email: this.state.email
        })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 2
                    });
                } else {
                    this.setState({
                        error: true,
                        step: 1
                    });
                }
            })
            .catch(err => console.log("err in POST /reset/start : ", err));
    }

    newPass() {
        console.log(this.state.code);
        copy.post("/reset/verify", {
            code: this.state.code,
            email: this.state.email,
            password: this.state.password
        })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 3
                    });
                } else {
                    this.setState({
                        error: true,
                        step: 1
                    });
                }
            })
            .catch(err => console.log("err in POST /reset/verify : ", err));
    }

    render() {
        return (
            <div id="reset">
                {this.state.error && (
                    <p style={{ color: "red" }}>Something went wrong</p>
                )}
                {this.getCurrentDisplay(this.state.step)}
            </div>
        );
    }
}
