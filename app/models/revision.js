import DS from 'ember-data';
import Ember from 'ember';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';
import UserSession from 'hospitalrun/mixins/user-session';
export default Model.extend(UserSession, EmberValidations, {
  session: Ember.inject.service(),
  revisedRecord: DS.belongsTo('abstract-tracking', { polymorphic: true }),
  revisionDate: DS.attr('date'),
  revisedBy: DS.attr(),
  revisedFields: DS.attr(),
  reason: DS.attr('string'),

  save(options) {
    let changedAttributes = this.changedAttributes();
    let session = this.get('session');

    if (!session || !session.get('isAuthenticated')) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.run(null, reject, 'ERROR you must be logged in to save');
      });
    }

    return this._super(options).catch(function(error) {
      if (!Ember.isEmpty(options) && options.retry) {
        throw error;
      } else {
        if (error.name && error.name.indexOf && error.name.indexOf('conflict') > -1) {
          // Conflict encountered, so rollback, reload and then save the record with the changed attributes.
          this.rollbackAttributes();
          return this.reload().then(function(record) {
            for (let attribute in changedAttributes) {
              record.set(attribute, changedAttributes[attribute][1]);
            }
            if (Ember.isEmpty(options)) {
              options = {};
            }
            options.retry = true;
            return record.save(options);
          });
        } else {
          throw error;
        }
      }
    }.bind(this));
  }
});
