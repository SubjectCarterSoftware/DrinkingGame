import React, { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Droppable } from "../Droppable";
import { Draggable } from "../Draggable";
import { LargerDroppable } from "../LargerDroppable";
import "./App.css";

const GamePage: React.FC = () => {
  const containers: string[] = ["A", "B", "C"]; // IDs for small containers
  const draggableItems: string[] = [
    "draggable1",
    "draggable2",
    "draggable3",
    "draggable4",
  ]; // Array for draggable buttons

  const [parent, setParent] = useState<{ [key: string]: string | null }>({
    draggable1: null,
    draggable2: null,
    draggable3: null,
    draggable4: null,
  }); // Track which container holds each draggable
  const [draggingItem, setDraggingItem] = useState<JSX.Element | null>(null); // Track active item being dragged

  // Render the draggable items
  const renderDraggable = (id: string) => (
    <Draggable key={id} id={id}>
      {`${id}`}
    </Draggable>
  );

  return (
    <div className="app-container">
      <h1 className="header">Drag and Drop UI with Fixed Buttons</h1>
      {/* Wrapping everything inside the DndContext to handle drag and drop */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Larger Droppable Area */}
        <LargerDroppable>
          {/* Render the draggable items in the larger area if no parent container is set */}
          {draggableItems.map(
            (id) => parent[id] === null && renderDraggable(id)
          )}

          {/* Always render the smaller droppable containers */}
          <div className="droppable-container">
            {containers.map((id) => (
              <Droppable key={id} id={id}>
                {draggableItems.map(
                  (draggableId) =>
                    parent[draggableId] === id && renderDraggable(draggableId)
                )}
                Drop here
              </Droppable>
            ))}
          </div>
        </LargerDroppable>

        {/* DragOverlay to manage the animation on drag end */}
        <DragOverlay>{draggingItem}</DragOverlay>
      </DndContext>
    </div>
  );

  // This function gets triggered when the drag starts
  function handleDragStart(event: any) {
    const { active } = event;
    setDraggingItem(<Draggable id={active.id}>{`${active.id}`}</Draggable>);
  }

  // This function gets triggered when the drag ends
  function handleDragEnd(event: any) {
    const { over, active } = event;
    setDraggingItem(null); // Clear dragging item from overlay

    // Check if the draggable was dropped over any droppable area
    if (over) {
      console.log("Dropped over:", over.id); // Log the ID of the droppable element

      if (over.id === "larger-droppable") {
        // If dropped in the larger droppable area
        console.log("Dropped in the larger droppable area");
        setParent((prevParent) => ({
          ...prevParent,
          [active.id]: null, // Reset parent to ensure it's in the larger area
        }));
      } else if (containers.includes(over.id)) {
        console.log("Dropped in container:", over.id);
        setParent((prevParent) => ({
          ...prevParent,
          [active.id]: over.id, // Set the parent to the new container
        }));
      }
    }
  }
};

export default GamePage;
