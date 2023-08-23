const { Schema, model } = require('mongoose');

const itemsSchema = new Schema({
    itemName: { type: String, required: false },
    quantity: { type: Number, required: false },
    imagesUrl: [String],

});

const activitesSchema = new Schema({
    dateTime: { type: String, required: false },
    points: { type: Number, required: false },
    totalBottles: { type: Number, required: false },
    items:[itemsSchema],
    recycleBinID: { type: String, required: false },
});


const userTypeSchema = new Schema({
    operationalManager: { type: Boolean, required: false },
    municipal: { type: Boolean, required: false },
    admin: { type: Boolean, required: false },
    recycler: { type: Boolean, required: false },

});

const reportsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    binAddress: { type: String, required: true },
    reason: { type: String, required: true },
  });  

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: false },
    gender: { type: String, required: false },
    imgUrl: { type: String, required: true },
    password: { type: String, required: true },
    registerDate: { type: String, required: true },
    wallet: { type: Number, required: false },
    activities: [activitesSchema], 
    userType: userTypeSchema,
    city: { type: String, required: false },
}, { collection: 'users' });

userSchema
    .path('email')
    .set(email => String(email).toLowerCase());


const User = model('User', userSchema);
module.exports = User;
