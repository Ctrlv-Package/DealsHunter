const request = require('supertest');
const express = require('express');

const app = express();
app.get('/api/test', (req, res) => res.json({ message: 'ok' }));

describe('GET /api/test', () => {
  it('responds with json', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'ok');
  });
});
