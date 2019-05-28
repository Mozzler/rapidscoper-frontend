<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Delete team </h1>
          <v-btn icon class="modal-close-btn" @click="() => $emit('close-modal')">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-layout row wrap>
            <v-flex xs12>
              Are you sure you want to delete
              <span class="text-bold"> {{ toTitle($route.params.name) }} </span>
            </v-flex>
            <v-flex xs12 mt-3>
              You will permanently lose all projects in this team, and you cannot undo this action.
            </v-flex>
          </v-layout>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   @click="() => $emit('close-modal')">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="() => $emit('close-modal')">
              Delete
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import Navigation from '@/mixins/navigation';

  export default {
    name: "DeleteTeam",
    mixins: [
      Navigation
    ],
    props: {
      show: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        dialog: this.show
      }
    },
    watch: {
      show() {
        this.dialog = this.show;
      },
    },
    computed: {
      isMobileDevice() {
        return this.$store.state.auth.isMobileDevice;
      }
    },
  }
</script>

<style scoped>

</style>
