export default {
  data () {
    return {
      processing: false
    };
  },
  computed: {
    loading () {
      return (this.processing || this.initialization);
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
    }
  },
  beforeMount () {
    this.initProcessing();
  },
  methods: {
    initProcessing () {
      this.processing = true;
      this.resetData();
      this.fetchData();
    }
  },
  beforeDestroy () {
    this.resetData();
  },
  watch: {
    activeProjectId() {
      this.fetchData();
    },
  }
};
