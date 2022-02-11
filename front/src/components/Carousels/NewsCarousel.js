import Slider from 'react-slick';
import { useRef, useEffect, useState } from 'react';
// material
import useTheme from '@material-ui/core/styles/useTheme';
import styled from '@material-ui/core/styles/styled';
import Box from '@material-ui/core/Box';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import SvgIconStyle from 'components/SvgIconStyle';
//
import { CarouselControlsPaging2 } from './controls';

const SBButton = styled(Button)`
  background: #aa1fec;
  box-shadow: 4px 12px 10px rgba(0, 0, 0, 0.5);
  border-radius: 30px;
  border: none;
  font-size: 14px;
  font-family: 'Halyard-Book';
  width: 150px;
  height: 58px;
`;

const SB2Button = styled(SBButton)`
  color: #1df4f6;
  background: transparent;
  box-shadow: none;
`;

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
    borderRadius: theme.shape.borderRadiusMd
  }
}));

function CarouselItem({ item }) {
  console.log(item);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Stack direction="row" spacing={3} sx={{ width: '100%', height: 106, objectFit: 'cover' }}>
        <Box component="img" src={item.imgInfo.url} alt="carousel" />
        <Stack justifyContent="space-between" sx={{ position: 'relative' }} flexGrow={1}>
          <Typography variant="h5" color="text.primary">
            {item.imgInfo.title}
          </Typography>
          <a href={item.imgInfo.link} sx={{ fontSize: 14 }} style={{ color: 'white' }}>
            {item.imgInfo.link}
          </a>
          <Box display="flex" justifyContent="right">
            <SB2Button
              onClick={() => setOpen(!open)}
              endIcon={<SvgIconStyle src="/icons/arrow-right.svg" sx={{ width: 8, height: 12 }} />}>
              {open ? 'Read Less' : 'Read More'}
            </SB2Button>
          </Box>
        </Stack>
      </Stack>
      {open && (
        <Stack sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 14 }} color="text.primary">
            Description : {item.description}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary">
            LastBuildDate : {item.lastbuild}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary">
            Language : {item.language}
          </Typography>
        </Stack>
      )}
    </>
  );
}

export default function NewsCarousel() {
  const [news, setNews] = useState();
  const getRss = async () => {
    const res = await fetch(`https://api.allorigins.win/get?url=${'https://strongnode.io/feed/'}`);
    const { contents } = await res.json();
    const feed = new window.DOMParser().parseFromString(contents, 'text/xml');
    console.log(feed);
    const items = feed.querySelectorAll('image');
    const descriptions = feed.querySelectorAll('description');
    const lastbuild = feed.querySelectorAll('lastBuildDate');
    const languages = feed.querySelectorAll('language');
    let feedItems = [];
    items.forEach((each, i) => {
      feedItems.push({
        mainImg: each,
        imgInfo: {
          url: each.querySelector('url').innerHTML,
          title: each.querySelector('title').innerHTML,
          link: each.querySelector('link').innerHTML,
          width: each.querySelector('width').innerHTML,
          height: each.querySelector('height').innerHTML
        },
        description: descriptions[i].innerHTML,
        lastbuild: lastbuild[i].innerHTML,
        language: languages[i].innerHTML
      });
    });

    console.log(feedItems);
    setNews(feedItems);
  };
  useEffect(() => {
    getRss();
  }, []);

  const theme = useTheme();
  const carouselRef = useRef();

  const settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselControlsPaging2({
      sx: { mt: 3 }
    })
  };

  const handlePrevious = () => {
    carouselRef.current.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current.slickNext();
  };

  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        {news && news.map((item, index) => <CarouselItem item={item} key={index} />)}
        {/* {news &&
          <CarouselItem item={news} />
        } */}
      </Slider>
    </RootStyle>
  );
}
