export default {
  computed: {
    constructions() {
      return [
        /*'[beginning] [user-type] I can ... so that ...',
        '[beginning] [requirement-type] called [field]',
        '[beginning]'*/
        'As a [user-type] I can [] so that []',
        'Requires a [requirement-type] called [field]',
        'When I []'
      ];
    },
    users() {
      return [
        'New User'
      ];
    },
    requirements() {
      return [
        'Model',
        'Field',
        'Page',
        'API endpoint'
      ];
    },
    fields() {
      return [
        'Email',
        'Account',
        'First Name',
        'Last Name'
      ];
    },
    beginnings() {
      return [
        'As a ...',
        'Requires a ...',
        'When I ...'
      ]
    },
    completing () {
      if(this.active) {
        let element = this.list[this.active];

        if (!element.replacement) {
          return this.hint.list;
        }

        if(!this.hint.list) {
          return [];
        }

        return element.replacement && this.hint.list ? this.hint.list.filter(item => {
          return item.includes(element.replacement);
        }) : this.hint.list;
      }
      else {
        return this.hint.list;
      }
    },
  },
  methods: {
    complete (event, index) {
      const element = this.list[this.active];
      const completion = event.target.outerText.replace(' ...', ' ');

      if (!element.sentence) {
        element.value = completion;
        element.sentence = this.constructions[index];
      }
      else {
        let cls = `class="user-story__editable--${element.replacement}"`;
        element.value += `<span ${cls} contentEditable="false" readonly>${completion}</span>`;
      }
/*
      let cls = `class="user-story__editable--${element.replacement}"`;
      element.value += `<span ${cls} contentEditable="false" readonly>${completion}</span>`;*/

      this.hint.state = false;
      this.hint.list = null;
    },
    showCompleteDialog (event) {
      const hint = this.$refs.hint;

      this.hint.position = {
        top: event.srcElement.offsetTop + 20,
        left: event.srcElement.offsetLeft
      };

      Object.assign(hint.style, this.hint.position);
      this.hint.state = true;
    },
  }
}
