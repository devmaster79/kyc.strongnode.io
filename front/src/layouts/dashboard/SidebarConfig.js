import SvgIconStyle from '../../components/SvgIconStyle';

const getIcon = (name) => (
  <SvgIconStyle
    src={`/icons/${name}.svg`}
    sx={{
      width: '32px',
      height: '32px',
      background: 'white',
      filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
    }}
  />
);

const sidebarConfig = [
  {
    items: [
      { title: 'Dashboard', path: '/dashboard/app', icon: getIcon('booster') }
    ],
    subheader:'dashboard'
  }
];

export default sidebarConfig;
