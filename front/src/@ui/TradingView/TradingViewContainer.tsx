import React, { useEffect, useReducer } from 'react'
import { AdvancedChart } from 'react-tradingview-embed'
import { useTradingViewSymbol } from '../../hooks/useTradingViewSymbol'
import useSettings from 'hooks/useSettings'

interface ITradingViewContainer {
  symbol: string
  style?: object
}

export const TradingViewContainer = (props: ITradingViewContainer) => {
  const tradingViewSymbol = useTradingViewSymbol({ symbol: props.symbol })
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const { themeMode } = useSettings()

  // forcing rerender, so AdvancedChart can refresh the source symbol
  useEffect(() => {
    forceUpdate()
  }, [props.symbol])

  return (
    <div style={props.style}>
      <AdvancedChart
        widgetProps={{
          width: '100%',
          height: '500px',
          allow_symbol_change: true,
          symbol: tradingViewSymbol ? tradingViewSymbol : 'SNEUSDC',
          theme: themeMode
        }}
      />
    </div>
  )
}
