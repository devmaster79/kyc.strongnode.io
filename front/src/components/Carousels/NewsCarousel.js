import Slider from 'react-slick'
import { useRef } from 'react'
// material
import { useTheme, styled } from '@material-ui/core/styles'
import { Box, Stack, Typography } from '@material-ui/core'
//
import { CarouselControlsPaging2 } from './controls'

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
    borderRadius: theme.shape.borderRadiusMd,
  },
}))

function CarouselItem() {
  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{ width: '100%', height: 106, objectFit: 'cover' }}
    >
      <Box component="img" src="/images/carousel1.png" alt="carousel" />
      <Stack justifyContent="space-between">
        <Typography variant="h5">
          A new Chapter for Dshop-Giving Control to the Community
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          A new Chapter for Dshop-Giving Control to the Community Since the
          launch of Origin’s Dshop platform
        </Typography>
      </Stack>
    </Stack>
  )
}

export default function CarouselBasic3() {
  const theme = useTheme()
  const carouselRef = useRef()

  const settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselControlsPaging2({
      sx: { mt: 3 },
    }),
  }

  const handlePrevious = () => {
    carouselRef.current.slickPrev()
  }

  const handleNext = () => {
    carouselRef.current.slickNext()
  }

  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        {[...Array(15)].map((_, index) => (
          <CarouselItem key={index} />
        ))}
      </Slider>
    </RootStyle>
  )
}
