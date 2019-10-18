<template>
  <div>
    <div v-if="!stub" class="user-story__placeholder text-greyed">
      {{ placeholder }}
    </div>
    <div v-html="word" ref="field"
         :contenteditable="true"
         :class="`user-story__editable ${cls}`"
         @input="input"
         @focus="() => $emit('focus')"
         @keydown.enter.exact.prevent="($event) => $emit('enter', $event.target.innerHTML)"
         @blur="($event) => $emit('blur', $event.target.innerHTML)"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'DictionaryInput',
  props: {
    model: {
      type: [String, null],
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    cls: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      word: this.model,
      stub: this.model
    };
  },
  methods: {
    input ($event) {
      this.stub = $event.target.innerHTML;
    }
  },
  watch: {
    model () {
      this.word = this.model;
      this.stub = this.model;
    }
  }
};
</script>
