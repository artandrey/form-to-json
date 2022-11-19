import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EnhancedEditor from './EnhancedEditor';

const DelayedMessageItem = React.forwardRef((props, ref) => {
    const {
        message,
        message_delay,
        ID,
        onDelayChnage,
        onMessageChnage,
        ...otherProps
    } = props;

    const handleDelayInputChange = useCallback(
        (event) => {
            const value = event.target.value;
            onDelayChnage && onDelayChnage(value, ID);
        },
        [onDelayChnage]
    );

    const handleMessageChange = useCallback(
        (editorValue) => {
            onMessageChnage && onMessageChnage(editorValue, ID);
        },
        [onMessageChnage]
    );
    return (
        <div className="message-item" {...otherProps} ref={ref}>
            <span>Debug id: {ID}</span>
            <EnhancedEditor onChange={handleMessageChange} content={message} />
            <input
                min={0}
                type="number"
                onChange={handleDelayInputChange}
                value={message_delay}
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

const DelayedMessagesList = ({ messages = [] }) => {
    return messages.map((message, index) => (
        <DelayedMessageListItem index={index} key={message.ID} {...message} />
    ));
};

const DelayedMessagesSettings = ({ messages }) => {
    return (
        <DragDropContext>
            <Droppable droppableId="messages-list">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div ref={innerRef} {...droppableProps}>
                        <DelayedMessagesList messages={messages} />
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DelayedMessagesSettings;
