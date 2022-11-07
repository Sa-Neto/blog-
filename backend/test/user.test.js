import request from 'supertest';
import app from '../src/app';

let user = {
  name: 'Kisuke Urahara',
  email: 'Urahara@gmail.com',
  confirmPassword: '123456',
  password: '123456',
};

const createUser = '/user/register';
const login = '/user/login';

test('Deve criar um usuario com sucesso', () => {
  return request(app).post(createUser)
    .send(user)
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
    ['Name é um atributo obrigatorio'],
  ));
  test('Não deve criar um usuario sem email', () => testTemplate(
    { email: null },
    ['Email é um atributo obrigatorio'],
  ));
  test('Não deve criar um usuario sem password', () => testTemplate(
    { password: null },
    ['Senha é um atributo obrigatorio'],
  ));
  test('Não deve criar um usuario sem confirmação de senha', () => testTemplate(
    { confirmPassword: null },
    ['Confirmação de senha é um atributo obrigatorio'],
  ));
  test('Não deve criar um usuario sem confirmação de senha', () => testTemplate(
    { confirmPassword: '12345' },
    ['Confirmação de senha tem que ser semelhantes'],
  ));
  test('Não deve criar uma conta com email repetido', () => {
    user.email = `${Date.now}@gmail.com`;
    return request(app).post(createUser)
      .send(user)
      .then((res) => {
        expect(res.status).toEqual(201);
        return request(app).post(createUser)
          .then((response) => {
            expect(response.status).toEqual(422);
            expect(response.body.error).toStrictEqual(['Por favor ultilize outro email']);
          });
      });
  });
});
