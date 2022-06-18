import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { CryptoChart } from '../Chart/CryptoChart'
import { TradingViewContainer } from '../TradingView/TradingViewContainer'
import MultiSwitch from '@ui/MultiSwitch/MultiSwitch'
import { EventBus } from '../../utils/EventBus'

export type SwitchOption = {
  label: string
  value: number
}

const switchOptions = [
  { label: 'Price', value: 1 },
  { label: 'Market Cap', value: 2 },
  { label: 'Trading View', value: 3 }
] as SwitchOption[]
const tradingViewOption = switchOptions[2]

export const CryptoWidget = () => {
  // todo check if specified crypto has tradingView enabled
  const [selectedSwitchOption, setSelectedSwitchOption] =
    useState<SwitchOption>(switchOptions[0])
  const [cryptoCurrency, setCryptoCurrency] = useState('SNE')

  const handleOnSymbolChange = EventBus.getInstance().register(
    'symbol-change',
    (crypto: string) => {
      setCryptoCurrency(crypto)
    }
  )

  useEffect(() => {
    return () => {
      handleOnSymbolChange.unregister()
    }
  })

  return (
    <CryptoWidgetWrapper>
      {switchOptions && selectedSwitchOption && (
        <MultiSwitch
          options={switchOptions}
          value={selectedSwitchOption}
          onChange={setSelectedSwitchOption}
          style={multiSwitchStyle}
        />
      )}

      {JSON.stringify(selectedSwitchOption) !==
        JSON.stringify(tradingViewOption) && (
        <CryptoChart
          wrapperStyles={{ marginTop: '16px', width: '100%' }}
          selectedSwitchOption={selectedSwitchOption}
          cryptoCurrency={cryptoCurrency}
        />
      )}
      {JSON.stringify(selectedSwitchOption) ===
        JSON.stringify(tradingViewOption) && (
        <TradingViewContainer
          style={{ paddingTop: '80px' }}
          symbol={cryptoCurrency}
        />
      )}
    </CryptoWidgetWrapper>
  )
}

const multiSwitchStyle = {
  position: 'absolute',
  left: '50%',
  top: '0',
  transform: 'translateX(-50%)'
}

const CryptoWidgetWrapper = styled.div({
  position: 'relative',
  minHeight: '500px'
})
