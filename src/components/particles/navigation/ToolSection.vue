<template>
  <div class="tool-section pt-4">
    <div class="tool-block">
      <div class="section__title">
        ID
      </div>
      <div class="tool-section__text">
        S012
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Estimate
      </div>
      <div class="tool-block__text">
        2 hours
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Priority
      </div>
      <div class="tool-block__text">
        <tool-list
          :list="labels"
          :active="label" />
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Labels
      </div>
      <tool-list
        :list="priorities"
        :active="priority" />
    </div>

    <!--<div class="tool-block">
      <div class="section__title">
        Attachments
      </div>
      <div class="tool-block__text">
        <div class="tool-block__file">
          <v-layout align-center justify-center row fill-height>
            <v-icon>
              add
            </v-icon>
          </v-layout>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import ToolList from "../lists/ToolList";
export default {
  name: "ToolSection",
  components: {ToolList},
  data () {
    return {
      label: 1,
      priority: 1
    }
  },
  computed: {
    labels () {
      return this.$store.state.story.label;
    },
    priorities () {
      return this.$store.state.story.priority;
    }
  },
};
</script>

<style scoped>

</style>
