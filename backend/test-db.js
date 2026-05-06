require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...\n');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\n✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.name);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('\n❌ MongoDB Connection Failed!');
    console.log('Error:', err.message);
  });
