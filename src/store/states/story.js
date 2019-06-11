export default {
  label: [
    'Backend', 'Frontend', 'MVP'
  ],
  priority: [
    'Must have', 'Should have', 'Could have', 'Won\'t have'
  ],
  dictionary: {
    'constructions': [
      '[beginning][user-type][static-text="I can"][custom][static-text="so that"][custom]',
      '[beginning][requirement-type][static-text="called"][field]',
      '[beginning][custom]',
    ],
    'beginning': [
      'As a ...',
      'Requires a ...',
      'When I ...'
    ],
    'requirement-type': [
      'Model',
      'Field',
      'Page',
      'API endpoint'
    ],
    'user-type': [
      'New User'
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
      'field': 'Field',
    },
  },
  custom: ['Custom Text']
};
