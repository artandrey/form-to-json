import { convertFromRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const rawJsonToHTML = (json) => {
    const html = stateToHTML(
        EditorState.createWithContent(
            convertFromRaw(JSON.parse(json))
        ).getCurrentContent()
    );
    return html;
};

export default rawJsonToHTML;
