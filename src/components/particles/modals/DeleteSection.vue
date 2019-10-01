<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416" persistent
              @keydown.enter.prevent.exact="removeSection">
      <v-card class="modal-card">
        <circular-loader
          cls="loader-shadow--without-padding transparent"
          :size="50"
          :width="5"
          :visible="processing"
        />

        <div class="modal-header">
          <h1> Delete section </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-flex>
            <div class="mt-2 mb-3 text-size--16-normal">
              Are you sure you want to delete
              <span class="text-primary text-bold">{{ name }}</span>
              section and all it's stories?
            </div>
            <span>Enter <span class="deletable-name">{{ name }}</span> to the field below to continue.</span>
            <v-text-field
              name="section"
              v-validate="`required|min:6|max:255|is:${name}`"
              v-model="section"
              placeholder="Section name"
              :error-messages="errors.first('section')"
              :disabled="processing"
              solo
            ></v-text-field>
          </v-flex>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   @click="closeModal">
             Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   :disabled="processing"
                   @click="removeSection">
              {{ isMobileDevice ? ' Delete Section' : 'Delete' }}
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import CircularLoader from '../loaders/Circular';
import ModalMixin from '@/mixins/modal';
import { mapGetters } from 'vuex';

export default {
  name: 'delete-section',
  components: {
    CircularLoader
  },
  mixins: [
    ModalMixin
  ],
  computed: {
    ...mapGetters({
      items: 'entity/items'
    }),
    sections () {
      return this.items('section');
    },
    deletable () {
      return _.find(this.sections, section => section.id === this.params);
    }
  },
  data () {
    return {
      section: '',
      name: ''
    };
  },
  methods: {
    async removeSection () {
      this.processing = true;

      const result = await this.$validator.validate();
      if (!result) {
        this.processing = false;
        return;
      }

      this.$store.commit('entity/delete', {
        entity: 'section',
        id: this.params
      });

      await this.$store.dispatch('entity/delete', {
        entity: 'section',
        id: this.params,
        cancelCommit: true
      });

      this.processing = false;
      this.closeModal();
    }
  },
  watch: {
    dialog () {
      if (this.dialog) {
        this.name = this.deletable ? this.deletable.name : '';
      } else {
        this.name = null;
      }
    }
  }
};
</script>
