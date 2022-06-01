import React from 'react'
import styled from '@emotion/styled/macro'
import SidebarButton, { SidebarButtonProps } from './SidebarButton'
import Media from 'theme/mediaQueries'

interface SidebarButtonWrapperProps {
  isBottomBar?: boolean
}

type SidebarButtonWrapperState = {
  activeButton: string
  verticaLineTopOffset: string
}

interface IButtonItem {
  type: string
  tooltipHint: string
  path: string
}

let buttonItems = [
  {
    type: 'defi',
    tooltipHint: 'Defi',
    path: '/dashboard/app',
    active: true
  },
  {
    type: 'nft',
    tooltipHint: 'NFT',
    path: '/dashboard/nft',
    active: false
  },
  {
    type: 'kyc',
    tooltipHint: 'KYC',
    path: '/dashboard/kyc',
    active: true
  },
  {
    type: 'vpn',
    tooltipHint: 'VPN',
    path: '/dashboard/vpn',
    active: false
  }
]

class SidebarButtonWrapper extends React.Component<
  SidebarButtonWrapperProps,
  SidebarButtonWrapperState
> {
  constructor(
    props: SidebarButtonWrapperProps | Readonly<SidebarButtonWrapperProps>
  ) {
    super(props)

    // remove vpn from bottom bar
    if (props.isBottomBar) {
      buttonItems = buttonItems.filter((item) => item.type !== 'vpn')
    }

    // this handles default animation state on refresh
    let defaultActiveButton = 'kyc'
    let defaultOffset = 2 * 72 + 'px'
    buttonItems.forEach((item: IButtonItem, index: number) => {
      if (window.location.href.includes(item.path)) {
        // todo temporary disabled until Matthew transforms this into Functional component to useEffect for url updates
        defaultActiveButton = item.type
        defaultOffset = index * 72 + 'px'
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
      verticaLineTopOffset: index * 72 + 'px'
    })
  }

  render() {
    return (
      <ButtonWrapper>
        <VerticalActiveLine style={{ top: this.state.verticaLineTopOffset }} />
        {buttonItems.map((item, index) => (
          <SidebarButton
            key={item.tooltipHint}
            onPress={
              item.active
                ? () => this.handleOnClick(item.path, item.type, index)
                : undefined
            }
            icon={item.type as SidebarButtonProps['icon']}
            tooltipHint={item.tooltipHint}
            active={item.type === this.state.activeButton}
            disabled={!item.active}
            url={item.path}
          />
        ))}
      </ButtonWrapper>
    )
  }
}

export default SidebarButtonWrapper

export const ButtonWrapper = styled.div({
  width: '100%',
  height: 'max-content',
  position: 'relative',
  [Media.phone]: {
    display: 'flex',
    padding: '0px 31px'
  }
})

const VerticalActiveLine = styled.div({
  position: 'absolute',
  right: 0,
  top: 0,
  width: '2px',
  height: '72px',
  background: '#aa1fec',
  transition: '250ms ease'
})
