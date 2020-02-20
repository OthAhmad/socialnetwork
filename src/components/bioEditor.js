import React from "react";
import copy from "../axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: props.bio
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submitClick() {
        copy.post("/edit-bio", {
            id: this.props.id,
            bio: this.state.bio
        })
            .then(({ data }) => {
                this.props.setBio(data.bio);
                this.setState({
                    bio: data.bio,
                    editorIsVisible: false,
                    error: false
                });
            })
            .catch(() =>
                this.setState({
                    error: true
                })
            );
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <p className="error" style={{ color: "red" }}>
                        Ops! Something went wrong. Try again!
                    </p>
                )}
                {this.state.bio && !this.state.editorIsVisible && (
                    <div>
                        <h1>Bio</h1>
                        <h2 id="bio-content">{this.props.bio}</h2>
                        <button
                            onClick={() =>
                                this.setState({
                                    editorIsVisible: true
                                })
                            }
                        >
                            edit
                        </button>
                    </div>
                )}
                {this.state.editorIsVisible && (
                    <div>
                        <h2>Tell us more about yourself</h2>
                        <textarea
                            name="bio"
                            id="bio-text"
                            rows="10"
                            cols="50"
                            value={this.state.bio}
                            onChange={e => this.handleChange(e)}
                        />
                        <button
                            className="signup-btn"
                            onClick={() => this.submitClick()}
                        >
                            save
                        </button>
                    </div>
                )}
                {!this.state.bio && !this.state.editorIsVisible && (
                    <div>
                        <button
                            className="signup-btn"
                            onClick={() =>
                                this.setState({
                                    editorIsVisible: true
                                })
                            }
                        >
                            add bio
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
