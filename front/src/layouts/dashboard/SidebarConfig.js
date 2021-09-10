import SvgIconStyle from '../../components/SvgIconStyle';

const getIcon = (name) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: '32px', height: '32px' }} />
);

const sidebarConfig = [
  {
    items: [
      { title: 'Dashboard', path: '/dashboard/app', icon: getIcon('booster')},
      { title: 'Member', path: '/dashboard/member', icon: getIcon('member')},
      { title: 'Growth', path: '/dashboard/growth', icon: getIcon('growth')},
      { title: 'Sync', path: '/dashboard/sync', icon: getIcon('sync')},
      { title: 'Shield', path: '/dashboard/shield', icon: getIcon('shield')},
    ]
  },

];

export default sidebarConfig;
