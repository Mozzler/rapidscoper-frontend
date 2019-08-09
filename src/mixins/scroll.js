export default {
  beforeDestroy () {
    this.setScrollListener('remove');
  },
  mounted () {
    this.scrollToActiveSection();
    this.setScrollListener();
  },
  computed: {
    activeSectionId () {
      return this.$route.params.section;
    }
  },
  methods: {
    setScrollListener (type = 'add') {
      this.$refs['scrollable-layout'][`${type}EventListener`]('scroll', this.handleScroll);
    },
    scrollToActiveSection () {
      const el = document.getElementById(this.activeSectionId);
      if (el) {
        el.scrollIntoView();
      }
    }
  },
  watch: {
    activeSectionId () {
      this.scrollToActiveSection();
    }
  }
};
