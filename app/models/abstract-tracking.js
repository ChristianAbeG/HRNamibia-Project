import DS from 'ember-data';
import Ember from 'ember';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';
import UserSession from 'hospitalrun/mixins/user-session';
export default Model.extend(UserSession, EmberValidations, {  // Like models/abstract.js, but it creates and saves a
  session: Ember.inject.service(),                            // new revision object every time the model is saved.
  revisions: DS.hasMany('revision', { async: true }),
  lastModified: DS.attr('date'),
  modifiedBy: DS.attr(),
  modifiedFields: DS.attr(),
  lastRevisionReason: DS.attr('string'),

  /**
  * Before saving the record, update the modifiedFields attribute to denote what fields were changed when.
  * Save changed records along with metadata into a new revision using changedAttributes.
  * Also, if the save failed because of a conflict, reload the record and reapply the changed attributes and
  * attempt to save again.
  */
  save: function(options) {
    let changedAttributes = this.changedAttributes();
    let modifiedDate = new Date();
    let modifiedFields = this.get('modifiedFields');
    let session = this.get('session');
    
    if (!session || !session.get('isAuthenticated')) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.run(null, reject, 'ERROR you must be logged in to save');
      });
    }

    if (this.get('hasDirtyAttributes') && !this.get('isDeleted')) {
      if (Ember.isEmpty(modifiedFields)) {
        modifiedFields = {};
      }
      let attribute;
      for (attribute in changedAttributes) {
        // If both the oldProp and newProp values are falsy, then don't consider the attribute to have changed.
        // TODO: Investigate this. Meant to keep undefined -> null -> "" changes from triggering, but wouldn't
        // this also catch undefined -> false (boolean)? Yet this is a valid change. Look into it.
        if (!changedAttributes[attribute][0] && !changedAttributes[attribute][1]) {
          delete changedAttributes[attribute];
        } else {
          modifiedFields[attribute] = modifiedDate;
        }
      }
      if (Object.keys(changedAttributes).length > 0) {
        this.set('modifiedFields', modifiedFields);
        this.set('lastModified', modifiedDate);
        this.set('modifiedBy', this.getUserName());
      }
    }
    // Save a revision record of this modification. Use changedAttributes to detect if anything's changed instead
    // of hasDirtyAttributes, since we've already cleaned up changedAttributes (see lines 38-41). Also, this should
    // save a revision even when isDeleted is true, so it wouldn't belong in the prior if block.
    if (Object.keys(changedAttributes).length > 0) {
      this.store.createRecord('revision', {
        revisedRecord: this,
        revisionDate: modifiedDate,
        revisedBy: this.get('modifiedBy'),
        revisedFields: changedAttributes,
        reason: this.get('latestRevisionReason')
      }).save().then((response) => {
        console.log('Revision saved. id: ' + response);
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
            for (var attribute in changedAttributes) {
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
