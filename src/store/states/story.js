export default {
  label: [
    '1. Backend', '2. Frontend', '3. MVP'
  ],
  priority: [
    'Must have', 'Should have', 'Could have', 'Won\'t have'
  ],
  dictionary: {
    'constructions': {
      'As a ...': '[beginning][actor][static-text="I can"][custom-1][static-text="so that"][custom-2]',
      'Requires a ...': '[beginning][requirement][static-text="called"][field]',
      'When I ...': '[beginning][custom-1][static-text="then I"][custom-2]'
    },
    'requirement-type': [
      'Model',
      'Field',
      'Page',
      'API endpoint'
    ],
    'actor': [
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
      'actor': 'User Type',
      'requirement-type': 'Requirement Type',
      'field': 'Field'
    }
  },
  adjustConstructions: {}
};
