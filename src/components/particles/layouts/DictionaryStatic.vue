<template>
  <div>
    <div v-if="dictionary.length">
      <div class="user-story__block"
        v-for="item in dictionary"
        :key="item.id"
        :id="item.id">
        <h1>{{ item.name }}</h1>
        <div class="dictionary user-story mt-3">
          <template v-if="item.list.length">
            <v-layout row fill-height mt-2
                      v-for="word in item.list"
                      :key="word.id">
              <v-flex shrink>
                <div
                  class="user-story__editable user-story__editable--after text-bold"
                  v-html="word.name" />
              </v-flex>
              <v-flex text-xs-left wrap>
                <div
                  class="user-story__editable word-break-word"
                  v-html="word.description" />
              </v-flex>
            </v-layout>
          </template>
          <template v-else>
            <div class="text-greyed full-width text-sm-center noprint">
              The list of items is empty
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-greyed full-width text-sm-center noprint">
        The list of dictionary phrases is empty
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DictionaryStatic",
  computed: {
    dictionary () {
      return this.$store.getters['projectVersion/dictionary'];
    }
  }
};
</script>
