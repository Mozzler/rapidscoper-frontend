<template>
  <div ref="hint"
       v-show="visible"
       :tabindex="0"
       @keydown.tab.exact="$event => tabComplete($event, items[focused])"
       @keydown.up.exact="$event => navigate($event, -1)"
       @keydown.down.exact="$event => navigate($event, 1)"
       @keydown.esc.exact="hide"
       class="hint">
    <div class="hint__item"
         v-for="(item, index) in items"
         :key="index"
         :class="{'hint__item--active': focused === index}"
         @click="() => complete(item)">
      <span class="hint__item-text">{{ item }}</span>
    </div>
    <div class="hint__item hint__bordered"
         v-if="filter && !inList"
         @click="() => complete(filter)">
      <span class="text-bold">Ctrl + Enter</span> to create "{{ filter }}"
    </div>
  </div>
</template>

<script>
import HintMixin from "@/mixins/wysiwyg/hint";

export default {
  name: "Hint",
  mixins: [
    HintMixin
  ],
  data () {
    return {
      visible: false,
      focused: 0
    };
  },
  mounted () {
    this.$root.$on('set-hint-state', this.setHintState);
    this.$root.$on('complete-hint', this.complete);
  },
  methods: {
    hide ($event) {
      $event.preventDefault();

      this.visible = false;
      this.$root.$emit('set-focus-to-input', this.input);
    },
    tabComplete ($event, value) {
      $event.preventDefault();
      this.complete(value);
    },
    setHintState (visible, chapter = null, filter = null, input = null, position = null, focus = false) {
      Object.assign(this.$refs.hint.style, {
        left: (position.left + 56) + 'px',
        top: (position.top - 65) + 'px'
      });

      this.visible = visible;
      this.chapter = chapter;
      this.filter = filter;
      this.input = input;

      this.$nextTick(() => {
        this.$refs.hint.focus();
      });
    },
    navigate ($event, step) {
      $event.preventDefault();
      step = this.focused + step;

      if (step === this.items.length) {
        step = 0;
      }
      if (step < 0) {
        step = this.items.length - 1;
      }

      this.focused = step;
    }
  },
  beforeDestroy () {
    this.$root.$off('set-hint-state');
    this.$root.$off('complete-hint');
  }
};
</script>
