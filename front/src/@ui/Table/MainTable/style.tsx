import styled from '@emotion/styled'

export const TableWrapper = styled.div({
  overflow: 'auto',
  flex: 1,
  height: '400px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
})

export const Table = styled.table((props) => ({
  width: '100%',
  borderCollapse: 'collapse',

  tr: {
    height: '72px',
    borderTop: `1px solid ${props.theme.palette.border.light}`
  },

  'tr:first-child': {
    borderTop: '0px'
  },

  th: {
    textAlign: 'left',
    textTransform: 'uppercase',
    color: props.theme.palette.text.secondary
  }
}))
