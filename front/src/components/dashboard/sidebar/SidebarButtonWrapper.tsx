import React from 'react'
import styled from 'styled-components'
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
    path: '/'
  },
  {
    type: 'nft',
    tooltipHint: 'NFT',
    path: '/nft'
  },
  {
    type: 'kyc',
    tooltipHint: 'KYC Registration',
    path: 'kyc'
  }
]

class SidebarButtonWrapper extends React.Component<SidebarButtonWrapperProps, SidebarButtonWrapperState> {
  state: SidebarButtonWrapperState = {
    activeButton: 'defi',
    verticaLineTopOffset: '0px'
  }

  handleOnClick(path, activeType, index) {
    // todo redirect to the given path
    this.setState({
      activeButton: activeType,
      verticaLineTopOffset: (index * 72) +'px'
    })
  }

  render() {
    return (
      <ButtonWrapper>
        <VerticalActiveLine style={{top: this.state.verticaLineTopOffset}} />
        {buttonItems.map((item, index) => <SidebarButton key={item.tooltipHint} onPress={() => this.handleOnClick(item.path, item.type, index)} icon={item.type} tooltipHint={item.tooltipHint} active={(item.type === this.state.activeButton)} />)}
      </ButtonWrapper>
    )
  }
}

export default SidebarButtonWrapper
