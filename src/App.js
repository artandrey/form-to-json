import React, { useCallback, useMemo, useState } from 'react';
import Form from './EnhancedEditor';
import rawJsonToHTML from './converters/raw-json-to-html';
import MOCK_DELAYED_MESSAGES from './mock-data/delayed-messages.json';
import DelayedMessagesSettings from './DelayedMessagesSettings';
import initEditorState from './converters/init-editor-state';
import getRawJSONStringFromEditorState from './converters/raw-json-from-draft-state';

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

const convertDelayedMessagesListToValidAPIData = (messages) => {
    const result = {};
    messages.forEach((item) => {
        const { ID, message, message_delay } = item;

        result['message' + ID] = message;
        result['message_delay' + ID] = message_delay;
    });

    return result;
};
const App = () => {
    const delayedMessages = useMemo(
        () =>
            normalizeAPIDelayedMessagesData(MOCK_DELAYED_MESSAGES).map(
                ({ message, ...other }) => ({
                    message: initEditorState(message),
                    ...other,
                })
            ),
        []
    );

    const handleMessageSettinsSave = useCallback((messages) => {
        const messagesWithJSONContent = messages.map(
            ({ message, ...other }) => ({
                message: getRawJSONStringFromEditorState(message),
                ...other,
            })
        );
        const dataForAPI = convertDelayedMessagesListToValidAPIData(
            messagesWithJSONContent
        );
    }, []);
    return (
        <div>
            {/* <Form content={jsonValue} onSubmit={handleFormSubmit} /> */}
            <DelayedMessagesSettings
                messages={delayedMessages}
                handleMessageSettingsChange={handleMessageSettinsSave}
            />
        </div>
    );
};

export default App;
