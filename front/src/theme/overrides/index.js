import merge from 'lodash/merge';
import Lists from './Lists';
import Button from './Button';

export default function ComponentsOverrides(theme) {
  return merge(Lists(theme), Button(theme));
}
