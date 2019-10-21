<template>
  <div v-if="visible"
       :class="`rapid-alert ${cls}`"
       @click="clickable ? hide : null">
    {{ message }}
    <v-layout align-end justify-end row fill-height
              class="mt-3"
              v-if="btnShow">
      <div class="text-reference" @click="hide"> Skip </div>
      <div class="text-reference ml-3" @click="nextIntroChapter"> Next </div>
    </v-layout>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'alert',
  props: {
    message: {
      type: String,
      default: null
    },
    cls: {
      type: String,
      default: 'rapid-alert--warning'
    },
    clickable: {
      type: Boolean,
      default: true
    },
    btnShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: !!this.message
    };
  },
  methods: {
    ...mapMutations('introduction', [
      'nextIntroChapter'
    ]),
    hide () {
      this.visible = false;
    }
  },
  watch: {
    message () {
      this.visible = !!this.message;
    }
  }
};
</script>
