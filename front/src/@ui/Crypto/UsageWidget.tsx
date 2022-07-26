import * as dVPNEndpoints from 'shared/endpoints/dvpn'
import styled from '@emotion/styled'
import { generateApiCalls } from 'services/utils'
import { BaseChart } from '@ui/Chart/BaseChart'
import { useEffect, useState } from 'react'
import MultiSwitch from '@ui/MultiSwitch/MultiSwitch'

const rawCalls = generateApiCalls(dVPNEndpoints)

type ChartDataType = Array<{
  createdAt: Date
  bytesIn: number
  bytesOut: number
}>
type ChartTypes = 'bytesIn' | 'bytesOut'

export type SwitchOption = {
  label: string
  value: ChartTypes
}

const switchOptions = [
  { label: 'Bytes In', value: 'bytesIn' },
  { label: 'Bytes Out', value: 'bytesOut' }
] as SwitchOption[]

export default function UsageWidget() {
  const [selectedSwitchOption, setSelectedSwitchOption] =
    useState<SwitchOption>(switchOptions[0])
  const [usageData, setUsageData] = useState<ChartDataType>()

  useEffect(() => {
    async function fetchData() {
      const res = await rawCalls.getUsageData()
      if (res.result !== 'success') return
      setUsageData(res.data as ChartDataType)
    }
    fetchData()
  }, [])

  return (
    <UsageWidgetWrapper>
      {switchOptions && selectedSwitchOption && (
        <MultiSwitch
          options={switchOptions}
          value={selectedSwitchOption}
          onChange={setSelectedSwitchOption}
          style={multiSwitchStyle}
        />
      )}
      <BaseChart
        data={usageData || []}
        xKey="createdAt"
        yKey={selectedSwitchOption.value}
        chartKey={selectedSwitchOption.value}
        valueSuffix="B"
      />
    </UsageWidgetWrapper>
  )
}

const UsageWidgetWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '0px'
})

const multiSwitchStyle = {
  marginBottom: '30px'
}
