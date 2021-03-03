import 'jest-extended';
import request from 'supertest';
import { Connection, createConnection, getConnection } from 'typeorm';
import { getApp } from '../src/app';
import { User } from '../src/entity/User';

const app = getApp();

describe('Test Template', () => {
    let con: Connection;
    beforeAll(async () => {
        con = await createConnection();
        await getConnection()
            .getRepository(User)
            .insert({ email: 'teste', name: 'testeName', password: 'testpassword' });
    });

    test('Request / should return User Array!', async () => {
        const result = await request(app).get('/');

        expect(result.status).toBe(200);
        expect(result.body.data).toBeArrayOfSize(1);
        expect(result.body.data[0].email).toBe('teste');
    });

    afterAll(() => {
        con.close();
    });
});
