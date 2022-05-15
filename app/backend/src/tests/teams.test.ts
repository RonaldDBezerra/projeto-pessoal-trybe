import { Response } from 'superagent';
import { app } from '../app';
import { teams, primaryTeam } from './utils/team';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

let chaiResponse: Response;

describe('testa se a api tem os retornos corretos', () => {
  it('testa se o retorno da rota /teams, é o esperado', async () => {
    chaiResponse = await chai.request(app).get('/teams');

    expect(chaiResponse.status).to.equal(200);
    expect(chaiResponse.body).to.deep.equal(teams);
  })

  it('testa se o retorno da rota /teams/:id, é o esperado', async () => {
    chaiResponse = await chai.request(app).get('/teams/1');

    expect(chaiResponse.status).to.equal(200);
    expect(chaiResponse.body).to.deep.equal(primaryTeam[0]);
  })
})
