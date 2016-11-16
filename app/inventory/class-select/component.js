import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
import computed from 'ember-computed';
export default Ember.Component.extend({
  rankOptions: [],
  prompt: ' ',
  class: 'col-sm-2 test-inv-rank',

  options: computed('classOptions', function() {
    return SelectValues.selectValues(this.get('classOptions'));
  }),

  init() {
    this._super(...arguments);

    // set available options
    this.set('classOptions', Ember.A(['ABC', 'ABC#', 'AB', 'AB*', 'A', 'S', 'R', 'IMAI-R']));
  }
});
