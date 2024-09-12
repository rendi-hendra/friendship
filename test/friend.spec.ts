import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('FriendController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/friends', () => {
    beforeEach(async () => {
      await testService.deleteFriends();
      await testService.deleteUser();
      await testService.createUser();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/friends')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if friendId not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/friends')
        .set('Authorization', 'test')
        .send({
          friendId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request to yourself', async () => {
      const userId = (await testService.getUser()).id;
      const response = await request(app.getHttpServer())
        .post('/api/friends')
        .set('Authorization', 'test')
        .send({
          friendId: userId,
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to send friend request', async () => {
      const friendId = (await testService.getFriendId()).id;
      const response = await request(app.getHttpServer())
        .post('/api/friends')
        .set('Authorization', 'test')
        .send({
          friendId: friendId,
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.friendId).toBe(friendId);
      expect(response.body.data.status).toBe('PENDING');
    });
  });

  describe('GET /api/friends/current', () => {
    it('should be able to get friends request', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/friends/current')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/friends/:userId', () => {
    beforeEach(async () => {
      await testService.updateStatus('PENDING');
    });
    it('should be able to accept friend request', async () => {
      const userId = await testService.getuserId();
      const response = await request(app.getHttpServer())
        .patch(`/api/friends/${userId.id}`)
        .set('Authorization', 'test2')
        .send({
          status: 'ACCEPTED',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('ACCEPTED');
    });

    it('should be rejected if request friend is invalid', async () => {
      const userId = await testService.getuserId();
      const response = await request(app.getHttpServer())
        .patch(`/api/friends/${userId.id + 1}`)
        .set('Authorization', 'test2')
        .send({
          status: 'ACCEPTED',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request yourself is invalid', async () => {
      const userId = await testService.getuserId();
      const response = await request(app.getHttpServer())
        .patch(`/api/friends/${userId.id}`)
        .set('Authorization', 'test')
        .send({
          status: 'ACCEPTED',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/friends', () => {
    beforeEach(async () => {
      await testService.updateStatus('ACCEPTED');
    });

    afterEach(async () => {
      await testService.updateStatus('PENDING');
    });

    it('should be able to get friends response', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/friends')
        .set('Authorization', 'test2');

      logger.info(response.body.data);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });
});
