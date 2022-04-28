import styled from '@emotion/styled';
import Icon, { IconProps } from '@ui/Icon/Icon';

const IconInfo = {
  plus: {
    width: 12,
    height: 12,
    color: 'linear-gradient(90.39deg, #AA1FEC 0.24%, #7A3BFE 101.6%);',
    viewBox: '0 0 12 12'
  },
  edit: {
    width: 10,
    height: 10,
    color: '#141343',
    viewBox: '0 0 10 10'
  },
  prev: {
    width: 6,
    height: 8,
    color: 'white',
    viewBox: '0 0 6 8'
  },
  next: {
    width: 6,
    height: 8,
    color: 'white',
    viewBox: '0 0 6 8'
  }
};

export default function CircleButton(props: { name: IconProps['name'] }) {
  const data = Object.entries(IconInfo).find((obj) => obj[0] === props.name)?.[1];

  const Container = styled.div`
    display: flex;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background: ${data?.color};
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  `;
  return (
    <Container>
      <Icon name={props.name} width={data?.width} height={data?.height} viewBox={data?.viewBox} />
    </Container>
  );
}
