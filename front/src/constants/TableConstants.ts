export interface Column {
  id: string
  label: string
  align: string
}

export interface DataSet<Item> {
  items: Item[]
  total?: number
}

export interface Finder {
  onChange: (keyword: string) => void
  searchMaxRow?: number
}
export interface IDataIcon {
  name: string
  url: any
}

export interface IData {
  [key: string]: object
}
export interface OverwrittenFields {
  [key: string]: (icon: IDataIcon | IData) => Element | JSX.Element
}

export interface TableSectionProps<Item extends Record<string, unknown>> {
  comingSoon?: string
  title: string
  subtitle: string | undefined
  dataSet: DataSet<Item>
  columns: Column[]
  hideHeading?: boolean
  overwrittenFields?: Record<string, unknown>
  fetchData?: (p: number, p2: number) => void
  searchEnabled?: boolean
  searchColumn?: string
  finder?: Finder
}