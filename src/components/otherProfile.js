import React from "react";
import copy from "../axios";
import FriendBtn from "./friendBtn";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        copy.get("/api/user/" + this.props.match.params.id)
            .then(res => {
                if (this.props.match.params.id == res.data.loggedUser) {
                    this.props.history.push("/");
                } else if (res.data.data == null) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        firstname: res.data.data.firstname,
                        lastname: res.data.data.lastname,
                        bio: res.data.data.bio,
                        imageurl: res.data.data.imageurl,
                        id: this.props.match.params.id
                    });
                }
            })
            .catch(err => console.log("error ", err));
    }
    render() {
        if (this.state.imageurl) {
            return (
                <div>
                    <div>
                        <img
                            src={this.state.imageurl}
                            className="bigger-picture"
                        />
                    </div>
                    <h1>
                        {this.state.firstname} {this.state.lastname}
                    </h1>
                    <h2>{this.state.bio}</h2>
                    <FriendBtn currentId={this.state.id} />
                </div>
            );
        } else {
            return (
                <div>
                    <div>
                        <img src="/default.png" />
                    </div>
                    <h1>
                        {this.state.firstname} {this.state.lastname}
                    </h1>
                    <h2>{this.state.bio}</h2>
                    <FriendBtn currentId={this.state.id} />
                </div>
            );
        }
    }
}
