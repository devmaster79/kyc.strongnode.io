import { useEffect, useState } from 'react'

interface IUseTradingViewSymbol {
  symbol: string
  targetCurrency?: string
}

interface ISymbolExceptions {
  [key: string]: string
}

// todo research all of the exceptions
const symbolsExceptions: ISymbolExceptions = {
  BTC: 'BTCUSD'
}

export const useTradingViewSymbol = (props: IUseTradingViewSymbol) => {
  const [tradingViewSymbol, setTradingViewSymbol] = useState<
    string | undefined
  >(undefined)

  if (!props.targetCurrency) props.targetCurrency = 'USD'

  useEffect(() => {
    setTradingViewSymbol(
      symbolsExceptions[props.symbol]
        ? symbolsExceptions[props.symbol]
        : props.symbol + props.targetCurrency
    )
  }, [props.symbol, props.targetCurrency])

  return tradingViewSymbol
}
