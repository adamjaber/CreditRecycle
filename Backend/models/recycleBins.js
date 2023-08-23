const { Schema, model } = require('mongoose');

const addressSchema = new Schema({
   lat : {type:Number},
   lng : {type:Number}
});
const capacitySchema = new Schema({
    plastic : {type:Number},
    can : {type:Number},
    glass : {type:Number},
 });
const recycleBinsSchema = new Schema({
    location:addressSchema,
    maxCapacity: { type: Number, required: true },
    capacity: capacitySchema,
    status: { type: String, required: true },

}, { collection: 'recycleBins' });

recycleBinsSchema
    .path('status')
    .set(type => String(type).toLowerCase());

const RecycleBin = model('RecycleBin', recycleBinsSchema);
module.exports = RecycleBin;