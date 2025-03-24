import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavigationButtons from './components/NavigationButtons'
import ProgressBar from './components/Progressbar'

function App() {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const totalPages = 8 // Define the total number of pages

  const handleNext = () => {
    setPage(page + 1)
    console.log('Moving to next page:', page + 1)
  }

  const handleBack = () => {
    setPage(page - 1)
    console.log('Moving to previous page:', page - 1)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
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
      
      {/* Progress Bar */}
      <div style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <div>Progress</div>
          <span>{page} of {totalPages}</span>
        </div>
        <ProgressBar currentPage={page} totalPages={totalPages} />
      </div>
      
      {/* Navigation Buttons */}
      <div style={{ margin: '20px 0' }}>
        <p>Current Page: {page}</p>
        <NavigationButtons 
          onNext={handleNext}
          onBack={handleBack}
          canGoBack={page > 1}
          canGoNext={page < totalPages}
          nextLabel="Next Page"
          backLabel="Previous Page"
        />
      </div>
    </>
  )
}

export default App
