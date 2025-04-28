import { useState, useRef, useEffect, MouseEvent, useMemo } from 'react';
import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface StickyNoteProps {
  id: number;
  content: string;
  position: Position;
  onPositionChange: (position: Position) => void;
  onContentChange: (content: string) => void;
  onDelete: (id: number) => void;
}

export function StickyNote({ id, content, position, onPositionChange, onContentChange, onDelete }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const noteRef = useRef<HTMLElement>(null);
  
  // Generate a random tilt angle between -3 and 3 degrees that remains consistent for this note
  const tiltAngle = useMemo(() => Math.random() * 6 - 3, []);

  const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // Only initiate dragging if clicking on the note itself, not on buttons or textarea
    if (noteRef.current && 
        target === noteRef.current) {
      setIsDragging(true);
      const rect = noteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (isDragging && noteRef.current && noteRef.current.parentElement) {
      const boardRect = noteRef.current.parentElement.getBoundingClientRect();
      const noteRect = noteRef.current.getBoundingClientRect();
      
      // Calculate new position relative to the board
      const newX = e.clientX - boardRect.left - dragOffset.x;
      const newY = e.clientY - boardRect.top - dragOffset.y;
      
      // Apply constraints to keep the note within the board
      const constrainedX = Math.max(0, Math.min(newX, boardRect.width - noteRect.width));
      const constrainedY = Math.max(0, Math.min(newY, boardRect.height - noteRect.height));
      
      onPositionChange({ x: constrainedX, y: constrainedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  useEffect(() => {
    if (isDragging) {
      // Add event listeners to document for smooth dragging
      const handleMouseMoveDoc = (e: globalThis.MouseEvent) => {
        if (noteRef.current && noteRef.current.parentElement) {
          const boardRect = noteRef.current.parentElement.getBoundingClientRect();
          const noteRect = noteRef.current.getBoundingClientRect();
          
          const newX = e.clientX - boardRect.left - dragOffset.x;
          const newY = e.clientY - boardRect.top - dragOffset.y;
          
          const constrainedX = Math.max(0, Math.min(newX, boardRect.width - noteRect.width));
          const constrainedY = Math.max(0, Math.min(newY, boardRect.height - noteRect.height));
          
          onPositionChange({ x: constrainedX, y: constrainedY });
        }
      };
      
      const handleMouseUpDoc = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleMouseMoveDoc);
      document.addEventListener('mouseup', handleMouseUpDoc);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveDoc);
        document.removeEventListener('mouseup', handleMouseUpDoc);
      };
    }
  }, [isDragging, dragOffset, onPositionChange]);

  const noteStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`, 
    transform: `rotate(${tiltAngle}deg)`,
    zIndex: isDragging ? 100 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  } as React.CSSProperties;

  return (
    <article 
      ref={noteRef}
      className="sticky-note"
      style={noteStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <button 
        className="close-btn"
        onClick={handleDeleteClick}
        aria-label="Delete note"
      >
        <i className="bi bi-x"></i>
      </button>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Write your note here..."
        onClick={(e) => e.stopPropagation()}
      />
    </article>
  );
} 