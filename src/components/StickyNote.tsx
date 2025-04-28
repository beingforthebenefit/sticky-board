import { useState, useRef, useEffect, MouseEvent, TouchEvent, useMemo } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const noteRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Generate a random tilt angle between -3 and 3 degrees that remains consistent for this note
  const tiltAngle = useMemo(() => Math.random() * 6 - 3, []);

  // Check if we're on a mobile device
  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
    if (isMobile) return; // Skip on mobile, we use touch events instead
    
    const target = e.target as HTMLElement;
    // Only initiate dragging if clicking on the note itself, not on buttons or textarea
    if (noteRef.current && target === noteRef.current) {
      setIsDragging(true);
      const rect = noteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    if (!noteRef.current) return;
    
    // Don't start dragging if the tap is on the close button or we're actively editing
    const target = e.target as HTMLElement;
    if (target.closest('.close-btn') || isEditing) return;
    
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = noteRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
    if (!isDragging || !noteRef.current || !noteRef.current.parentElement) return;
    
    const touch = e.touches[0];
    const boardRect = noteRef.current.parentElement.getBoundingClientRect();
    const noteRect = noteRef.current.getBoundingClientRect();
    
    // Calculate new position relative to the board
    const newX = touch.clientX - boardRect.left - dragOffset.x;
    const newY = touch.clientY - boardRect.top - dragOffset.y;
    
    // Apply constraints to keep the note within the board
    const constrainedX = Math.max(0, Math.min(newX, boardRect.width - noteRect.width));
    const constrainedY = Math.max(0, Math.min(newY, boardRect.height - noteRect.height));
    
    onPositionChange({ x: constrainedX, y: constrainedY });
    e.preventDefault(); // Prevent scrolling while dragging
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // On mobile, if it was just a tap (not a drag), focus the textarea
      if (isMobile && !isEditing && textareaRef.current) {
        textareaRef.current.focus();
        setIsEditing(true);
      }
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

  const handleDeleteClick = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleNoteTap = () => {
    if (isMobile && !isDragging && !isEditing && textareaRef.current) {
      textareaRef.current.focus();
      setIsEditing(true);
    }
  };

  const handleTextareaBlur = () => {
    setIsEditing(false);
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

      const handleTouchMoveDoc = (e: globalThis.TouchEvent) => {
        if (noteRef.current && noteRef.current.parentElement) {
          const touch = e.touches[0];
          const boardRect = noteRef.current.parentElement.getBoundingClientRect();
          const noteRect = noteRef.current.getBoundingClientRect();
          
          const newX = touch.clientX - boardRect.left - dragOffset.x;
          const newY = touch.clientY - boardRect.top - dragOffset.y;
          
          const constrainedX = Math.max(0, Math.min(newX, boardRect.width - noteRect.width));
          const constrainedY = Math.max(0, Math.min(newY, boardRect.height - noteRect.height));
          
          onPositionChange({ x: constrainedX, y: constrainedY });
          e.preventDefault(); // Prevent scrolling while dragging
        }
      };
      
      const handleTouchEndDoc = () => {
        setIsDragging(false);
      };
      
      // Add mouse events for desktop
      document.addEventListener('mousemove', handleMouseMoveDoc);
      document.addEventListener('mouseup', handleMouseUpDoc);
      
      // Add touch events for mobile
      document.addEventListener('touchmove', handleTouchMoveDoc, { passive: false });
      document.addEventListener('touchend', handleTouchEndDoc);
      
      return () => {
        // Remove mouse events
        document.removeEventListener('mousemove', handleMouseMoveDoc);
        document.removeEventListener('mouseup', handleMouseUpDoc);
        
        // Remove touch events
        document.removeEventListener('touchmove', handleTouchMoveDoc);
        document.removeEventListener('touchend', handleTouchEndDoc);
      };
    }
  }, [isDragging, dragOffset, onPositionChange]);

  const noteStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`, 
    transform: `rotate(${tiltAngle}deg)`,
    zIndex: isDragging ? 100 : (isEditing ? 90 : 1),
    cursor: isDragging ? 'grabbing' : (isMobile ? 'default' : 'grab')
  } as React.CSSProperties;

  return (
    <article 
      ref={noteRef}
      className={`sticky-note ${isEditing ? 'editing' : ''}`}
      style={noteStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={isMobile ? handleNoteTap : undefined}
    >
      <button 
        className="close-btn"
        onClick={handleDeleteClick}
        aria-label="Delete note"
      >
        <i className="bi bi-x"></i>
      </button>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onBlur={handleTextareaBlur}
        placeholder="Write your note here..."
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      />
    </article>
  );
} 