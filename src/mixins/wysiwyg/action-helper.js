export default {
  methods: {
    getDeletableSet () {
      const deletable = [
        this.list[this.focused].id
      ];

      _.each(this.list[this.focused].list, item => {
        deletable.push(item.id);

        if (item.list.length) {
          const subIds = item.list.map(item => item.id);
          deletable.push(...subIds);
        }
      });

      return deletable.reverse();
    },

    getNextStoryUpdate () {
      return this.focused + 1 < this.list.length ? {
        entity: 'story',
        params: {
          id: this.list[this.focused + 1]
        },
        data: {
          afterStoryId: this.focused === 0 ? this.list[this.focused].parentStoryId : this.list[this.focused - 1].id
        }
      } : null;
    }
  }
};
