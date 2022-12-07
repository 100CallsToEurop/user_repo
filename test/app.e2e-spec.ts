import { INestApplication } from '@nestjs/common';
import { UserInputModel } from '../src/modules/users/api/model/user.model';

import * as request from 'supertest';
import { getAppForE2ETesting } from './utils/connect.utils';
import { truncateDBTables } from './utils/sql-func.utils';
import { responseHeadersAuth } from './utils/get-tokens-from-response';


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration - /auth/registration', () => {

    const requestUserParams: UserInputModel = {
      email: 'test2mail.ru',
      login: 'aaaa',
      password: '123'
    }

    const loginUser = {
      email: 'test2mail.ru',
      password: '123',
    };

    const loginUserBad = {
      email: 'test2mail.ru',
      password: '232',
    };

    let accessToken_user;
    let refreshToken_user;

    beforeAll(async () => {
      await truncateDBTables(app);
    });

    it('should return new access and refresh tokens [POST -> 201]', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration')
        .send(requestUserParams)
        .expect(201)

        const { accessToken, refreshToken } = responseHeadersAuth(response);
        expect(accessToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        );
        expect(refreshToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        );
    });

    it('should return new access and refresh tokens [POST -> 201]', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUser)
        .expect(201);

      const { accessToken, refreshToken } = responseHeadersAuth(response);
      expect(accessToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
      expect(refreshToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );

      accessToken_user = accessToken;
      refreshToken_user = refreshToken;
    });

    it('should return error [POST -> 401]', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserBad)
        .expect(401);
    });

    it('should return user [POST -> 200]', async () => {
      const reponse = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken_user}`)
        .set('Cookie', refreshToken_user)
        .expect(200);
        const user = reponse.body;
        expect(user.login).toBe(requestUserParams.login);
    });

  });
});
