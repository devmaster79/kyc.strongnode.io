import React, { useEffect, useState } from "react";
import { BaseChart } from './BaseChart';
import styled from '@emotion/styled/macro'
import cryptoDataService from '../../services/cryptoDataService'
import { ValueTrendIndicator } from "./ValueTrendIndicator";

// sample placeholder data
const placeholderData = [
  {
    timestamp: 1637884800000,
    value: 0.007622691925608518
  },
  {
    timestamp: 1637971200000,
    value: 0.007554651042435728
  },
  {
    timestamp: 1638057600000,
    value: 0.007328889506987581
  }
];

type CryptoChartProps = {
  coin: string,
  wrapperStyles: object
}

export const CryptoChart = (props: CryptoChartProps) => {
  const [chartDataTemp, setChartDataTemp] = useState([]);
  const [cryptoCurrency, setCryptoCurrency] = useState('SNE')
  const [targetCurrency, setTargetCurrency] = useState('USD')

  useEffect(() => {
    loadStrongnodeCurrency()
  }, [])

  const loadStrongnodeCurrency = async () => {
    const data: any = await cryptoDataService.getChartDataAsync()
    const tempData: any = []

    data.data.prices.forEach((el: Array<string>) => {
      tempData.push({
        timestamp: el[0],
        value: el[1]
      })
    })
    setChartDataTemp(tempData)
  }

  return (
    <div style={props.wrapperStyles}>
      <CryptoPair>
        <Pair>{cryptoCurrency}/{targetCurrency}</Pair>
      </CryptoPair>
      <TrendPairWrapper>
        <ValueTrendIndicator value={'210%'} up={true} />
        <ValueTrendIndicator value={'$20'} up={false} />
      </TrendPairWrapper>
      <BaseChart xAxisFormat={'days'} data={(chartDataTemp) ? chartDataTemp : placeholderData} xKey={'timestamp'} yKey={'value'} chartKey={'value'} />
    </div>
  );
};

const CryptoPair = styled.div`
  width: max-content;
`

const Pair = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  text-transform: uppercase;
  color: #141245;
  opacity: 0.4;
  margin-bottom: 8px;
`

const TrendPairWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 32px;
  
  div {
    display: inline-block;
    vertical-align: middle;
    margin-left: 24px;
  }
  
  div:first-child {
    margin-left: 0px;
  }
`
