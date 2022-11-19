import React, { useCallback, useEffect, useState } from 'react';
import { EditorState, Editor, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import getRawJSONStringFromEditorState from './converters/raw-json-from-draft-state';
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
