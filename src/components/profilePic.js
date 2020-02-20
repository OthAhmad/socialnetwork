import React from "react";

export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const pic = this.props.type || "profile-pic";
        if (this.props.imageUrl) {
            return (
                <div>
                    <img
                        className={pic}
                        src={this.props.imageUrl}
                        alt="profile"
                        onClick={() => this.props.clickHandler()}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    <img
                        className={pic}
                        src="/default.png"
                        alt="default"
                        onClick={() => this.props.clickHandler()}
                    />
                </div>
            );
        }
    }
}
