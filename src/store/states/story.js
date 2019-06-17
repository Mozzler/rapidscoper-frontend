export default {
  label: [
    'Backend', 'Frontend', 'MVP'
  ],
  priority: [
    'Must have', 'Should have', 'Could have', 'Won\'t have'
  ],
  dictionary: {
    'constructions': {
      'As a ...': '[beginning][user-type][static-text="I can"][custom][static-text="so that"][custom]',
      'Requires a ...': '[beginning][requirement-type][static-text="called"][field]',
      'When I ...': '[beginning][custom][static-text="then I"][custom]'
    },
    'requirement-type': [
      'Model',
      'Field',
      'Page',
      'API endpoint'
    ],
    'user-type': [
      'New User',
      'Registered User',
      'Admin User'
    ],
    'field': [
      'Email',
      'Account',
      'First Name',
      'Last Name'
    ],
    'placeholders': {
      'user-type': 'User Type',
      'requirement-type': 'Requirement Type',
      'field': 'Field'
    }
  },
  custom: [
    'Custom Text'
  ],
  adjustConstructions: {}
};
