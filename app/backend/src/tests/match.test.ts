import { Response } from 'superagent';
import { app } from '../app';

import { allMatchs, createMatch, updateMatch } from './utils/match';
import user from './utils/user';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

let chaiResponse: Response;

describe('testa se a rota /matches, retorna os dados corretos', () => {
  it('testa se o retorno da rota /matches, retorna todas as partidas', async () => {
    chaiResponse = await chai.request(app).get('/matches');

    expect(chaiResponse.status).to.equal(200);
    expect(chaiResponse.body).to.be.an('array');
    expect(chaiResponse.body).to.be.array.lengthOf(allMatchs.length);
  });

  it('testa se a rota /matches?inProgress=true, retorna todas as partidas em andamento', async () => {
    chaiResponse = await chai.request(app).get('/matches?inProgress=true');

    expect(chaiResponse.status).to.equal(200);
    expect(chaiResponse.body).to.be.an('array');
    expect(chaiResponse.body).to.be.array.lengthOf(
      allMatchs.filter(match => match.inProgress).length
    );
  });

  it('testa se a rota /matches?inProgress=false, retorna todas as partidas finalizadas', async () => {
    chaiResponse = await chai.request(app).get('/matches?inProgress=false');

    expect(chaiResponse.status).to.equal(200);
    expect(chaiResponse.body).to.be.an('array');
    expect(chaiResponse.body).to.be.array.lengthOf(
      allMatchs.filter(match => !match.inProgress).length
    );
  });
});

describe('testa se a rota POST /matches, retorna os dados corretos', () => {
  it('testa se a rota POST /matches, adiciona as partidas', async () => {
    const email = user.admin.adminValido.email;
    const senha = user.admin.adminValido.password;

    chaiResponse = await chai
      .request(app)
      .post('/login')
      .send({ email, senha });

    const token = chaiResponse.body.token;

    chaiResponse = await chai
      .request(app)
      .post('/matches')
      .set('Authorization', token)
      .send(createMatch);

    expect(chaiResponse.status).to.equal(201);
    expect(chaiResponse.body).to.be.an('object');
    expect(chaiResponse.body).to.have.property('id');
    expect(chaiResponse.body).to.have.property('homeTeam');
    expect(chaiResponse.body).to.have.property('homeTeamGoals');
    expect(chaiResponse.body).to.have.property('awayTeam');
    expect(chaiResponse.body).to.have.property('awayTeamGoals');
    expect(chaiResponse.body).to.have.property('inProgress');
  });

  it('testa que a rota POST /matches, não adiciona partidas com times iguais', async () => {

    const email = user.admin.adminValido.email;
    const senha = user.admin.adminValido.password;

    chaiResponse = await chai
      .request(app)
      .post('/login')
      .send({ email, senha });

    const token = chaiResponse.body.token;

    const matchCreate = {
      homeTeam: 16,
      awayTeam: 16,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true,
    };

    chaiResponse = await chai.request(app).post('/matches').set('Authorization', token).send(matchCreate);

    expect(chaiResponse.status).to.equal(401);
    expect(chaiResponse.body).to.be.an('object');
    expect(chaiResponse.body).to.have.property('message');
    expect(chaiResponse.body.message).to.equal('It is not possible to create a match with two equal teams');
  });

  it('testa que a rota POST /matches, não cria partidas com times que não existem', async () => {

    const email = user.admin.adminValido.email;
    const senha = user.admin.adminValido.password;

    chaiResponse = await chai
      .request(app)
      .post('/login')
      .send({ email, senha });

    const token = chaiResponse.body.token;

    const matchCreate = {
      homeTeam: 1621321321,
      awayTeam: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true,
    }

    chaiResponse = await chai.request(app).post('/matches').set('Authorization', token).send(matchCreate);

    expect(chaiResponse.status).to.equal(404);
    expect(chaiResponse.body).to.be.an('object');
    expect(chaiResponse.body).to.have.property('message');
    expect(chaiResponse.body.message).to.equal('There is no team with such id!');
  })

  it('testa se a rota PATCH /matches/:id/finish, finaliza as partidas', async () => {
    chaiResponse = await chai.request(app).patch('/matches/1/finish').send();

    expect(chaiResponse.status).to.equal(200);
  });
});

describe('testa se a rota PATCH /matches/:id, retorna os dados corretos', () => {
  it('testa se a rota PATCH /matches/:id, atualiza as partidas', async () => {
    chaiResponse = await chai.request(app).patch('/matches/1').send(updateMatch);

    expect(chaiResponse.status).to.equal(200);
  })
})
