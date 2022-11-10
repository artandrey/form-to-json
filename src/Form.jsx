import React, { Component } from 'react';
import { EditorState, Editor, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import getRawJSONStringFromEditorState from './converters/raw-json-from-draft-state';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };

        const { content, handleSubmit } = props;

        this.onSubmit = this.onSubmit.bind(this);

        this.handleSubmit = handleSubmit ? handleSubmit : null;

        if (content) {
            this.state.editorState = EditorState.createWithContent(
                convertFromRaw(JSON.parse(content))
            );
        } else {
            this.state.editorState = EditorState.createEmpty();
        }
    }

    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSubmit(event) {
        event.preventDefault();
        const json = getRawJSONStringFromEditorState(this.state.editorState);
        this.handleSubmit && this.handleSubmit(json);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Editor</h1>
                <div style={{ border: 'solid 1px black' }}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                    />
                </div>
                <button>Save</button>
            </form>
        );
    }
}
