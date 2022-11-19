import { EditorState, convertFromRaw } from 'draft-js';

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

export default initEditorState;
