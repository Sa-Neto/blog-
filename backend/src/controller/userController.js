import bcrypt from 'bcryptjs';
import createToken from '../helpers/create-token';
import User from '../models/User';

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
  } = req.body;

  if (!name) {
    return res.status(422).json({ error: ['Name é um atributo obrigatorio'] });
  }
  if (!email) {
    return res.status(422).json({ error: ['Email é um atributo obrigatorio'] });
  }
  if (!password) {
    return res.status(422).json({ error: ['Senha é um atributo obrigatorio'] });
  }
  if (!confirmPassword) {
    return res.status(422).json({ error: ['Confirmação de senha é um atributo obrigatorio'] });
  }
  if (confirmPassword !== password) {
    return res.status(422).json({ error: ['Confirmação de senha tem que ser semelhantes'] });
  }
  const validUser = await User.findOne({ email });
  if (validUser) {
    return res.status(422).json(['Por favor ultilize outro email']);
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  try {
    const user = new User({
      name,
      email,
      confirmPassword,
      password: passwordHash,
    });

    const newUser = await user.save();
    await createToken(newUser, req, res);
  } catch (error) {
    console.error(error);
  }
};

const userController = { register };

export default userController;
