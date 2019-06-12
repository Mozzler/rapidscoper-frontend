export default {
  data () {
    return {
      chapter: null,
      filter: null,
      input: null
    };
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    },
    list () {
      return this.chapter ? this.dictionary[this.chapter] : [];
    },
    items () {
      const keyword = this.filter ? this.filter.toLowerCase() : '';
      return this.list.filter(item => item.toLowerCase().includes(keyword, 0));
    },
    inList () {
      const filter = this.list.filter(item => item === this.filter.trim());
      return Boolean(filter.length);
    }
  },
  methods: {
    complete (item = this.filter, first = false) {
      if (first && this.items) {
        item = this.items[0];
      }
      this.visible = false;
      this.$nextTick(() => {
        this.$root.$emit('hint-complete', this.chapter, item, this.input);
      });
    }
  }
};
