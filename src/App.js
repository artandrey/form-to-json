import React, { useCallback, useState } from 'react';
import Form from './Form';
import rawJsonToHTML from './converters/raw-json-to-html';
const App = () => {
    const defaultValue = `{
    "blocks": [
     {
      "key": "1kdsb",
      "text": "Default text from App component",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
     },
     {
      "key": "2ipln",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
     },
     {
      "key": "2glph",
      "text": "Formetted and with emojis 👍",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
     }
    ],
    "entityMap": {}
   }`;
    const [jsonValue, setJsonValue] = useState(defaultValue);

    const handleFormSubmit = useCallback(
        (json) => {
            setJsonValue(json);
            console.log(rawJsonToHTML(json));
            // SEND TO DB TUT
        },
        [setJsonValue]
    );
    return (
        <div>
            <Form content={jsonValue} onSubmit={handleFormSubmit} />
            <pre>{jsonValue}</pre>
        </div>
    );
};

export default App;
