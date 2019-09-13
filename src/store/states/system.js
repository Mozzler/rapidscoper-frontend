export default {
  isMobileDevice: false,
  sidebarFilter: false,
  storyViewMode: false,
  comment: {
    state: true,
    x: 0,
    y: 0,
    markup: '',
    item: null
  },
  periods: ['Unexpired', '1 day', '2 days', '3 days', '7 days'],
  roles: [{
    name: 'Manager',
    type: 'manager'
  }, {
    name: 'Member',
    type: 'member'
  }, {
    name: 'Client',
    type: 'client'
  }],
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
