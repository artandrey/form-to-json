import React, { useCallback, useEffect, useState } from 'react';
import { EditorState, Editor, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import getRawJSONStringFromEditorState from './converters/raw-json-from-draft-state';

const initEditorState = (content) => {
    if (content instanceof EditorState) return content;
    if (content) {
        return EditorState.createWithContent(
            convertFromRaw(JSON.parse(content))
        );
    } else {
        return EditorState.createEmpty();
    }
};

const EnhancedEditor = ({ content, onChange }) => {
    const [editorValue, setEditorValue] = useState(initEditorState(content));
    const handleChange = useCallback(
        (editorValue) => {
            setEditorValue(editorValue);
            onChange && onChange(editorValue);
        },
        [onChange]
    );

    useEffect(() => {
        setEditorValue(initEditorState(content));
    }, [setEditorValue, content]);

    return (
        <div className="editor-wrapper" style={{ border: 'solid 1px black' }}>
            <Editor editorState={editorValue} onChange={handleChange} />
        </div>
    );
};

export default EnhancedEditor;
