export default {
  isMobileDevice: false,
  sidebarFilter: true,
  periods: ['Unexpired', '1 day', '2 days', '3 days', '7 days'],
  roles: ['Manager', 'Member', 'Client'],
  permissions: [{
    name: 'View only',
    type: 'view'
  }, {
    name: 'View + Comment',
    type: 'view_comment'
  }, {
    name: 'Full access',
    type: 'full'
  }]
};
