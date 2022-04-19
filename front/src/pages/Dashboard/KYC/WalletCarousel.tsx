import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper'
import Box from '@mui/material/Box'
import styled from '@emotion/styled'
import { ReactComponent as WalletIcon } from '../../../icons/wallet.svg'
import { ReactComponent as AddWalletIcon } from '../../../icons/add-wallet.svg'
import { ReactComponent as EditWalletIcon } from '../../../icons/edit-wallet.svg'
import { ReactComponent as PrevIcon } from '../../../icons/carousel-prev.svg'
import { ReactComponent as NextIcon } from '../../../icons/carousel-next.svg'

export function WalletCarousel() {
  interface walletObjType {
    featureIcon: number,
    label: string,
    description: string
  }

  const walletObjects: walletObjType[] = [
    {
      featureIcon: 0,
      label: 'ADD WALLET',
      description: ''
    },
    {
      featureIcon: 1,
      label: 'WALLET 1',
      description: '(2J33...wM2t)'
    },
    {
      featureIcon: 0,
      label: 'ADD WALLET',
      description: ''
    }
  ]
  return (
    <Container>
      <Swiper
        slidesPerView={3}
        spaceBetween={16}
        loop
        navigation={{
          prevEl: '.prev',
          nextEl: '.next'
        }}
        modules={[Navigation]}
        style={{ width: '100%' }}
      >
        {walletObjects?.map((data: walletObjType, index: number) => (
          <SwiperSlide
            key={index}
            style={{
              height: '110px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '24px 0px 24px 0px'
            }}
          >
            <Box sx={{ paddingLeft: '24px' }}>
              <WalletIcon />
              <Box sx={{ paddingTop: '46px' }}>
                <Box sx={{ display: 'flex' }}>
                  {data.featureIcon
                    ? <EditWalletIcon width={40} height={40} />
                    : <AddWalletIcon width={40} height={40} />}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingLeft: '16px'
                  }}
                  >
                    <Box>
                      {data.label}
                    </Box>
                    {data.description
                      ? <Box sx={{ color: '#f3f3f3' }}>{data.description}</Box>
                      : null}
                  </Box>
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'absolute',
          zIndex: '20',
          top: '43%'
        }}
        >
          <Box className='prev' sx={{ cursor: 'pointer' }}>
            <PrevIcon width={40} />
          </Box>
          <Box className='next' sx={{ cursor: 'pointer' }}>
            <NextIcon width={40} />
          </Box>
        </Box>
        <Box sx={{
          width: '120px',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: '10',
          background: 'linear-gradient(91.67deg, #111056 1.25%, rgba(17, 16, 86, 0) 98.45%)'
        }}
        />
        <Box sx={{
          width: '120px',
          height: '100%',
          position: 'absolute',
          top: '0',
          right: '0',
          zIndex: '10',
          background: 'linear-gradient(91.67deg, #111056 1.25%, rgba(14, 13, 107, 0) 98.45%)',
          transform: 'matrix(-1, 0, 0, 1, 0, 0)'
        }}
        />
      </Swiper>
    </Container>
  )
}

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin:auto;
  font-size: 14px;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 900;
`
