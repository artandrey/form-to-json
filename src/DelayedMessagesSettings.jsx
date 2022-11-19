import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EnhancedEditor from './EnhancedEditor';

const DelayedMessageItem = React.forwardRef((props, ref) => {
    const { message, message_delay, ID, ...otherProps } = props;
    console.log(message, message_delay);
    return (
        <div className="message-item" {...otherProps} ref={ref}>
            <span>Debug id: {ID}</span>
            <EnhancedEditor content={message} />
            <input
                min={0}
                type="number"
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

const DelayedMessagesList = ({ messages = [], onMessageDelayChange, onMessageContentChange }) => {
    return messages.map((message, index) => (
        <DelayedMessageListItem index={index} key={message.ID} {...message} />
    ));
};

const DelayedMessagesSettings = ({ messages: messagesList }) => {
    const [messages, setMessages] = useState(messagesList);
    
    const updateMessageFieldsById = useCallback((ID, fieldsToUpdate = {}) => {
        setMessages(messages => {
            const changedMessages = [...messages];
            for (const i in changedMessages) {
                const item = changedMessages[i];
                console.log(i);
                if (item.ID === ID) {
                    changedMessages[i] = {...item, ...fieldsToUpdate};
                    break;
                }
            }
            return changedMessages;
        });
    }, [setMessages]);


    const handleMessageContentChange = useCallback((content, ID) => {
        updateMessageFieldsById(ID, {message: content});
    }, [updateMessageFieldsById]);
    const handleMessageDelayChange = useCallback((delay, ID) => {
        updateMessageFieldsById(ID, {message_delay: delay});
    }, [updateMessageFieldsById]);

    
    useEffect(() => {
        setTimeout(() => {
            handleMessageDelayChange(200, '1')
        }, 1000);
    }, [])
    const orderedMessages = useMemo(() => {
        return messages.sort((messageA, messageB) => messageA.message_delay - messageB.message_delay)
    }, [messages]);

    return (
        <DragDropContext>
            <Droppable droppableId="messages-list">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div ref={innerRef} {...droppableProps}>
                        <DelayedMessagesList messages={orderedMessages} />
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DelayedMessagesSettings;
