import styled from '@emotion/styled'
import Icon from '@ui/Icon/Icon';
import { useState } from 'react';
import { useTheme } from '@mui/styles'

export type SelectProps = {
  options: any,
  trackBy: string,
  searchBy: string,
  value: any,
  handleChange: Function
}

function Select(props: SelectProps) {
  const [opened, setOpened] = useState(false);

  function onSelectValue(event: any): void {
    const selected = props.options.find((option:any) => option[props.trackBy] === event.target.value.toString());
    props.handleChange(selected);
    setOpened(false);
  }
  const theme: any = useTheme();

  return <SelectWrapper>
    <HeaderWrapper onClick={() => setOpened(!opened)}>
      <span>{ props.value ? props.value[props.searchBy]  : 'Select' } </span>
      <Icon name="arrowDown" width={8} height={6} viewBox="0 0 8 6" style={opened ? { transform: 'rotate(180deg)',   transition: '450ms ease'} : { transition: '450ms ease' }} color={theme.palette.text.primary}  />
    </HeaderWrapper>
    { opened && <OptionsWrapper>
      <ul>
        { props.options.map((option: any) =>
        <li key={option[props.trackBy]} value={option[props.trackBy]} className={props.value && option[props.trackBy] === props.value[props.trackBy] ? 'active' : ''} onClick={onSelectValue}>
          { option[props.searchBy] }
        </li>
        )}
      </ul>
    </OptionsWrapper>}
  </SelectWrapper>;
}
export default Select;

Select.defaultProps = {
  trackBy: 'value',
  searchBy: 'label'
}

const SelectWrapper = styled.div`
  width: fit-content;
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  span {
    padding-right: 8px;
  }
`

const OptionsWrapper = styled.div`
  background: ${props => props.theme.palette.background.secondary};
  border: 1px solid ${props => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 10px;

  color:  ${props => props.theme.palette.text.secondary};
  text-align: left;
  padding: 24px;

  position: absolute;
  margin-top: 10px;

  .active {
    color:  ${props => props.theme.palette.text.primary};
  }

  ul {
    list-style-type: none;

    li {
      cursor: pointer;
    }
  }
`

