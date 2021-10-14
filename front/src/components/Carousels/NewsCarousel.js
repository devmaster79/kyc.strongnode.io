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
        <Box component="img" src={item.imgInfo.url} alt="carousel" />
        <Stack
          justifyContent="space-between"
          sx={{ position: 'relative' }}
          flexGrow={1}
        >
          <Typography variant="h5" color="text.primary">
            {item.imgInfo.title}
          </Typography>
          <a href={item.imgInfo.link} sx={{ fontSize: 14 }} color="text.primary">
            {item.imgInfo.link}
          </a>
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


export default function NewsCarousel() {
  const [news, setNews] = useState()
  const getRss = async () => {
    const res = await fetch(`https://api.allorigins.win/get?url=${'https://strongnode.io/feed/'}`);
    const { contents } = await res.json();
    const feed = new window.DOMParser().parseFromString(contents, "text/xml");
    const items = feed.querySelectorAll("image");

    let feedItems = [];
    items.forEach((each) => {
      feedItems.push({
        'mainImg': each,
        'imgInfo': {
          'url': each.querySelector("url").innerHTML,
          'title': each.querySelector("title").innerHTML,
          'link': each.querySelector("link").innerHTML,
          'width': each.querySelector("width").innerHTML,
          'height': each.querySelector("height").innerHTML,
        }
      })
    })

    console.log(feedItems)
    setNews(feedItems);

  };
  useEffect(() => {
    getRss();
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
        {news &&
          news.map((item, index) => <CarouselItem item={item} key={index} />)}
        {/* {news &&
          <CarouselItem item={news} />
        } */}
      </Slider>
    </RootStyle>
  )
}
