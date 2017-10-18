/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";

import Navbar from "./Navbar.jsx";
import VideoSelectionCard from "./VideoSelectionCard.jsx";
import VideoUploadCard from "./VideoUploadCard.jsx";

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.selectClick = this.selectClick.bind(this);
        this.changeClick = this.changeClick.bind(this);
        this.postData = this.postData.bind(this);
        this.submitData = this.submitData.bind(this);
        this.state = {selected: false, firstClick: true, form_data: null};
    }

    postData() {
        $.ajax({
            url: "http://localhost:8000/api/upload",
            method: "POST",
            processData: false,
            contentType: false,
            dataType: "json",
            data: this.state.form_data
        });
    }

    selectClick(e) {
        let filename = $("#videoUpload").val();
        if (filename) {
            let fd = new FormData();
            fd.append("video", $("#videoUpload")[0].files[0]);

            this.setState({selected: true, form_data: fd});
            e.preventDefault();
        }
    }

    changeClick() {
        let filename = $("#videoUpload").val();
        if (filename)
            this.setState({firstClick: false});
    }

    submitData() {
        let fd = this.state.form_data;
        let title = $("#video_title").val();
        let desc = $("#video_desc").val();
        let thumbnail = $("#thumbnailUpload")[0].files[0];
        let token = localStorage.getItem("token");

        fd.append("title", title);
        fd.append("desc", desc);
        fd.append("thumbnail", thumbnail);
        fd.append("token", token);

        this.setState({form_data: fd});
        this.postData();
    }

    render() {
        let card;
        if (this.state.selected)
            card = <VideoUploadCard submit={this.submitData} />;
        else
            card = <VideoSelectionCard
                text={this.state.firstClick ? "Click here to upload a video" : "File selected. Click to continue."}
                changeClick={this.changeClick}
                selectClick={this.selectClick} />;
        return (
            <div>
                <Navbar dp="https://d1wn0q81ehzw6k.cloudfront.net/additional/thul/media/0eaa14d11e8930f5?w=400&h=400" />
                {card}
            </div>
        );
    }
}

export default Upload;