<template>
  <div class="tool-section pt-4">
    <div class="tool-block">
      <div class="section__title">
        ID
      </div>
      <div class="tool-section__text">
        S012
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Estimate
      </div>
      <div class="tool-block__text">
        2 hours
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Priority
      </div>
      <div class="tool-block__text">
        <div class="tool-block__label label--green">
          Must have
        </div>
        <div class="tool-block__label label--blue label--outline">
          Should have
        </div>
        <div class="tool-block__label label--grey label--outline">
          Could have
        </div>
        <div class="tool-block__label label--red label--outline">
          Wont have
        </div>
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Labels
      </div>
      <div class="tool-block__text">
        <div class="tool-block__label label--yellow label--outline">
          1. Backend
        </div>
        <div class="tool-block__label label--blue label--outline">
          2. Frontend
        </div>
        <div class="tool-block__label label--grey label--outline">
          3. MVP
        </div>
      </div>
    </div>

    <div class="tool-block">
      <div class="section__title">
        Attachments
      </div>
      <div class="tool-block__text">
        <div class="tool-block__file">
          <v-layout align-center justify-center row fill-height>
            <v-icon>
              add
            </v-icon>
          </v-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolSection",
}
</script>

<style scoped>

</style>
