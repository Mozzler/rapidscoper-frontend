<template>
<div class="content-container">
  <v-layout align-start justify-center row fill-height>
    <div class="content" ref="scrollable-layout">
      <stories />

      <h1 class="content-container__header mt-3">summary</h1>
      <div class="user-story__block">
        <h1> Estimate for priority </h1>
        <div class="mt-3 user-story__wysiwyg">
          Time estimate for each priority.
        </div>
        <summary-list
          total="true"
          collection="priority" />
      </div>
      <div class="user-story__block">
        <h1> Estimate for labels </h1>
        <div class="mt-3 user-story__wysiwyg">
          Time estimate for each label.
        </div>
        <summary-list
          label-cls="tool-block__label rounded"
          collection="labels" />
      </div>

      <h1 class="content-container__header">dictionary</h1>
      <dictionary-static />
    </div>
  </v-layout>
</div>
</template>

<script>
import DictionaryStatic from "../../particles/layouts/DictionaryStatic";
import SummaryList from "../../particles/lists/Summary";
import Stories from "../../particles/public/Stories";

export default {
  name: "StoryContentPublic",
  components: {
    SummaryList,
    DictionaryStatic,
    Stories
  }
};
</script>
