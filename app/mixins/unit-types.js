import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  defaultUnitList: [
    'Ampoule',
    'Aq. Solution',
    'Bag',
    'Bottle',
    'Box',
    'Bundle',
    'Capsules',
    'Case',
    'Container',
    'Cream',
    'Dental Cartridge',
    'Drops',
    'Each',
    'Ear Drops',
    'Enema',
    'Eye Drops',
    'Eye Ointment',
    'Gel',
    'Infusion',
    'Infusion (2/3 L)',
    'Inhaler',
    'Injection',
    'Injection (i.v.)',
    'Injection (0.5 ml)',
    'Injection (2 ml)',
    'Injection (3 ml)',
    'Injection (4 ml)',
    'Injection (5 ml)',
    'Injection (100 ml)',
    'Injection (2/3 L)',
    'Jelly',
    'Liquid',
    'Nebule',
    'Nebuliser Solution',
    'Ointment',
    'Oral Gel',
    'Oral Solution',
    'Oral Suspension',
    'Oral Vaccine',
    'Pack',
    'Paint',
    'Pair',
    'Pallet',
    'Patch',
    'Pcs',
    'Pencil',
    'Pill',
    'Plastic',
    'Polyamp',
    'Powder',
    'Powder for Injection',
    'Powder for Injection (10 ml)',
    'Resin',
    'Roll',
    'Sachet',
    'Slow Release Tabs',
    'Solution',
    'Spray',
    'Strips',
    'Suppositories',
    'Suspension',
    'Set',
    'Syrup',
    'Tablets',
    'Topical Cream',
    'Tray',
    'Tube',
    'Uncoated Tablets',
    'Vial'
  ],

  unitList: function() {
    let defaultUnitList = this.get('defaultUnitList');
    let inventoryUnitList = this.get('inventoryUnitList');
    if (Ember.isEmpty(inventoryUnitList)) {
      return defaultUnitList;
    } else {
      return inventoryUnitList;
    }
  }.property('inventoryUnitList', 'defaultUnitList'),

  unitListForSelect: Ember.computed.map('unitList', SelectValues.selectValuesMap)
});
