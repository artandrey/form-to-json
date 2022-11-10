import React, { useCallback, useState } from 'react';
import { EditorState, Editor, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import getRawJSONStringFromEditorState from './converters/raw-json-from-draft-state';

const initEditorState = (content) => {
    if (content) {
        return EditorState.createWithContent(
            convertFromRaw(JSON.parse(content))
        );
    } else {
        return EditorState.createEmpty();
    }
};

const Form = ({ content, onSubmit }) => {
    const [editorValue, setEditorValue] = useState(initEditorState(content));
    const handleFormSubmit = useCallback(
        (event) => {
            event.preventDefault();
            const json = getRawJSONStringFromEditorState(editorValue);
            onSubmit && onSubmit(json);
        },
        [editorValue, onSubmit]
    );

    return (
        <form onSubmit={handleFormSubmit}>
            <h1>Editor</h1>
            <div style={{ border: 'solid 1px black' }}>
                <Editor editorState={editorValue} onChange={setEditorValue} />
            </div>
            <button>Save</button>
        </form>
    );
};

export default Form;
