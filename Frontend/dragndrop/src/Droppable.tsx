import React, { ReactNode, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";

// TypeScript interface for the Droppable component props
interface DroppableProps {
  id: string; // Unique identifier for the droppable area
  children: ReactNode; // Content inside the droppable area (draggable items or placeholders)
}

// Droppable component responsible for creating drop zones
export function Droppable({ id, children }: DroppableProps) {
  const { isOver, setNodeRef, rect } = useDroppable({
    id, // Unique identifier
  });

  // Use `useEffect` to log only when `rect` changes
  useEffect(() => {
    if (rect) {
      console.log(`Droppable ${id} dimensions:`, rect);
    }
  }, [rect, id]); // Log only when `rect` changes

  // Inline styles for the droppable area, dynamically allowing growth in height
  const style: React.CSSProperties = {
    width: "200px", // Set width explicitly
    margin: "5px",
    minHeight: "200px", // Minimum height; will grow if needed
    backgroundColor: isOver ? "#d4edda" : "#f4f4f9", // Background color change when an item is dragged over
    border: `2px dashed ${isOver ? "#28a745" : "#cccccc"}`, // Change border color dynamically
    display: "flex", // Flexbox for layout
    flexDirection: "column", // Stack items vertically
    justifyContent: "flex-start", // Align items to the top of the container
    alignItems: "center", // Center content horizontally
    padding: "10px", // Add some padding inside the droppable
    transition: "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition on hover
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children} {/* Content inside the droppable area */}
    </div>
  );
}
