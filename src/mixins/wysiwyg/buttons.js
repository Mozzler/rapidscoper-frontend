export default {
  data () {
    return {
      toolId: null
    };
  },
  methods: {
    selectTool (id) {
      this.toolId = id;
    }
  }
};
