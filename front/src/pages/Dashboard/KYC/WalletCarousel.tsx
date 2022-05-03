import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper'
import styled from '@emotion/styled'
import CircleButton from '@ui/Button/CircleButton'
import Icon from '@ui/Icon/Icon'

interface WalletInfoType {
  featureIcon: number
  label: string
  description: string
}

export function WalletCarousel(props: { walletProps: WalletInfoType[] }) {
  const walletsInfo = props.walletProps
  return (
    <Container>
      <div style={{ width: '100%', position: 'relative' }}>
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Swiper
            slidesPerView={3}
            spaceBetween={17}
            loop
            navigation={{
              prevEl: '.prev',
              nextEl: '.next'
            }}
            modules={[Navigation]}
            style={{ width: '100%' }}>
            {walletsInfo?.map((walletInfo: WalletInfoType, index: number) => (
              <SwiperSlide
                key={index}
                style={{
                  width: '248px',
                  height: '110px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '24px 0px 24px 0px'
                }}>
                <div style={{ paddingLeft: '24px' }}>
                  <Icon
                    name={'wallet'}
                    width={22}
                    height={26}
                    viewBox="0 0 22 22"
                  />
                  <div style={{ paddingTop: '46px' }}>
                    <div style={{ display: 'flex' }}>
                      {walletInfo.featureIcon ? (
                        <CircleButton name={'edit'} />
                      ) : (
                        <CircleButton name={'plus'} />
                      )}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          paddingLeft: '16px'
                        }}>
                        <div>{walletInfo.label}</div>
                        {walletInfo.description ? (
                          <div style={{ color: '#f3f3f3' }}>
                            {walletInfo.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div
              style={{
                width: '120px',
                height: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: '10',
                background:
                  'linear-gradient(91.67deg, #111056 1.25%, rgba(17, 16, 86, 0) 98.45%)'
              }}
            />
            <div
              style={{
                width: '120px',
                height: '100%',
                position: 'absolute',
                top: '0',
                right: '0',
                zIndex: '10',
                background:
                  'linear-gradient(91.67deg, #111056 1.25%, rgba(14, 13, 107, 0) 98.45%)',
                transform: 'matrix(-1, 0, 0, 1, 0, 0)'
              }}
            />
          </Swiper>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'absolute',
            zIndex: '20',
            top: '43%'
          }}>
          <div className="prev" style={{ cursor: 'pointer' }}>
            <CircleButton name="prev" />
          </div>
          <div className="next" style={{ cursor: 'pointer' }}>
            <CircleButton name="next" />
          </div>
        </div>
      </div>
    </Container>
  )
}

export const Container = styled.div`
  width: 824px;
  margin: auto;
  font-size: 14px;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 900;
  padding-top: 100px;
`
