import Lists from './Lists';
import Button from './Button';
import { Theme } from '@mui/material/styles';

export default function ComponentsOverrides(theme: Theme) {
  return {
    ...Lists(theme),
    ...Button(theme)
  };
}
