<template>
  <div>
    <div class="sidebar__title sidebar__title--centered">{{ title }}</div>
    <v-list>
      <v-list-tile v-for="(item, key) in list" :key="key"
                   @click="() => $emit('click', key)">
        <v-list-tile-content>
          <v-list-tile-title class="sidebar__icon"
                             :class="{'sidebar__icon--active': activeIcon === key}">
            <v-icon v-if="item">{{ key }}</v-icon>
            <component :is="key" v-else />
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import TechnicalRequirementsIcon from "../icons/TechnicalRequirements";
import FunctionalRequirementsIcon from "../icons/FunctionalRequirements";
import BookIcon from "../icons/Book";
import SitemapIcon from "../icons/Sitemap";

export default {
  name: "IconList",
  props: [
    "title",
    "list",
    "activeIcon"
  ],
  components: {
    BookIcon,
    SitemapIcon,
    TechnicalRequirementsIcon,
    FunctionalRequirementsIcon
  }
};
</script>
