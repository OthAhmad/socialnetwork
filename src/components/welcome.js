import React from "react";
import Register from "./register";
import Login from "./login";
import ResetPass from "./resetPass";
import { HashRouter, Route } from "react-router-dom";

export default class Welcome extends React.Component {
    render() {
        return (
            <div>
                <img className="welcome-logo" src="/who_logo.png" />
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <Route path="/reset" component={ResetPass} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
