import Ember from 'ember';
export default Ember.Controller.extend({  // TODO: MODEL NEVER GETS UPDATED IN THIS MODAL (changes NEVER CHANGES!)
  patientsEdit: Ember.inject.controller('patients/edit'),

  title: 'Confirm Record Revision',
  updateButtonText: 'Confirm',
  updateButtonAction: 'confirm',

  reason: '',
  changes: function() {
    let changedAttributes = this.get('model').changedAttributes(),
        attribute;
    for (attribute in changedAttributes) {
      if (!changedAttributes[attribute][0] && !changedAttributes[attribute][1]) {
        delete changedAttributes[attribute];
      }
    }
    return changedAttributes;
  }.property('model.hasDirtyAttributes'),

  actions: {
    cancel: function() {
      this.set('reason', '');
      this.send('closeModal');
    },

    confirm: function() {
      let reasonGiven = this.get('reason'),
          editController = this.get('patientsEdit');

      editController.send('addRevisionReason', reasonGiven);
      this.set('reason', '');
    }
  }
});
