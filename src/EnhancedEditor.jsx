import React from 'react';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import initEditorState from './converters/init-editor-state';

const EnhancedEditor = ({ content, onChange }) => {
    const editorValue = initEditorState(content);

    return (
        <div className="editor-wrapper" style={{ border: 'solid 1px black' }}>
            <Editor editorState={editorValue} onChange={onChange} />
        </div>
    );
};

export default EnhancedEditor;
