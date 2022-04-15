import { FunctionComponent } from 'react'

export const withAttrs = <Props, >(Comp: FunctionComponent<Props>, attrs: Props) => {
  const CompWithAttrs = (props: Props) => {
    return <Comp {...attrs} {...props} />
  }
  CompWithAttrs.displayName = Comp.displayName + 'WithAttrs'
  return CompWithAttrs
}
