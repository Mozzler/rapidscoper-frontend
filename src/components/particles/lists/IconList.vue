<template>
  <div class="navigation">
    <div class="navigation__title text-xs-center">{{ title }}</div>
    <v-list>
      <v-list-tile v-for="(item, key) in list" :key="key">
        <v-list-tile-content>
          <v-list-tile-title class="navigation__icon"
                             @click="() => $emit('update')">
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
    "list"
  ],
  components: {
    BookIcon,
    SitemapIcon,
    TechnicalRequirementsIcon,
    FunctionalRequirementsIcon
  }
};
</script>
