const mongoose = require('mongoose');

const connectDB = async(socket)=>{
    try {
      const conn =await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/demo');
      console.log(`database connected!: ${conn.connection._connectionString}`);
   

    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;