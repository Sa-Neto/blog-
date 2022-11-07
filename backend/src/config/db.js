import mongoose from 'mongoose';

const conn = async () => {
  try {
    const db = await mongoose.connect('mongodb://localhost:27017/blog');
    // console.log('Banco conectado com sucesso');
    return db;
  } catch (error) {
    console.log(error);
  }
};

conn();

export default conn;
