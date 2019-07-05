export default {
  data () {
    return {
      stories: {
        list: [ this.getDefaultStoryList() ]
      }
    };
  },
  mounted () {
    if (this.sectionContent.length) {
      this.stories.list = this.sectionContent;
      return;
    }

    const el = this.stories.list[0];
    el.parent = this.stories;
    el.text = this.$refs.wysiwyg.createSpan('beginning', 'As a', true);

    const constructions = Object.values(this.dictionary.constructions);
    el.template = constructions[0].structure;
  },
  computed: {
    sectionContent () {
      return this.$store.getters['story/content'](this.model.id);
    },
    dictionary () {
      return this.$store.getters['story/dictionary'];
    }
  },
  methods: {
    getDefaultStoryList () {
      return {
        parent: null,
        estimation: 0,
        priority: 0,
        label: 1,

        text: '',
        template: '',
        tail: '',
        placeholder: '',

        list: []
      };
    }
  }
};
