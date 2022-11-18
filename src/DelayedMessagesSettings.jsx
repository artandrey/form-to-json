import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const DelayedMessageItem = React.forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            <h2>message</h2>
        </div>
    );
});

const DelayedMessageListItem = () => {
    return (
        <Draggable>
            {(provided) => (
                <DelayedMessageItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                />
            )}
        </Draggable>
    );
};

const DelayedMessagesSettings = ({ messages }) => {
    return (
        <DragDropContext>
            <Droppable droppableId="messages-list">
                {({ innerRef, droppableProps, placeholder }) => (
                    <div ref={innerRef} {...droppableProps}>
                        <DelayedMessageItem />
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DelayedMessagesSettings;
