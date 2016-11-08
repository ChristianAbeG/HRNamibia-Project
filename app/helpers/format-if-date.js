import Ember from 'ember';
export default Ember.Helper.helper(function(params, hash) {
  if (!Ember.isEmpty(params[0])) {
    let input = params[0],
        isDate = moment.isDate(input),
        isDateString = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(input),
        offsetMidnight = (new Date()).getTimezoneOffset() / 60; // Divide by 60 because getTimezoneOffset() gives in minutes
    if (offsetMidnight < 0) {
      offsetMidnight += 24;
    }

    if (isDate || isDateString) {
      let dateFormat;
      if (hash && hash.format) {
        dateFormat = hash.format;
      } else if (isDate) {
        dateFormat = (input.getHours() === 0 && input.getMinutes() === 0 && input.getSeconds() === 0) ? 'l' : 'l LT';
      } else {
        let midnightPattern = (offsetMidnight === 0) ? '00' : offsetMidnight;
        midnightPattern += ':00:00.000Z$';

        let midnight = new RegExp(midnightPattern);
        console.log('format-if-date: offsetMidnight=' + offsetMidnight + ', midnightPattern=' + midnightPattern + ', regex=' + midnight);
        dateFormat = (midnight.test(input)) ? 'l' : 'l LT';
      }

      return moment(input).format(dateFormat);
    }
    return input;
  } else {
    return Ember.String.htmlSafe('<em>Empty</em>');
  }
});