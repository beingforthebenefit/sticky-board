import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <div className="form-group">
          <label htmlFor="themeSwitch" style={{ marginBottom: 0 }}>
            <input
              type="checkbox"
              id="themeSwitch"
              role="switch"
              onChange={(e) => {
                const html = document.documentElement;
                if (e.target.checked) {
                  html.setAttribute('data-theme', 'dark');
                } else {
                  html.removeAttribute('data-theme');
                }
              }}
            />
            Dark Mode
          </label>
        </div>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
