import Slider from 'react-slick'
import { useRef, useEffect, useState } from 'react'
import axios from 'utils/axios'
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

function CarouselItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        sx={{ width: '100%', height: 106, objectFit: 'cover' }}
      >
        <Box component="img" src="/images/carousel1.png" alt="carousel" />
        <Stack
          justifyContent="space-between"
          sx={{ position: 'relative' }}
          flexGrow={1}
        >
          <Typography variant="h5" color="text.primary">
            {item.title}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary">
            {item.description}
          </Typography>
          <Typography
            onClick={() => setOpen(!open)}
            color="primary"
            variant="h6"
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              cursor: 'pointer',
            }}
          >
            {open ? 'Read Less' : 'Read More'}
          </Typography>
        </Stack>
      </Stack>
      {open && (
        <Stack sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 14 }} color="text.primary">
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit ametLorem ipsum
            dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit
            ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum
            dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit
            ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum
            dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit
            ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum
            dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit
            ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum
            dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit
            ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum
            dolor sit amet
          </Typography>
        </Stack>
      )}
    </>
  )
}

const item = { title: 'adsfadf', description: 'wowadsfasdfasdfasdasdfasd' }
export default function NewsCarousel() {
  const [news, setNews] = useState()
  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem('token')

      const url = process.env.REACT_APP_BASE_URL + '/api/news'
      console.log('server url: ', url)
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setNews(result.data)
    }
    fetch()
  }, [])

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
        {/* {news &&
          news.map((item, index) => <CarouselItem item={item} key={index} />)} */}
        <CarouselItem item={item} />
      </Slider>
    </RootStyle>
  )
}
