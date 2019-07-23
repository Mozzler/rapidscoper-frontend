<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="608" persistent>
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Change Plan </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-layout row wrap class="modal-row"
                    :class="{'modal-row--checked': checked === 'basic'}"
                    @click="() => changePlan('basic')">
            <v-flex xs6>
              <div class="text-bold">Basic Plan</div>
              <div class="text-greyed">Free forever</div>
            </v-flex>
            <v-flex xs6 class="text-bold">
              <div>Only one project</div>
              <div>No export</div>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="modal-row"
                    :class="{'modal-row--checked': checked === 'primary'}"
                    @click="() => changePlan('primary')">
            <v-flex xs6>
              <div class="text-bold">Premium Plan</div>
              <div class="text-greyed">$ 9.99 / user / month</div>
            </v-flex>
            <v-flex xs6 class="text-bold">
              <div>Unlimited projects</div>
              <div>Export</div>
            </v-flex>
          </v-layout>

          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   :disabled="checked === active"
                   @click="updatePlan">
              {{ btnText }}
            </v-btn>
          </v-flex>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import ModalMixin from '@/mixins/modal'

  export default {
    name: 'change-plan',
    mixins: [
      ModalMixin
    ],
    data() {
      return {
        active: 'basic',
        checked: 'basic',
      }
    },
    methods: {
      changePlan(plan) {
        this.checked = plan;
      },
      updatePlan() {
        this.active = this.checked;
        this.$root.$emit('payment-info');
      }
    },
    computed: {
      btnText() {
        switch (true) {
          case this.checked === 'basic' && this.active === 'primary':
            return 'Downgrade';
          case this.checked === 'primary' && this.active === 'basic':
            return 'Upgrade';
          default:
            return 'Downgrade';

        }
      },
    },
  };
</script>
