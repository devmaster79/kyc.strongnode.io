import styled from '@emotion/styled'

export const TableWrapper = styled.div({
  overflow: 'auto',
  height: '400px'
})

export const Table = styled.table((props) => ({
  color: props.theme.palette.text.primary,
  backgroundColor: props.theme.palette.background.primary,
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
