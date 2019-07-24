export default {
  data () {
    return {
      toolId: null
    };
  },
  methods: {
    selectTool (id) {
      this.toolId = id;
    },
    toolKey ($event) {
      console.log($event);
    }
  }
};
