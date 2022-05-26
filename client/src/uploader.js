import { Component } from "react";
import { Link } from "react-router-dom";

export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    componentDidMount() {
        console.log("Pw-Reset just mounted");
    }

    handleChange(evt) {
        console.log("user is typing in the input field :)");

        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }

    uploadFile(e) {
        console.log("file selected: ", e.target.files[0]);

        const fd = new FormData();
        fd.append("file", e.target.files[0]);

        fetch("/upload", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((response) => {
                console.log("response: ", response);
            })
            .catch((err) => {
                console.log("error submitting form fields: ", err);
            });
    }

    render() {
        return (
            <div className="absCenter">
                <input
                    onChange={this.uploadFile}
                    type="file"
                    name="file"
                    accept="image/*"
                />
            </div>
        );
    }
}
