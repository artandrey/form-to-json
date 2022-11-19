import React, { useCallback, useEffect, useMemo } from 'react';
import DelayedMessagesSettings from './DelayedMessagesSettings';
import initEditorState from './converters/init-editor-state';
import getRawJSONStringFromEditorState from './converters/raw-json-from-draft-state';
import useFetchCall from './hooks/useFetchCall';

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

const fetchDelayedMessages = function () {
    return fetch('/mock-data/delayed-messages.json');
};

const updateMessages = function (messages) {
    return fetch('/update', { method: 'POST', body: JSON.stringify(messages) });
};

const App = () => {
    const { send: sendGETMessagesRequest, data: messagesResponce } =
        useFetchCall(fetchDelayedMessages);

    const { send: updateMessagesDelay } = useFetchCall(updateMessages, () =>
        alert('Request finished')
    );

    useEffect(() => {
        sendGETMessagesRequest();
    }, [sendGETMessagesRequest]);

    const delayedMessages = useMemo(() => {
        if (!messagesResponce) return [];
        return normalizeAPIDelayedMessagesData(messagesResponce).map(
            ({ message, ...other }) => ({
                message: initEditorState(message),
                ...other,
            })
        );
    }, [messagesResponce]);

    const handleMessageSettinsSave = useCallback(
        (messages) => {
            const messagesWithJSONContent = messages.map(
                ({ message, ...other }) => ({
                    message: getRawJSONStringFromEditorState(message),
                    ...other,
                })
            );
            const dataForAPI = convertDelayedMessagesListToValidAPIData(
                messagesWithJSONContent
            );
            updateMessagesDelay(dataForAPI);
        },
        [updateMessagesDelay]
    );
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
