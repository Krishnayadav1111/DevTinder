const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://avyaan:BdOKwh8MG7AfaMIp@avyaan.v8sypfp.mongodb.net/?appName=Avyaan");}



module.exports = connectDB;