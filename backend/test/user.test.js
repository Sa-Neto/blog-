import request from 'supertest';
import app from '../src/app';

const createUser = '/user/register';
const loginUser = '/user/login';

let user1 = {
  name: 'Kisuke Urahara',
  email: 'Urahara@gmail.com',
  confirmPassword: '123456',
  password: '123456',
};

// test('Usuario de teste', () => {
//   return request(app).post(createUser)
//     .send(user1)
//     .then((res) => {
//       expect(res.status).toEqual(201);
//       expect(res.body).toHaveProperty('token');
//     });
// });

let user2 = {
  name: 'Kisuke Urahara',
  email: `${Date.now()}@gmail.com`,
  confirmPassword: '123456',
  password: '123456',
};

test('Deve criar um usuario com sucesso', () => {
  return request(app).post(createUser)
    .send(user2)
    .then((res) => {
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });
});
describe('Deve impedir de um usuario criar conta com error', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(createUser)
      .send({
        name: 'Kisuke Urahara',
        email: `${Date.now()}@gmail.com`,
        password: '123456',
        confirmPassword: '123456',
        ...newData,
      })
      .then((res) => {
        expect(res.status).toEqual(422);
        expect(res.body.error).toStrictEqual(errorMessage);
      });
  };
  test('Não deve criar um usuario sem nome', () => testTemplate(
    { name: null },
    ['Name é um atributo obrigatório'],
  ));
  test('Não deve criar um usuario sem email', () => testTemplate(
    { email: null },
    ['Email é um atributo obrigatório'],
  ));
  test('Não deve criar um usuario sem password', () => testTemplate(
    { password: null },
    ['Senha é um atributo obrigatório'],
  ));
  test('Não deve criar um usuario sem confirmação de senha', () => testTemplate(
    { confirmPassword: null },
    ['Confirmação de senha é um atributo obrigatório'],
  ));
  test('Não deve criar um usuario sem confirmação de senha', () => testTemplate(
    { confirmPassword: '12345' },
    ['Confirmação de senha tem que ser semelhantes'],
  ));
  test('Não deve criar uma conta com email repetido', () => {
    user2.email = `${Date.now()}@gmail.com`;
    return request(app).post(createUser)
      .send(user2)
      .then((res) => {
        expect(res.status).toEqual(201);
        return request(app).post(createUser)
          .send(user2)
          .then((response) => {
            expect(response.status).toEqual(422);
            expect(response.body.error).toStrictEqual(['Por favor ultilize outro email']);
          });
      });
  });
});

test('Deve fazer o login do usuario com sucesso', () => {
  return request(app).post(loginUser)
    .send({ email: user1.email, password: user1.password })
    .then((res) => {
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });
});
describe('Deve impedir de um usuario logar com error', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(loginUser)
      .send({
        email: user1.email,
        password: user1.password,
        ...newData,
      })
      .then((res) => {
        expect(res.status).toEqual(422);
        expect(res.body.error).toStrictEqual(errorMessage);
      });
  };
  test('Não deve permite logar sem email', () => testTemplate(
    { email: null },
    ['Email é um atributo obrigatório'],
  ));
  test('Não deve permite logar sem Password', () => testTemplate(
    { password: null },
    ['Senha é um atributo obrigatório'],
  ));
  test('Não deve permite logar com email errado', () => testTemplate(
    { email: 'sadasdweq1231@sdasdasd.com' },
    ['Email ou Senha está incorreto'],
  ));
  test('Não deve permite logar com Password errada', () => testTemplate(
    { password: 'sadaspodj12' },
    ['Email ou Senha está incorreto'],
  ));
});
