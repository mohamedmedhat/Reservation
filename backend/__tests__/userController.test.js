import request from 'supertest';
import app from '../server';
import User from '../models/user';

describe('POST /users/reg', () => {
    it('should register a new user', async () => {
      const userData = {
        name:'mo',
        lastname:'ahmed',
        phoneNumber:'0109078278',
        age:30,
        email: 'test@example.com',
        password: 'password123',
        
      };

      const response = await request(app)
        .post('/users/reg')
        .send(userData)
        .expect(201); // Expecting HTTP status code 201 for successful user registration

      // Optionally, you can assert other properties of the response body
      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe(userData.email);
      // Add more assertions as needed
    });
  });