import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

// Props for the Larger Droppable
interface LargerDroppableProps {
  children: ReactNode;
}

// The larger droppable area acting as a fixed container
export function LargerDroppable({ children }: LargerDroppableProps) {
  const { setNodeRef } = useDroppable({
    id: "larger-droppable", // Unique ID for this droppable area
  });

  // Casting the style object to React.CSSProperties to fix TypeScript error
  const style: React.CSSProperties = {
    width: "80vw", // 80% of the viewport width
    height: "80vh", // 80% of the viewport height
    margin: "20px auto",
    border: "2px solid #007bff",
    display: "flex",
    flexDirection: "column", // This is now correctly typed as "column"
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e9ecef",
    position: "relative", // To allow absolute positioning of draggable items inside
    overflow: "hidden", // Prevent the draggable item from affecting layout
  };

  return (
    <div ref={setNodeRef} style={style} className="larger-droppable-box">
      {children}
    </div>
  );
}
