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
    }
  },
  methods: {
    setScrollListener (type = 'add') {
      this.$refs['scrollable-layout'][`${type}EventListener`]('scroll', this.handleScroll);
    },
    scrollToActiveSection () {
      const el = document.getElementById(this.activeSectionId);
      if (el) {
        el.scrollIntoView('smooth');
      }
    },
    handleScroll () {
      const container = this.$refs['scrollable-layout'];
      const nodes = container.querySelectorAll(this.scrollSelector);
      const node = _.find(nodes, item => item.getBoundingClientRect().top > -1);

      this.frozen = true;
      this.$router.replace({
        name: this.$route.name,
        params: {
          section: node.id
        }
      });
    }
  },
  watch: {
    activeSectionId () {
      if (!this.frozen) {
        this.scrollToActiveSection();
      } else {
        this.frozen = false;
      }
    }
  }
};
