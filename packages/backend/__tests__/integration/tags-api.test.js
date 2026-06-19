const request = require('supertest');
const { app, db } = require('../../src/app');

beforeEach(() => {
  db.exec('DELETE FROM items');
  db.exec('DELETE FROM tags');
});

afterAll(() => {
  db.close();
});

describe('Tags API', () => {
  it('GET /api/tags on fresh db returns empty array', async () => {
    const res = await request(app).get('/api/tags');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('Create a tag via POST /api/items/:id/tags, then GET /api/tags returns it', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item A' });
    await request(app)
      .post(`/api/items/${item.body.id}/tags`)
      .send({ name: 'my-tag' });

    const res = await request(app).get('/api/tags');

    expect(res.status).toBe(200);
    expect(res.body.some(t => t.name === 'my-tag')).toBe(true);
  });

  it('PUT /api/tags/:id renames tag correctly', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item B' });
    const tagRes = await request(app)
      .post(`/api/items/${item.body.id}/tags`)
      .send({ name: 'before' });

    const res = await request(app)
      .put(`/api/tags/${tagRes.body.id}`)
      .send({ name: 'after' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: tagRes.body.id, name: 'after' });
  });

  it('PUT /api/tags/:id with name of existing tag returns 409', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item C' });
    const id = item.body.id;

    const tag1 = await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'existing' });
    await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'other' });

    const res = await request(app)
      .put(`/api/tags/${tag1.body.id}`)
      .send({ name: 'other' });

    expect(res.status).toBe(409);
  });

  it('PUT /api/tags/:id on unknown id returns 404', async () => {
    const res = await request(app)
      .put('/api/tags/99999')
      .send({ name: 'ghost' });

    expect(res.status).toBe(404);
  });
});
