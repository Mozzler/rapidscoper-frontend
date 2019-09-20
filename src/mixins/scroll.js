export default {
  data () {
    return {
      frozen: false
    };
  },
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
    },
    freeze () {
      return this.$store.state.system.freeze;
    }
  },
  methods: {
    setScrollListener (type = 'add') {
      this.$refs['scrollable-layout'][`${type}EventListener`]('scroll', this.handleScroll);
    },
    scrollToActiveSection () {
      const el = document.getElementById(this.activeSectionId);
      if (el) {
        const container = el.closest('.content-container');
        container.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleScroll () {
      if (this.freeze) {
        return;
      }

      const container = this.$refs['scrollable-layout'];
      const nodes = container.querySelectorAll(this.scrollSelector);
      const node = _.find(nodes, item => item.getBoundingClientRect().top > -1);

      if (!node) {
        return;
      }

      if (node.id !== this.$route.params.section) {
        this.$router.replace({
          name: this.$route.name,
          params: {
            section: node.id
          }
        });
      }
    }
  },
  watch: {
    activeSectionId () {
      if (!this.freeze) {
        this.scrollToActiveSection();
      }
    }
  }
};
