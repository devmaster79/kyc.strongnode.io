import { merge } from 'lodash';
import Lists from './Lists';

export default function ComponentsOverrides(theme) {
  return merge(
    Lists(theme),
  );
}
