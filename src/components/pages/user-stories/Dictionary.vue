<template>
  <div class="stories-container--short">
    <div class="header">
      <span>Dictionary</span>
    </div>
    <story-sidebar />
    <story-section />

    <div class="content-container">
      <v-layout align-start justify-center row fill-height>
        <div class="content" ref="scrollable-layout">
          <div class="user-story__block"
               v-for="section in dictionary"
               :key="section.id">
              <h1>
                <input class="user-story__editable"
                   :disabled="section.type !== 'requirement'"
                   :value="section.name"
                   :ref="section.id"
                   @input="$event => updateSectionName(section.id, $event)"
                   @blur="() => update(section.id, 'name')" />
              </h1>
              <div class="user-story dictionary mt-4">
                <template v-if="section.list.length">
                  <v-layout row fill-height
                            v-for="word in section.list"
                            :key="word.id">

                    <v-flex shrink>
                      <div class="user-story__placeholder text-greyed">
                        {{ !word.name ? 'Terms' : '' }}
                      </div>
                      <div class="user-story__editable user-story__editable--after"
                        v-html="word.name"
                        :contenteditable="true"
                        :ref="word.id"
                        @blur="() => update(word.id, 'name')"
                      ></div>
                    </v-flex>
                    <v-flex grow text-xs-left>
                      <div class="user-story__placeholder text-greyed">
                        {{ !word.description ? 'Description' : '' }}
                      </div>
                      <div class="user-story__editable"
                           v-html="word.description"
                           :contenteditable="true"
                           :ref="word.id"
                           @blur="() => update(word.id, 'description')"
                      ></div>
                    </v-flex>
                  </v-layout>
                </template>
                <template v-else>
                  <div class="text-greyed full-width text-sm-center">
                    The list of items is empty
                  </div>
                </template>

            </div>
          </div>
        </div>
      </v-layout>
    </div>
  </div>
</template>

<script>
import StorySidebar from "../../particles/navigation/USidebar";
import StorySection from "../../particles/navigation/StorySection";

export default {
  name: "Dictionary",
  components: {
    StorySidebar,
    StorySection
  },
  data () {
    return {
      processing: false,
      item: {
        field: null,
        description: null
      }
    };
  },
  computed: {
    dictionary () {
      return this.$store.getters['dictionary/items'];
    },
    activeProjectId () {
      return this.$route.params.projectId;
    },
    filter () {
      return {
        $or: [
          { 'fullDocument.projectId': { '$in': [ this.activeProjectId ] } }
        ]
      };
    }
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    updateSectionName (id, $event) {
      this.$store.commit('dictionary/update', {
        id: id,
        name: $event.target.value
      });
    },
    fetchData () {
      this.processing = true;
      this.connect('dictionary', 'entity/setList', this.filter, true, () => {
        this.processing = false;
      });
    },
    update (id, property) {
      this.submit(id, { [property]: this.$refs[id][0].innerText });
    },
    submit (id, data) {
      this.$store.dispatch('entity/update', {
        params: {
          id: id
        },
        entity: 'dictionary',
        data: data
      });
    }
  }
};
</script>
