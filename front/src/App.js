import React from 'react'
import Routes from './routers'
import ThemeConfig from './theme'

function App() {
  return (
    <ThemeConfig>
      <div className="App">
        <Routes />
      </div>
    </ThemeConfig>
  )
}

export default App
