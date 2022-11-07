import mongoose from 'mongoose';

const { Schema } = mongoose;
const LoginSchema = new Schema({
  userId: mongoose.ObjectId,
  title: String,
  body: String,
  imagem: String,
}, { timestamps: true });

const Login = mongoose.model('Login', LoginSchema);

export default Login;
