<template>
  <div class="tool-section pt-4">
    <div class="section__title">
      comments
    </div>
    <div class="mt-3">
      <dropdown :list="dropdown" :selected="active"
                @update="value => active = value"/>
    </div>
    <v-divider horizontal></v-divider>

    <div class="comment">
      <v-layout row fill-height>
        <v-flex shrink mr-2>
          <img class="comment__img"
               src="@/assets/img/user1.png" />
        </v-flex>
        <v-flex grow>
          <v-layout column fill-height>
            <div class="font-weight-bold"> Jessie Simmons </div>
            <div class="comment__subtitle"> Today at 1:30 pm </div>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout fill-height row mt-2>
        <v-flex>
          <div class="comment__text">Change story to "sign via Google".</div>
          <div class="comment__subtitle">1 reply</div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Dropdown from "../menus/Dropdown";

export default {
  name: "Comments",
  components: {
    Dropdown
  },
  data () {
    return {
      dropdown: ['Active'],
      active: 'Active'
    };
  }
};
</script>
