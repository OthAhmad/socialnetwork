import React from "react";
import copy from "../axios";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import { BrowserRouter, Route } from "react-router-dom";
import Chats from "./chats";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        copy.get("/user").then(({ data }) => {
            console.log(data);
            this.setState(data);
        });
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <img className="sm-logo" src="/who_logo.png" />
                        <ProfilePic
                            clickHandler={() =>
                                this.setState({ uploaderIsVisible: true })
                            }
                            imageUrl={this.state.imageurl}
                            first={this.state.firstname}
                            last={this.state.lastname}
                        />
                        <div className="links">
                            <a href="/">Profile</a>
                            <a href="/users">Find People</a>
                            <a href="/friends">Friends</a>
                            <a href="/chats">Chats</a>
                            <a href="/logout">Logout</a>
                        </div>
                        <Route
                            exact
                            path="/"
                            render={props => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.firstname}
                                    last={this.state.lastname}
                                    imageUrl={this.state.imageurl}
                                    clickHandler={() =>
                                        this.setState({
                                            uploaderIsVisible: true
                                        })
                                    }
                                    bio={this.state.bio}
                                    setBio={bio => this.setState({ bio })}
                                />
                            )}
                        />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route exact path="/friends" component={Friends} />
                        <Route exact path="/chats" component={Chats} />
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                setImageUrl={imageUrl =>
                                    this.setState({ imageUrl })
                                }
                                closePopUp={() =>
                                    this.setState({ uploaderIsVisible: false })
                                }
                            />
                        )}
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
