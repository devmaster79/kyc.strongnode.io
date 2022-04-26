import styled from '@emotion/styled';

export const Card = styled.div`
  background: ${(props) => props.theme.palette.background.light};
  color: ${(props) => props.theme.palette.text.primary};
  padding: 8px;
  border: 1px solid ${(props) => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 8px;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 900;
  font-size: 14px;
  line-height: 19px;
  width: fit-content;
  margin-right: 16px;
  margin-bottom: 40px;

  img {
    width: 280px;
    height: 240px;
    border-radius: 10px;
  }
`;

export const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    padding: 16px;
    display: flex;
    flex-direction: column;
    font-weight: 900;
  }

  span {
    font-family: 'Satoshi-Regular';
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;
