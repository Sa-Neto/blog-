import mongoose from 'mongoose';

const conn = async () => {
  try {
    // const db = await mongoose.connect('mongodb://localhost:27017/blog');
    const db = await mongoose.connect('mongodb+srv://mern12:5H3qVPR2AtULJyXx@cluster0.dz3apqx.mongodb.net/?retryWrites=true&w=majority');
    // console.log('Banco conectado com sucesso');
    return db;
  } catch (error) {
    console.log(error);
  }
};

conn();

export default conn;
