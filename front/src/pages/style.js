import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const EntryPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  background: url('/images/background.png');
  background-size: 100% 100%;
  &:before {
    content: url('/images/signlogo.png');
    margin: 50px 0px;
  }
`;

export const PageHeader = styled(Link)`
  font-size: 2rem;
  font-weight: 600;
  margin: 40px 0;
  color: inherit;
`;
