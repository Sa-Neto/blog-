import jwt from 'jsonwebtoken';

const createToken = async (user, req, res) => {
  const secret = process.env.JWT_SECRET;
  // CREATE A TOKEN
  const token = jwt.sign({
    name: user.name,
    id: user._id,
  }, secret);
  // return
  res.status(201).json({
    message: 'Você está authenticado',
    token,
    userId: user.id,
  });
};

export default createToken;
