function unixToDateTimeStr (data) {
  const time = moment.unix(data);
  const diff = time.diff(moment(), 'days');
  switch (diff) {
    case 0:
      return time.format('[Today at] h:mm a');
    case -1:
      return time.format('[Yesterday at] h:mm a');
    default:
      return time.format('D MMM YYYY [at] h:mm a');
  }
}

export default {
  unixToDateTimeStr
};
