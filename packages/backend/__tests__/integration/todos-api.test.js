const request = require('supertest');
const { app, db } = require('../../src/app');

beforeEach(() => {
  db.exec('DELETE FROM items');
  db.exec('DELETE FROM tags');
});

afterAll(() => {
  db.close();
});

describe('Items CRUD', () => {
  it('GET /api/items returns array where each item has id, name, due_date, created_at, tags', async () => {
    await request(app).post('/api/items').send({ name: 'Seed Item' });

    const res = await request(app).get('/api/items');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const item = res.body[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('due_date');
    expect(item).toHaveProperty('created_at');
    expect(item).toHaveProperty('tags');
    expect(Array.isArray(item.tags)).toBe(true);
  });

  it('POST /api/items with { name } creates item with due_date: null and tags: []', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Simple Item' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Simple Item');
    expect(res.body.due_date).toBeNull();
    expect(res.body.tags).toEqual([]);
  });

  it('POST /api/items with { name, dueDate } stores due date', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Dated Item', dueDate: '2025-12-31' });

    expect(res.status).toBe(201);
    expect(res.body.due_date).toBe('2025-12-31');
  });

  it('POST /api/items with invalid dueDate (not-a-date) returns 400', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Bad Date Item', dueDate: 'not-a-date' });

    expect(res.status).toBe(400);
  });

  it('PUT /api/items/:id updates name', async () => {
    const created = await request(app)
      .post('/api/items')
      .send({ name: 'Original Name' });
    const { id } = created.body;

    const res = await request(app)
      .put(`/api/items/${id}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('PUT /api/items/:id updates due date', async () => {
    const created = await request(app)
      .post('/api/items')
      .send({ name: 'Item for date update' });
    const { id } = created.body;

    const res = await request(app)
      .put(`/api/items/${id}`)
      .send({ dueDate: '2026-06-01' });

    expect(res.status).toBe(200);
    expect(res.body.due_date).toBe('2026-06-01');
  });

  it('PUT /api/items/:id on unknown id returns 404', async () => {
    const res = await request(app)
      .put('/api/items/99999')
      .send({ name: 'Ghost Item' });

    expect(res.status).toBe(404);
  });

  it('DELETE /api/items/:id removes the item', async () => {
    const created = await request(app)
      .post('/api/items')
      .send({ name: 'To Delete' });
    const { id } = created.body;

    const delRes = await request(app).delete(`/api/items/${id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.id).toBe(id);

    const getRes = await request(app).get('/api/items');
    const ids = getRes.body.map(i => i.id);
    expect(ids).not.toContain(id);
  });

  it('DELETE /api/items/:id on unknown id returns 404', async () => {
    const res = await request(app).delete('/api/items/99999');

    expect(res.status).toBe(404);
  });
});

describe('Tags on items', () => {
  it('POST /api/items/:id/tags adds tag and returns { id, name }', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Tagged Item' });
    const { id } = item.body;

    const res = await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'urgent' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('urgent');
  });

  it('POST /api/items/:id/tags on same name twice does not duplicate (tag reused)', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item for dup tag' });
    const { id } = item.body;

    const first = await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'dup' });
    const second = await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'dup' });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(first.body.id).toBe(second.body.id);

    const getRes = await request(app).get('/api/items');
    const found = getRes.body.find(i => i.id === id);
    expect(found.tags.filter(t => t.name === 'dup').length).toBe(1);
  });

  it('GET /api/items returns item with its tags populated', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item with tag' });
    const { id } = item.body;
    await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'mytag' });

    const res = await request(app).get('/api/items');
    const found = res.body.find(i => i.id === id);

    expect(found).toBeDefined();
    expect(found.tags.some(t => t.name === 'mytag')).toBe(true);
  });

  it('DELETE /api/items/:id/tags/:tagId removes the association (returns 204)', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item to untag' });
    const { id } = item.body;
    const tagRes = await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'removeme' });
    const tagId = tagRes.body.id;

    const delRes = await request(app).delete(`/api/items/${id}/tags/${tagId}`);
    expect(delRes.status).toBe(204);

    const getRes = await request(app).get('/api/items');
    const found = getRes.body.find(i => i.id === id);
    expect(found.tags.some(t => t.id === tagId)).toBe(false);
  });

  it('DELETE /api/items/:id/tags/:tagId on non-existent association returns 404', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item no tag' });
    const { id } = item.body;

    const res = await request(app).delete(`/api/items/${id}/tags/99999`);

    expect(res.status).toBe(404);
  });
});

describe('Tags global', () => {
  it('GET /api/tags returns all tags', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item for global tags' });
    await request(app)
      .post(`/api/items/${item.body.id}/tags`)
      .send({ name: 'global-tag' });

    const res = await request(app).get('/api/tags');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(t => t.name === 'global-tag')).toBe(true);
  });

  it('PUT /api/tags/:id renames a tag', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item for rename' });
    const tagRes = await request(app)
      .post(`/api/items/${item.body.id}/tags`)
      .send({ name: 'oldname' });
    const tagId = tagRes.body.id;

    const res = await request(app)
      .put(`/api/tags/${tagId}`)
      .send({ name: 'newname' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('newname');
  });

  it('PUT /api/tags/:id with duplicate name returns 409', async () => {
    const item = await request(app)
      .post('/api/items')
      .send({ name: 'Item for conflict' });
    const id = item.body.id;

    const tag1 = await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'tag-a' });
    await request(app)
      .post(`/api/items/${id}/tags`)
      .send({ name: 'tag-b' });

    const res = await request(app)
      .put(`/api/tags/${tag1.body.id}`)
      .send({ name: 'tag-b' });

    expect(res.status).toBe(409);
  });
});
