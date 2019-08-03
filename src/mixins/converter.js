export default {
  filters: {
    toDate (str) {
      const now = moment(new Date());
      const date = moment.unix(str);

      const duration = moment.duration(now.diff(date));

      let ending = '';
      let value = (() => {
        switch (true) {
          case duration.asMinutes() < 1:
            return 'less than minute ago';
          case duration.asMinutes() < 60:
            ending = 'min';
            return duration.asMinutes();
          case duration.asHours() < 24:
            ending = 'hour';
            return duration.asHours();
          default:
            ending = 'day';
            return duration.asDays();
        }
      })();

      let beginning = value > 1 ? '' : 'a ';
      ending = value > 1 ? ending + 's' : ending;
      return value === 'less than minute ago' ? value : `${beginning}${Math.trunc(value)} ${ending} ago`;
    },
    withoutDots (str) {
      const s = str ? (typeof str === 'string' ? str : str.name) : str;
      return s ? s.replace(/\.../g, '') : s;
    }
  },
  methods: {
    getStrFromObj (item, shortcut = false) {
      const value = item.key || item.name;
      return shortcut ? this.shortcut(value) : value;
    },
    getAttr (field) {
      return _.isObject(field) ? `data-id="${field.id}"` : '';
    },
    createSpan (type, text, greyed = false, editable = false, clickable = false) {
      const cls = `user-story__editable--${type}${greyed ? ' text-greyed' : ''}`;
      const props = `readonly contenteditable="${editable}"`;
      const attr = this.getAttr(text);

      return `<span class="${cls}" ${props} ${attr}>${ this.$options.filters.withoutDots(text) }</span>&nbsp;`;
    },
    shortcut (item) {
      const exp = new RegExp(this.filter, 'i');
      let markup = item.replace(exp, "<span class='text-black'>$&</span>");

      return `<span class="shortcut text-greyed">${markup}</span>`;
    }
  }
};
