<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416" persistent>
      <v-card class="modal-card">

        <div class="modal-header">
          <h1>
            <v-layout row align-content-center fill-height justify-start>
              <v-flex>
                Label settings
              </v-flex>
            </v-layout>
          </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-layout row wrap fill-height>
            <v-flex>
              <v-layout row justify-space-between align-center
                v-for="(item, index) in list"
                class="label__item"
                :style="`background: ${item.colour}`"
                :key="index">
                <div>
                  <span>{{ index + 1 }}.&nbsp;</span>
                  <span
                    class="user-story__editable"
                    v-html="item.name"
                    contenteditable="true"
                    @blur="($event) => updateName($event, item)"
                    @keyup.enter.exact.prevent="null" />
                </div>
                <div>
                  <v-menu v-model="item.show"
                          :nudge-left="14"
                          :offset-y="true">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on"
                              class="label__button ">
                        arrow_drop_down
                      </v-icon>
                    </template>

                    <div class="palette text-sm-center">
                      <div v-for="(color, index) in colors"
                           class="palette__item"
                           :class="{'palette__item--action': item.colour === color}"
                           :key="index"
                           :style="`background: ${color}`"
                           @click="() => updateColor(item, color)">
                        <v-icon v-if="item.colour === color">
                          check
                        </v-icon>
                      </div>
                      <div class="palette__item palette__item--action text-white"
                        @click="() => remove(item.id)">
                        <v-icon>delete</v-icon>
                      </div>
                    </div>
                  </v-menu>
                </div>
              </v-layout>
              <v-layout
                class="label__item label--outline label--grey"
                v-if="list.length < 8">
                <div @click="createLabel">Create new label</div>
              </v-layout>
            </v-flex>
          </v-layout>
          <!---<v-layout row mt-4 justify-end>
            <v-btn class="btn-rapid mr-3" large outline
                   @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="save">
              Save
            </v-btn>
          </v-layout>-->
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

import ModalMixin from '@/mixins/modal';
import Dropdown from '../menus/Dropdown';

import Tools from '@/mixins/story';

export default {
  name: 'settings',
  components: {
    Dropdown
  },
  mixins: [
    ModalMixin,
    Tools
  ],
  data () {
    return {
      colors: [
        '#FE9BA5', '#D7AC8D', '#FADCA2', '#9BE1CA',
        '#9FCEF8', '#C4ABED', '#FAAAD5', '#E5E5E5'
      ],
      list: []
    };
  },
  beforeMount () {
    this.list = this.initData();
  },
  computed: {
    ...mapGetters({
      labels: 'story/labels',
      projectItems: 'entity/items'
    }),
    projects () {
      return this.projectItems('project');
    },
    project () {
      return _.find(this.projects, project => project.id === this.$route.params.projectId);
    }
  },
  methods: {
    save () {

    },
    initData () {
      return [...this.labels].map(item => {
        const props = _.pick(item, 'id', 'name');
        return {
          ...props,
          colour: `#${item.colour}`,
          show: false
        };
      });
    },
    updateName ($event, item) {
      let payload = { name: $event.target.innerText };
      let params = { id: item.id };

      this.submit({ data: payload }, 'update', params);
    },
    updateColor (item, colour) {
      let payload = { colour: colour.replace('#', '') };
      let params = { id: item.id };

      item.colour = colour;
      this.submit({ data: payload }, 'update', params);
    },
    remove (id) {
      this.submit({ id: id }, 'delete');
    },
    createLabel () {
      this.submit({
        data: {
          type: 'label',
          colour: 'E5E5E5',
          name: 'Create new label',
          projectId: this.project.id,
          teamId: this.project.teamId
        }
      }, 'create');
    },
    submit (payload = {}, action, params = {}) {
      let data = {
        entity: 'dictionary',
        params: params,
        ...payload
      };

      this.$store.dispatch(`entity/${action}`, {
        ...data,
        cancelCommit: false
      });
    }
  },
  watch: {
    labels: {
      deep: true,
      handler () {
        this.list = this.initData();
      }
    }
  }
};
</script>
