import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EnhancedEditor from './EnhancedEditor';

const DelayedMessageItem = React.forwardRef((props, ref) => {
    const { message, message_delay, ID, ...otherProps } = props;
    return (
        <div className="message-item" {...otherProps} ref={ref}>
            <span>Debug id: {ID}</span>
            <EnhancedEditor content={message} />
            <input
                min={0}
                type="number"
                defaultValue={message_delay}
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
