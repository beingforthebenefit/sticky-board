import { useState, useEffect } from 'react'
import './App.css'
import { StickyNote } from './components/StickyNote'
import 'bootstrap-icons/font/bootstrap-icons.css'

interface Position {
  x: number;
  y: number;
}

interface Note {
  id: number;
  content: string;
  position: Position;
}

// Local storage keys
const NOTES_STORAGE_KEY = 'sticky-board-notes';
const DARK_MODE_STORAGE_KEY = 'sticky-board-dark-mode';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  })
  
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    return savedNotes ? JSON.parse(savedNotes) : [{ id: 1, content: '', position: { x: 50, y: 50 } }];
  })

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, JSON.stringify(isDarkMode));
    const html = document.documentElement;
    if (isDarkMode) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  }

  const addNewNote = () => {
    const id = Date.now()
    // Position the new note with slight offset from the center
    const offset = notes.length * 20
    setNotes([...notes, { 
      id, 
      content: '',
      position: { x: 100 + offset, y: 100 + offset }
    }])
  }

  const updateNotePosition = (id: number, position: Position) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, position } : note
    ))
  }

  const updateNoteContent = (id: number, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ))
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  }

  return (
    <main className="container-fluid">
      <nav className="container-fluid">
        <ul>
          <li><strong>Sticky Board</strong></li>
        </ul>
        <ul>
          <li>
            <button 
              className="contrast outline toggle-dark-mode" 
              onClick={handleDarkModeToggle} 
              data-tooltip={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? 
                <i className="bi bi-sun-fill" aria-label="Switch to light mode"></i> : 
                <i className="bi bi-moon-fill" aria-label="Switch to dark mode"></i>
              }
            </button>
          </li>
        </ul>
      </nav>
      
      <section className="sticky-board-container">
        <div className="sticky-board">
          {notes.map(note => (
            <StickyNote 
              key={note.id}
              id={note.id}
              content={note.content}
              position={note.position}
              onPositionChange={(position: Position) => updateNotePosition(note.id, position)}
              onContentChange={(content: string) => updateNoteContent(note.id, content)}
              onDelete={deleteNote}
            />
          ))}
          
          <button 
            className="add-note-btn secondary"
            onClick={addNewNote}
            aria-label="Add new note"
            data-tooltip="New note"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </section>
      
      <footer className="app-footer">
        <p>
          Created by <a href="https://github.com/geraldtodd" target="_blank" rel="noopener noreferrer">Gerald Todd</a> | 
          <a href="https://gtodd.dev" target="_blank" rel="noopener noreferrer">gtodd.dev</a>
        </p>
      </footer>
    </main>
  )
}

export default App
