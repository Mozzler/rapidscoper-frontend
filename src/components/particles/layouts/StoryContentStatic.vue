<template>
<div class="content-container">
  <v-layout align-start justify-center row fill-height>
    <div class="content" ref="scrollable-layout">
      <h1 class="content-container__header">user stories</h1>
      <story-static
        v-for="item in sections('user')"
        :key="item.id"
        :id="item.id" />

      <h1 class="content-container__header">technical stories</h1>
      <story-static
        v-for="item in sections('technical')"
        :key="item.id"
        :id="item.id" />

      <h1 class="content-container__header">summary</h1>
      <div class="user-story__block">
        <h1> Estimate for priorities </h1>
        <div class="mt-3 user-story__wysiwyg">
          Time estimate for each priority.
        </div>
        <summary-list
          collection="priority" />
      </div>
<!--
      <div class="user-story__block">
        <h1> Estimate for labels </h1>
        <div class="mt-3 user-story__wysiwyg">
          Time estimate for each label.
        </div>
        <summary
          :id="item.id"
          :collection="'labels'" />
      </div>-->
    </div>
  </v-layout>
</div>
</template>

<script>
import StoryStatic from "../../particles/layouts/StoryStatic";
import SummaryList from "../../particles/lists/Summary";

import { mapGetters } from 'vuex';

export default {
  name: "StoryContentPublic",
  components: {
    StoryStatic,
    SummaryList
  },
  computed: {
    ...mapGetters({
      sections: 'projectVersion/sections'
    })
  }
};
</script>
