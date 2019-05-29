<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Payment info </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-container grid-list-lg class="padding-0">
            <v-layout row wrap justify-space-between>
                <v-flex xs12>
                  <div class="label">Card Number</div>
                  <v-text-field
                    key="Card Number"
                    name="Card Number"
                    placeholder="XXXX XXXX XXXX XXXX"
                    v-validate="'required|length:19'"
                    v-model="info.number"
                    :disabled="processing"
                    solo
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 sm3>
                  <div class="label">Month</div>
                  <v-text-field
                    key="Month"
                    name="Month"
                    placeholder="MM"
                    v-validate="'required|min:1|max:12'"
                    v-model="info.month"
                    :disabled="processing"
                    solo
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 sm3>
                  <div class="label">Year</div>
                  <v-text-field
                    key="Year"
                    name="Year"
                    placeholder="YY"
                    v-validate="'required|min:2000|max:2018'"
                    v-model="info.year"
                    :disabled="processing"
                    solo
                  ></v-text-field>
                </v-flex>
                <v-flex xs0 sm0 v-if="!$store.state.auth.isMobileDevice"/>
                <v-flex xs12 sm3>
                  <div class="label">CVV</div>
                  <v-text-field
                    key="CVV"
                    name="CVV"
                    placeholder="XXX"
                    v-validate="'required|length:3'"
                    v-model="info.cvv"
                    :disabled="processing"
                    solo
                  ></v-text-field>
                </v-flex>
            </v-layout>
          </v-container>
          <v-flex shrink class="mt-4 padding-0" :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   :disabled="processing"
                   @click="cancel">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   :disabled="!validated || processing"
                   @click="next">
              Next
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import ModalMixin from '@/mixins/modal';

  export default {
    name: "payment-info",
    mixins: [
      ModalMixin
    ],
    data() {
      return {
        info: {
          number: null,
          month: null,
          year: null,
          cvv: null
        },
        processing: false
      }
    },
    computed: {
      validated() {
        return true;
      },
      errors() {
        return true;
      },
    },
    methods: {
      next() {
        this.closeModal();
        this.$root.$emit('payment-successfully');
      },
      cancel() {
        this.closeModal();
        this.$root.$emit('incorrect-data');
      }
    },
  }
</script>

<style scoped>

</style>
