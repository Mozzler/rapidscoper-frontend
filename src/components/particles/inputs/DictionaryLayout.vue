<template>
  <div class="content-container">
    <v-layout align-start justify-center row fill-height>
      <div class="content" ref="scrollable-layout">
        <div class="user-story__block"
             v-for="section in dictionary"
             :key="section.id">

          <v-layout row fill-height align-center mt-2>
            <v-flex>
              <h1>
                <input class="user-story__editable"
                       :disabled="section.type !== 'requirement'"
                       :value="section.name"
                       :ref="section.id"
                       @input="$event => updateSectionName(section.id, $event)"
                       @blur="() => update(section.id, 'name', false, section.name)" />
              </h1>
            </v-flex>
            <v-flex shrink v-if="deletable(section)">
              <div @click="() => remove(section.id)">
                <v-icon class="remove-icon remove-icon--header" small> delete </v-icon>
              </div>
            </v-flex>
          </v-layout>
          <div class="dictionary user-story mt-3">
            <template v-if="section.list.length">
              <v-layout class="position-relative"
                        row fill-height mt-2
                        v-for="word in section.list"
                        :key="word.id"
                        :class="{
                          'user-story--active m-0': focused === word.id
                        }">
                <v-flex shrink v-if="!word.storyCount">
                  <div @click="() => remove(word.id)">
                    <v-icon class="remove-icon" small> delete </v-icon>
                  </div>
                </v-flex>
                <v-flex shrink>
                  <div class="user-story__editable user-story__editable--after text-bold"
                       v-html="word.name"
                       :contenteditable="true"
                       :ref="`name-${word.id}`"
                       @input="$event => input($event, word.id, 'name')"
                       @focus="() => focus(word.id, 'name')"
                       @keydown.enter.exact.prevent="() => update(word.id, 'name', true)"
                       @blur="() => update(word.id, 'name')"
                  ></div>
                </v-flex>
                <v-flex text-xs-left wrap>
                  <div class="user-story__placeholder text-greyed">
                    {{ !word.description  ? 'It is a description of this term' : '' }}
                  </div>
                  <div class="user-story__editable word-break-word"
                       v-html="word.description"
                       :contenteditable="true"
                       :ref="`description-${word.id}`"
                       @input="$event => input($event, word.id, 'description')"
                       @focus="() => focus(word.id, 'description')"
                       @keydown.enter.exact.prevent="() => update(word.id, 'description', true)"
                       @blur="() => update(word.id, 'description')"
                  ></div>
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
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "DictionaryLayout",
  data () {
    return {
      processing: false,
      item: {
        field: null,
        description: null
      },
      focused: null
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
    },
    order () {
      return _.chain(this.dictionary)
        .map(item => item.list)
        .flatten()
        .map(item => item.id)
        .value();
    }
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    deletable (section) {
      let used = _.find(section.list, item => item.storyCount),
          basic = ['Actor', 'Others'].includes(section.name);

      return (!section.list.length || !used) && !basic;
    },
    input ($event, id, property) {
      this.$store.commit('entity/update', {
        entity: 'dictionary',
        data: {
          id: id,
          [property]: $event.target.innerText
        }
      });

      this.collapseToEnd();
    },
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
    async update (id, property, next = false, input = this.$refs[`${property}-${id}`][0].innerText) {
      this.processing = id;
      await this.submit(id, { [property]: input });
      this.processing = false;

      if (!next) {
        return;
      }

      this.$nextTick(() => {
        if (property === 'name') {
          this.$refs[`description-${id}`][0].focus();
        } else {
          let index = _.findIndex(this.order, item => item === id);
          let nextId = index + 1 < this.order.length ? this.order[index + 1] : this.order[0];

          this.$refs[`name-${nextId}`][0].focus();
        }

        this.collapseToEnd();
      });
    },
    submit (id, data) {
      return this.$store.dispatch('entity/update', {
        params: {
          id: id
        },
        entity: 'dictionary',
        data: data
      });
    },
    focus (id) {
      this.focused = id;
    },
    remove (id) {
      const data = {
        entity: 'dictionary',
        id: id
      };

      this.$store.commit('entity/delete', data);
      this.$store.dispatch('entity/delete', data);
    }
  }
};
</script>
