import { Response } from 'superagent';
import { app } from '../app';
import users from './utils/user';

const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

let chaiResponse: Response;
const adminInfo = users.admin.adminValido;
const emailValido = users.admin.adminValido.email
const passwordValido = users.admin.adminValido.password
const invalidEmail = users.admin.adminInvalido.email;
const passwordInvalido = users.admin.adminInvalido.password;

const request = async (email: string, password: string) => {
  chaiResponse = await chai.request(app).post('/login').send({ email, password });
};

describe('testa se a api tem os retornos corretos', () => {
  beforeEach(async () => {
    await request(emailValido, passwordValido);
  })

  it('status da requisição 200 - OK', () => {
    expect(chaiResponse.status).to.equal(200);
  })

  it('retorno do corpo da requisição é correspondende a informação do usuario', async () => {

    const { user } = chaiResponse.body;

    const bodyRequest = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    }

    const {password, ...payload} = adminInfo;

    expect(bodyRequest).to.deep.equal(payload);
  })

  it('retorno do corpo da requisição é um token', async() => {
    expect(chaiResponse.body.token).to.be.a('string');
  })
})

describe('testa as validações de senha da api', () => {

  it('testa caso a senha não seja passada', async () => {
    await request(emailValido, '');
    expect(chaiResponse.status).to.equal(400);
    expect(chaiResponse.body.message).to.equal('All fields must be filled');
  })
  
  it('testa caso a senha seja invalida', async () => {
      await request(emailValido, passwordInvalido);
    
      expect(chaiResponse.status).to.equal(401);
      expect(chaiResponse.body.message).to.be.equal('Incorrect email or password');
    })
  
    it('testa caso a senha seja menor que 6', async () => {
      await request(emailValido, '12345');

      expect(chaiResponse.status).to.equal(401);
      expect(chaiResponse.body.message).to.be.equal('Incorrect email or password');
    })
})

describe('testa as validações de email da api', () => {
  it('testa caso o email não seja passado', async () => {
    await request('', passwordValido);

    expect(chaiResponse.status).to.equal(400);
    expect(chaiResponse.body.message).to.equal('All fields must be filled');
  })

  it('testa caso o email seja invalido', async () => {
    await request(invalidEmail, passwordValido);

    expect(chaiResponse.status).to.equal(401);
    expect(chaiResponse.body.message).to.equal('Incorrect email or password');
  })
})

describe('testa rota get login/validade', () => {
  it('testa se retorna a role do usuario informado', async () => {
    await request(emailValido, passwordValido);

    const token = chaiResponse.body.token;

    expect(token).to.be.a('string');

    const chaiValidate = await chai.request(app).get('/login/validate').set('Authorization', token);
  
    expect(chaiValidate.status).to.equal(200);
    expect(chaiValidate.body).to.equal('admin');
  })

  it('testa se retorna erro quando passado um token invalido', async () => {
    const chaiValidate = await chai.request(app).get('/login/validate').set('Authorization', 'tokenInvalido');

    expect(chaiValidate.status).to.equal(401);
    expect(chaiValidate.body.error).to.equal('Token invalid');
  })
})