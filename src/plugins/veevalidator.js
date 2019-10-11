import Vue from 'vue';
import VeeValidate from 'vee-validate';

const dictionary = {
  en: {
    attributes: {
      'confirmation': 'password',
      'password_confirmation': 'password',
      'phone': 'Phone number'
    }
  }
};

export default Vue.use(VeeValidate, {
  events: 'blur',
  dictionary: dictionary
});
