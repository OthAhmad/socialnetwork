import React from "react";
import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <h1>
                    {this.props.first} {this.props.last}
                </h1>
                <ProfilePic
                    clickHandler={this.props.clickHandler}
                    first={this.props.first}
                    last={this.props.last}
                    imageUrl={this.props.imageUrl}
                    type="bigger-picture"
                />
                <div>
                    <BioEditor
                        bio={this.props.bio}
                        id={this.props.id}
                        setBio={this.props.setBio}
                    />
                </div>
            </div>
        );
    }
}
