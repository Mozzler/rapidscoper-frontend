export default {
  data () {
    return {
      dictionary: {
        'constructions': [
          '[beginning] [user-type] {I can} ... {so that} ...',
          '[beginning] [requirement-type] {called} [field]',
          '[beginning] ...'
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
        'custom': []
      }
    };
  },
  methods: {

  }
};
