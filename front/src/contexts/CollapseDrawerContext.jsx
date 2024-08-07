import { createContext, useState, useEffect } from 'react'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const initialState = {
  collapseClick: true,
  collapseHover: false,
  onToggleCollapse: () => {
    // Do nothing
  },
  onHoverEnter: () => {
    // Do nothing
  },
  onHoverLeave: () => {
    // Do nothing
  }
}

const CollapseDrawerContext = createContext(initialState)

function CollapseDrawerProvider({ children }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [collapse, setCollapse] = useState({
    click: true,
    hover: false
  })

  useEffect(() => {
    if (isMobile) {
      setCollapse({
        click: false,
        hover: false
      })
    }
  }, [isMobile])

  const handleToggleCollapse = () => {
    setCollapse({ ...collapse, click: !collapse.click })
  }

  const handleHoverEnter = () => {
    if (collapse.click) {
      setCollapse({ ...collapse, hover: true })
    }
  }

  const handleHoverLeave = () => {
    setCollapse({ ...collapse, hover: false })
  }

  return (
    <CollapseDrawerContext.Provider
      value={{
        isCollapse: collapse.click && !collapse.hover,
        collapseClick: collapse.click,
        collapseHover: collapse.hover,
        onToggleCollapse: handleToggleCollapse,
        onHoverEnter: handleHoverEnter,
        onHoverLeave: handleHoverLeave
      }}>
      {children}
    </CollapseDrawerContext.Provider>
  )
}

export { CollapseDrawerProvider, CollapseDrawerContext }
