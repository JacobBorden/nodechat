import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import io from 'socket.io-client'

/********************************************************************************************************/

var CommentBox = React.createClass({

    getInitialState: function () {
        return { data: [] };
    },

    handleCommentSubmit: function (comment) {
        this.setState({ data: [comment, ...this.state.data] });
        this.socket.emit('message', comment);
    },

    componentDidMount: function (data) {
        this.socket = io.connect();
        var self = this;
        this.socket.on('message', function (comment) {
            self.setState({ data: [comment, ...self.state.data] });
        });
    },

    render: function () {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

/********************************************************************************************************/

var CommentList = React.createClass({
    render: function () {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author} key={comment.id}>{comment.text}</Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

/********************************************************************************************************/

var CommentForm = React.createClass({

    getInitialState: function () {
        return { author: '', text: '' };
    },

    handleAuthorChange: function (e) {
        this.setState({ author: e.target.value });
    },

    handleTextChange: function (e) {
        this.setState({ text: e.target.value });
    },

    handleSubmit: function (e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    },

    render: function () {
        return (
            <div>
                <form className='commentForm' onSubmit={this.handleSubmit}>
                    <input type='text' placeholder='Name' value={this.state.author} onChange={this.handleAuthorChange} />
                    <input type='text' placeholder='Enter Message' value={this.state.text} onChange={this.handleTextChange} />
                    <input type='submit' value='Post' />
                </form>
            </div>
        );
    }
});

/********************************************************************************************************/

var Comment = React.createClass({
    render: function () {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        );
    }
});

/********************************************************************************************************/
ReactDom.render(
    <CommentBox />,
    document.getElementById('container')
);
