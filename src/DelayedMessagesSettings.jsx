import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDebouncedCallback } from 'use-debounce';
import EnhancedEditor from './EnhancedEditor';

const DelayedMessageItem = React.forwardRef((props, ref) => {
    const {
        message,
        message_delay,
        ID,
        onDelayChnage,
        onMessageChnage,
        invalidDelay,
        ...otherProps
    } = props;
    const [delay, setDelay] = useState(message_delay);
    const handleDelayInputChange = useCallback(
        (event) => {
            const value = +event.target.value;
            setDelay(value);
            onDelayChnage && onDelayChnage(value, ID);
        },
        [onDelayChnage, setDelay, ID]
    );

    useEffect(() => {
        setDelay(message_delay);
    }, [message_delay]);

    const handleMessageChange = useCallback(
        (editorValue) => {
            onMessageChnage && onMessageChnage(editorValue, ID);
        },
        [onMessageChnage, ID]
    );
    return (
        <div className="message-item" {...otherProps} ref={ref}>
            <span>Debug id: {ID}</span>
            <EnhancedEditor onChange={handleMessageChange} content={message} />
            <input
                style={{
                    borderColor: invalidDelay ? 'red' : 'black',
                    borderWidth: '4px',
                }}
                min={0}
                type="number"
                onChange={handleDelayInputChange}
                value={delay}
                name=""
                id=""
            />
        </div>
    );
});

const DelayedMessageListItem = (props) => {
    const { ID, index } = props;
    return (
        <Draggable draggableId={'draggable_' + ID} index={index}>
            {(provided) => (
                <DelayedMessageItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    {...props}
                />
            )}
        </Draggable>
    );
};

const DelayedMessagesList = ({
    messages = [],
    repeatingDelays = [],
    onDelayChanage,
    onMessageChnage,
}) => {
    return messages.map((message, index) => (
        <DelayedMessageListItem
            index={index}
            key={message.ID}
            {...message}
            onDelayChnage={onDelayChanage}
            onMessageChnage={onMessageChnage}
            invalidDelay={repeatingDelays.includes(message.message_delay)}
        />
    ));
};

const switchDelay = (array, item1Index, item2Index) => {
    const result = [...array];
    const item1 = result[item1Index];
    const item2 = result[item2Index];
    const item1Delay = item1.message_delay;
    const item2Delay = item2.message_delay;

    item1.message_delay = item2Delay;
    item2.message_delay = item1Delay;

    return result;
};

const DelayedMessagesSettings = ({
    messages: messagesList,
    handleMessageSettingsChange,
}) => {
    const [messages, setMessages] = useState(messagesList);

    useEffect(() => {
        setMessages(messagesList);
    }, [messagesList]);
    const updateMessageFieldsById = useCallback(
        (ID, fieldsToUpdate = {}) => {
            setMessages((messages) => {
                const changedMessages = [...messages];
                for (const i in changedMessages) {
                    const item = changedMessages[i];
                    if (item.ID === ID) {
                        changedMessages[i] = { ...item, ...fieldsToUpdate };
                        break;
                    }
                }
                return changedMessages;
            });
        },
        [setMessages]
    );

    const handleMessageContentChange = useCallback(
        (content, ID) => {
            updateMessageFieldsById(ID, { message: content });
        },
        [updateMessageFieldsById]
    );
    const handleMessageDelayChange = useCallback(
        (delay, ID) => {
            updateMessageFieldsById(ID, { message_delay: delay });
        },
        [updateMessageFieldsById]
    );

    const debouncedHanadleMessageDelayChange = useDebouncedCallback(
        handleMessageDelayChange,
        300
    );

    const orderedMessages = useMemo(() => {
        return messages.sort(
            (messageA, messageB) =>
                messageA.message_delay - messageB.message_delay
        );
    }, [messages]);

    const repeatingDelay = useMemo(() => {
        const delaysArray = messages.map(({ message_delay }) => message_delay);
        const repeatingDelay =
            delaysArray.filter(
                (delay, index, delays) => delays.indexOf(delay) !== index
            ) || [];
        return repeatingDelay;
    }, [messages]);

    const handleDragEnd = useCallback(
        (result) => {
            if (!result.destination) return;
            const destinationIndex = result.destination.index;
            const sourceIndex = result.source.index;
            if (destinationIndex === sourceIndex) return;

            setMessages((messages) =>
                switchDelay(messages, sourceIndex, destinationIndex)
            );
        },
        [setMessages]
    );

    const handleFormSubmit = useCallback(
        (event) => {
            event.preventDefault();
            handleMessageSettingsChange &&
                handleMessageSettingsChange(messages, repeatingDelay.length);
        },
        [messages, repeatingDelay, handleMessageSettingsChange]
    );

    return (
        <form onSubmit={handleFormSubmit}>
            <button disabled={repeatingDelay.length} type="submit">
                Save
            </button>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="messages-list">
                    {({ innerRef, droppableProps, placeholder }) => (
                        <div ref={innerRef} {...droppableProps}>
                            <DelayedMessagesList
                                messages={orderedMessages}
                                repeatingDelays={repeatingDelay}
                                onMessageChnage={handleMessageContentChange}
                                onDelayChanage={
                                    debouncedHanadleMessageDelayChange
                                }
                            />
                            {placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </form>
    );
};

export default DelayedMessagesSettings;
