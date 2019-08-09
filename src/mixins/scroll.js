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
      this.$refs[this.scrollableContainer][`${type}EventListener`]('scroll', this.handleScroll);
    },
    scrollToActiveSection () {
      const el = document.getElementById(this.activeSectionId);
      if (el) {
        el.scrollIntoView();
      }
    },
    handleScroll ($event) {
      if (!this.sections || !this.sections.length) {
        return;
      }

      let offset = $event.target.scrollTop,
        childOffsets = _.map($event.target.children, item => item.offsetTop),
        index = _.findIndex(childOffsets, co => (co + 28) > offset);

      index = index === -1 ? this.sections.length - 1 : index;

      const url = this.$route.path.replace(this.activeSectionId, this.sections[index].id);
      this.$router.replace(url);
    }
  },
  watch: {
    activeSectionId () {
      this.scrollToActiveSection();
    }
  }
};
