import styled from '@emotion/styled/macro'
import SidebarButton, { SidebarButtonProps } from './SidebarButton'
import Media from 'theme/mediaQueries'
import { ROUTES } from '../../Router'

interface SidebarButtonWrapperProps {
  isBottomBar?: boolean
}

const buttonItems = [
  {
    type: 'defi' as const,
    tooltipHint: 'Defi',
    path: ROUTES.DASHBOARD.APP,
    active: true
  },
  {
    type: 'nft' as const,
    tooltipHint: 'NFT',
    path: ROUTES.DASHBOARD.NFT,
    active: false
  },
  {
    type: 'kyc' as const,
    tooltipHint: 'Profile',
    path: ROUTES.DASHBOARD.PROFILE.GENERAL,
    active: true
  },
  {
    type: 'dvpn',
    tooltipHint: 'dVPN',
    path: ROUTES.DASHBOARD.DVPN,
    active: false
  }
]

export default function SidebarButtonWrapper(props: SidebarButtonWrapperProps) {
  const foundActiveIndex = buttonItems.findIndex((item) =>
    window.location.href.includes(item.path)
  )
  const defaultActiveIndex = 2
  const activeIndex =
    foundActiveIndex !== -1 ? foundActiveIndex : defaultActiveIndex

  const activeButton = {
    type: buttonItems[activeIndex].type,
    verticaLineTopOffset: activeIndex * 79
  }

  return (
    <ButtonWrapper>
      <VerticalActiveLine
        style={{ top: activeButton.verticaLineTopOffset + 'px' }}
      />
      {buttonItems
        .filter((item) => !(item.type === 'vpn' && props.isBottomBar))
        .map((item, index) => (
          <SidebarButton
            key={item.type}
            icon={item.type as SidebarButtonProps['icon']}
            tooltipHint={item.tooltipHint}
            active={item.type === activeButton.type}
            disabled={!item.active}
            url={item.path}
          />
        ))}
    </ButtonWrapper>
  )
}

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
  height: '79px',
  background: '#aa1fec',
  transition: '250ms ease'
})
