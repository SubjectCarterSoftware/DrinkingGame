import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSSProperties } from "react"; // Import CSSProperties for typing

// Draggable component that moves according to user input
export function Draggable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style: CSSProperties = {
    // Fixed width and height for draggable buttons
    width: "150px", // Fixed width for the button
    height: "50px", // Fixed height for the button
    margin: "5px",
    backgroundColor: "#007bff", // Equivalent of .draggable background-color
    color: "white", // Equivalent of .draggable color
    border: "none", // Equivalent of .draggable border
    cursor: isDragging ? "grabbing" : "grab", // Manage cursor based on dragging state
    borderRadius: "4px", // Equivalent of .draggable border-radius
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: "relative", // Ensure it positions itself relative to its container
    opacity: isDragging ? 0.1 : 1, // Add opacity when dragging
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-button"
    >
      {children}
    </button>
  );
}
