import React from "react";
import copy from "../axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { file: null };
    }
    changeHandler(e) {
        console.log(e.target);
        this.setState({ file: e.target.files[0] });
    }
    upload() {
        let formData = new FormData();
        formData.append("file", this.state.file);

        copy.post("/upload", formData).then(({ data }) => {
            console.log(data);
            this.props.setImageUrl(data[0].imageUrl);
        });
    }
    render() {
        return (
            <div className="modal">
                <div className="modal-content">
                    <h1>Upload an Image</h1>
                    <p
                        className="close"
                        onClick={() => this.props.closePopUp()}
                    >
                        X
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={e => this.changeHandler(e)}
                    />
                    <button onClick={() => this.upload()}>UPLOAD</button>
                </div>
            </div>
        );
    }
}
