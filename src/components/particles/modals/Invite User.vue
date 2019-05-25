<template>
  <template>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" max-width="608">
        <v-card>
          <v-card-title class="headline">
            <h1> Invite user </h1>
          </v-card-title>

          <v-card-text>
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialog = false"
            >
              Disagree
            </v-btn>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialog = false"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </template>
</template>

<script>
export default {
  name: 'Invite User'
};
</script>

<style scoped>

</style>
