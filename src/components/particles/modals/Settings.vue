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
                :class="`label__item label--${type(item.label)}`"
                :key="index">
                <div>
                  <span>{{ item.label }}</span>
                </div>
                <div>
                  <v-menu v-model="item.show"
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
                           :class="{'palette__item--action': item.selected === color}"
                           :key="index"
                           :style="`background: ${color}`">
                        <v-icon v-if="item.selected === color">
                          check
                        </v-icon>
                      </div>
                      <div class="palette__item palette__item--action text-white">
                        <v-icon>delete</v-icon>
                      </div>
                    </div>
                  </v-menu>
                </div>
              </v-layout>
              <v-layout class="label__item label--outline label--grey">
                <div>
                  <span>Create new label</span>
                </div>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row mt-4 justify-end>
            <v-btn class="btn-rapid mr-3" large outline
                   @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="save">
              Save
            </v-btn>
          </v-layout>
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
    this.list = [...this.labels].map(item => {
      return {
        selected: '#FE9BA5',
        label: item,
        show: false
      };
    });
  },
  computed: {
    ...mapGetters({
      labels: 'story/labels'
    }),
  },
  methods: {
    save () {

    },
    initData () {

    }
  }
};
</script>
