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
    getStrFromObj (item) {
      return item.key || item.name;
    },
    createSpan (type, text, greyed = false, editable = false, clickable = false) {
      const cls = `user-story__editable--${type}${greyed ? ' text-greyed' : ''}`;
      const props = `readonly contenteditable="${editable}"`;

      return `<span class="${cls}" ${props}>${ this.$options.filters.withoutDots(text) }</span>&nbsp;`;
    }
  }
};
