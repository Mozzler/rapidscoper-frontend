<template>
  <v-layout column class="account-settings__section-form bottom-border">
    <v-flex xs12 class="signup-input"
            v-for="field in fields"
            :key="field.name">
      <div class="text-field__label" v-if="field.name">
        {{ field.name }}
      </div>
      <v-text-field
        v-validate="field.rules"
        v-model="items[field.prop]"
        :key="field.name"
        :name="field.name"
        :placeholder="field.name"
        :type="field.type"
        :error-messages="errors.first(field.name)"
        :disabled="processing"
        solo
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'TextField',
  props: {
    model: {
      type: Object,
      default: null
    },
    processing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: this.model,
      fields: null
    };
  },
  beforeMount () {
    this.generateFields();
  },
  methods: {
    generateFields () {
      this.fields = _.map(this.model, (item, key) => {
        return {
          prop: key,
          name: this.getNameByKey(key),
          type: this.getTypeByKey(key),
          rules: this.getRulesByKey(key)
        };
      });
    },
    getNameByKey (key) {
      return key
        .split(/(?=[A-Z])/)
        .map((item, index) => this.capitalized(item, index === 0))
        .join(' ');
    },
    getTypeByKey (key) {
      switch (key) {
        case 'firstName':
        case 'lastName':
          return 'text';
        case 'email':
          return 'email';
        case 'password':
          return 'password';
        default:
          return 'text';
      }
    },
    getRulesByKey (key) {
      switch (key) {
        case 'firstName':
        case 'lastName':
          return 'required|min:2|max:100';
        case 'email':
          return 'required|email|min:6|max:255';
        case 'password':
          return 'required|min:6|max:255';
        default:
          return '';
      }
    },
    capitalized (str, flag = false) {
      return flag ?
        str.charAt(0).toUpperCase() + str.slice(1) :
        str.toLowerCase();
    }
  },
  watch: {
    items: {
      deep: true,
      handler () {
        this.$emit('update', this.items);
      }
    }
  }
};
</script>
