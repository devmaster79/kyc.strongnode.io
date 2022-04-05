import styled from '@emotion/styled'

export const TableWrapper = styled.div`
  overflow: auto;
  height: 400px;
`

export const Table = styled.table`
  color: ${props => props.theme.palette.text.primary};
  background-color: ${props => props.theme.palette.background.secondary};
  width: 100%;
  border-collapse: collapse;

  tr {
    height: 72px;
    border-top: 1px solid ${props => props.theme.palette.border.light};
  }

  tr:first-child {
    border-top: 0px;
  }

  th {
    text-align: left;
    text-transform: uppercase;
    color: ${props => props.theme.palette.text.secondary};
  }
`
