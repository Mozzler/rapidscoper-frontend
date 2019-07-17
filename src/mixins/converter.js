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
  },
  methods: {
    getStrFromObj (item) {
      return item.key || item.name;
    },
  }
};
