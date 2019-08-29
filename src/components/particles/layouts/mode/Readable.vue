<template>
  <div>
    <circular-loader
      cls="loader-shadow"
      :visible="loading"
    />
  </div>
</template>

<script>
import CircularLoader from '../../../particles/loaders/Circular';

export default {
  name: 'Readable',
  components: {
    CircularLoader
  },
  data () {
    return {
      loading: false
    };
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    async fetchData () {
      this.loading = true;
      await this.$store.dispatch('projectVersion/view', this.params);
      this.loading = false;
    }
  },
  computed: {
    params () {
      return {
        params: {
          id: this.$route.params.projectId
        }
      };
    }
  },
  watch: {
    projectId () {
      this.fetchData();
    }
  }
};
</script>
