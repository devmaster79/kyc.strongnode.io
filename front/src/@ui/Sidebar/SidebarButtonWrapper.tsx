import React from 'react'
import styled from '@emotion/styled/macro'
import SidebarButton from './SidebarButton'

const ButtonWrapper = styled.div`
  width: 100%;
  height: max-content;
  position: relative;
`

const VerticalActiveLine = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 2px;
  height: 72px;
  background: #AA1FEC;
  transition: 250ms ease;
`

interface SidebarButtonWrapperProps {}

type SidebarButtonWrapperState = {
  activeButton: string,
  verticaLineTopOffset: string
}

const buttonItems = [
  {
    type: 'defi',
    tooltipHint: 'Defi',
    path: '/dashboard/app'
  },
  {
    type: 'nft',
    tooltipHint: 'NFT',
    path: '/dashboard/nft'
  },
  {
    type: 'kyc',
    tooltipHint: 'KYC',
    path: '/dashboard/kyc'
  }
]

class SidebarButtonWrapper extends React.Component<SidebarButtonWrapperProps, SidebarButtonWrapperState> {
  constructor(props: any) {
    super(props);

    // this handles default animation state on refresh
    let defaultActiveButton = 'defi'
    let defaultOffset = '0px'
    buttonItems.map((item: any, index: number) => {
      if (window.location.href.includes(item.path)) {
        defaultActiveButton = item.type
        defaultOffset = (index * 72) +'px'
      }
    })

    // default state definition
    this.state = {
      activeButton: defaultActiveButton,
      verticaLineTopOffset: defaultOffset
    }
  }

  handleOnClick(path: string, activeType: string, index: number) {
    this.setState({
      activeButton: activeType,
      verticaLineTopOffset: (index * 72) +'px'
    })
  }

  render() {
    return (
      <ButtonWrapper>
        <VerticalActiveLine style={{top: this.state.verticaLineTopOffset}} />
        {buttonItems.map((item, index) => <SidebarButton key={item.tooltipHint} onPress={() => this.handleOnClick(item.path, item.type, index)} icon={item.type} tooltipHint={item.tooltipHint} active={(item.type === this.state.activeButton)} url={item.path} />)}
      </ButtonWrapper>
    )
  }
}

export default SidebarButtonWrapper
