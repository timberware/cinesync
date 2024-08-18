import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

describe.skip('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('handles a signup, signin, and delete requests', async () => {
    const username = 'asdf';
    const email = 'asdf@asdf.asdf';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username,
        email,
        password: 'asdf',
      })
      .expect(201);

    const signin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'asdf',
      })
      .expect(200);

    const token = `Bearer ${signin.body.accessToken}`;
    await request(app.getHttpServer())
      .delete('/auth/delete')
      .set('Authorization', token)
      .expect(204);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const username = 'asdf2';
    const email = 'asdf2@asdf.com';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username,
        email,
        password: 'asdf',
      })
      .expect(201);

    const signin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'asdf',
      })
      .expect(200);

    const token = `Bearer ${signin.body.accessToken}`;
    const whoami = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Authorization', token)
      .expect(200);

    expect(whoami.body.id).toBeDefined();
    expect(whoami.body.username).toEqual(username);
    expect(whoami.body.email).toEqual(email);

    await request(app.getHttpServer())
      .delete('/auth/delete')
      .set('Authorization', token)
      .expect(204);
  });
});
