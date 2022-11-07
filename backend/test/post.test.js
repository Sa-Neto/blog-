import request from 'supertest';
import app from '../src/app';

const createPost = '/post/create';

const userId = '6368fb479c490be604768255';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVyYWhhcmFAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjM0NTYifQ.oCpzBvZr07VRXzAA31GxXptuqs2gHa85Euvpd55GppY';

const postCreate = {
  userId,
  title: ' My first title ',
  body: ' My first body ',
  image: '231231231.png',
};

test('Deve criar um post com sucesso', () => {
  return request(app).post(createPost)
    .send(postCreate)
    .then((res) => {
      expect(res.status).toEqual(201);
      expect(res.body).toBe(postCreate);
    });
});

describe('Não deve permite criar um post errado', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(createPost)
      .set('authorization', `bearer ${token}`)
      .send({
        userId,
        title: 'test a title',
        body: 'test a body',
        image: '2312312.png',
        ...newData,
      })
      .then((res) => {
        expect(res.status).toEqual(422);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Nao deve permitir criar um post sem user', () => testTemplate(
    { userId: null },
    ['Não pode criar um post sem id do usuario'],
  ));
  test('Não deve permitir criar um post sem title', () => testTemplate(
    { title: null },
    ['Não pode criar um post sem titulo'],
  ));
  test('Não deve permitir criar um post sem corpo', () => testTemplate(
    { body: null },
    ['Preencha o corpo do post'],
  ));
  test('Não deve permitir criar um post sem imagem', () => testTemplate(
    { image: null },
    ['A tumbler do post é obrigatória'],
  ));
  // testar o valor do userId que vem no token com o enviado
});
