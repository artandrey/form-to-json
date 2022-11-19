import React, { useCallback, useMemo, useState } from 'react';
import Form from './EnhancedEditor';
import rawJsonToHTML from './converters/raw-json-to-html';
import MOCK_DELAYED_MESSAGES from './mock-data/delayed-messages.json';
import DelayedMessagesSettings from './DelayedMessagesSettings';

const normalizeAPIDelayedMessagesData = (apiData) => {
    const result = {};
    const messageKeyRegEx = new RegExp(/message\d+/);
    const messageDelayKeyRegEx = new RegExp(/message_delay\d+/);

    const getIdFromKey = (key) => {
        if (messageKeyRegEx.test(key)) {
            return { id: key.replace('message', ''), accessor: 'message' };
        }
        if (messageDelayKeyRegEx.test(key)) {
            return {
                id: key.replace('message_delay', ''),
                accessor: 'message_delay',
            };
        }
    };
    for (const key in apiData) {
        const value = apiData[key];
        const { id, accessor } = getIdFromKey(key);
        result[id] = result[id]
            ? { ...result[id], [accessor]: value }
            : { [accessor]: value };
    }
    return Object.entries(result).map(([id, data]) => ({ ID: id, ...data }));
};
const App = () => {
    const delayedMessages = useMemo(
        () => normalizeAPIDelayedMessagesData(MOCK_DELAYED_MESSAGES),
        []
    );
    console.log(delayedMessages);
    return (
        <div>
            {/* <Form content={jsonValue} onSubmit={handleFormSubmit} /> */}
            <DelayedMessagesSettings messages={delayedMessages} />
        </div>
    );
};

export default App;
