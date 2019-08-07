<template>
  <div class="user-story__block">
    <h1>
      {{ model.name }}
    </h1>
    <div class="mt-3 user-story__wysiwyg">
      {{ model.description }}
    </div>
    <div class="sidebar__title mt-4 mb-3 padding-0">
      user stories
    </div>
    <div class="user-story" v-for="item in model.list" :key="item.id">
      <v-layout align-center row fill-height>
        <v-flex shrink mr-1>
          <div :class="`user-story__item user-story__item--${ item.level }`">
            <v-layout align-center fill-height>
              <v-flex grow>
                <v-layout row
                          align-center
                          fill-height
                          class="user-story__prefix">
                  <div>#</div>
                </v-layout>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
        <v-flex grow text-xs-left align-center row fill-height>
          <div class="user-story__wysiwyg">
            <div class="user-story__editable" v-html="item.markup"></div>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  name: "StoryStatic",
  props: {
    id: {
      required: true
    }
  },
  computed: {
    model () {
      return this.$store.getters['projectVersion/section'](this.id);
    }
  }
};
</script>
