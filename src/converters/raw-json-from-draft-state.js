import { convertToRaw } from 'draft-js';

const getRawJSONStringFromEditorState = (editorState) => {
    const convertedState = JSON.stringify(
        convertToRaw(editorState.getCurrentContent()),
        null,
        ' '
    );
    return convertedState;
};

export default getRawJSONStringFromEditorState;
