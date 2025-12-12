const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://avyaan:vCBtojyv5YuAi4BF@avyaan.v8sypfp.mongodb.net/?appName=Avyaan");}



module.exports = connectDB;