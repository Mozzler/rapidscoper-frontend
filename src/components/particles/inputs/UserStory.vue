<template>
  <div class="user-story">
    <div v-for="(item, index) in list"
         :key="index">

      <div class="user-story__tools"
           v-if="collection">
        <tool-list
          :list="collection"
          :label-cls="'tool-block__label--minified'" />
      </div>

      <wysiwyg
        :model="item.text"
        :level="item.level"
        @update-text="value => item.text = value">

        <template #estimate>
          <input class="estimation__input"
                 v-if="tab === 'estimates'"
                 v-model="item.estimation" />
        </template>
      </wysiwyg>
    </div>

    <hint />
  </div>
</template>

<script>
import ToolList from "../lists/ToolList";
import Wysiwyg from "./Wysiwyg";
import Hint from "../lists/Hint";

export default {
  name: "UserStory",
  components: {
    ToolList,
    Wysiwyg,
    Hint
  },
  props: {
    model: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      list: this.model
    };
  },
  computed: {
    tab () {
      return this.$route.params.tab;
    },
    collection () {
      return this.$store.state.story[this.tab];
    }
  }
};
</script>
