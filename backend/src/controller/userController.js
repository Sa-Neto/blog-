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
    return res.status(422).json({ error: ['Name é um atributo obrigatório'] });
  }
  if (!email) {
    return res.status(422).json({ error: ['Email é um atributo obrigatório'] });
  }
  if (!password) {
    return res.status(422).json({ error: ['Senha é um atributo obrigatório'] });
  }
  if (!confirmPassword) {
    return res.status(422).json({ error: ['Confirmação de senha é um atributo obrigatório'] });
  }
  if (confirmPassword !== password) {
    return res.status(422).json({ error: ['Confirmação de senha tem que ser semelhantes'] });
  }
  const validUser = await User.findOne({ email });
  if (validUser) {
    return res.status(422).json({ error: ['Por favor ultilize outro email'] });
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

const login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;
  if (!email) {
    return res.status(422).json({ error: ['Email é um atributo obrigatório'] });
  }
  if (!password) {
    return res.status(422).json({ error: ['Senha é um atributo obrigatório'] });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).json({ error: ['Email ou Senha está incorreto'] });
  }
  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    return res.status(422).json({ error: ['Email ou Senha está incorreto'] });
  }
  await createToken(user, req, res);
};

const userController = { register, login };

export default userController;
