const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo workflow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('Page loads and shows existing todos', async ({ page }) => {
    const items = await todoPage.getTodoItems();
    expect(items.length).toBeGreaterThan(0);
  });

  test('Add a new task', async ({ page }) => {
    await todoPage.addTodo('Buy groceries');

    const item = page
      .locator('li.todo-item')
      .filter({ hasText: 'Buy groceries' });
    await expect(item).toBeVisible();
  });

  test('Add a task with due date', async ({ page }) => {
    await todoPage.addTodo('Doctor appointment', '2025-12-31');

    const item = page
      .locator('li.todo-item')
      .filter({ hasText: 'Doctor appointment' });
    await expect(item).toBeVisible();
  });

  test('Delete a task', async ({ page }) => {
    const taskName = `Task to delete ${Date.now()}`;
    await todoPage.addTodo(taskName);

    const item = page
      .locator('li.todo-item')
      .filter({ hasText: taskName });
    await expect(item).toBeVisible();

    await todoPage.deleteTodo(taskName);

    await expect(item).not.toBeVisible();
  });

  test('Add and remove a tag', async ({ page }) => {
    const taskName = `Tag test task ${Date.now()}`;
    await todoPage.addTodo(taskName);
    await todoPage.addTag(taskName, 'urgent');

    const item = page
      .locator('li.todo-item')
      .filter({ hasText: taskName });
    await expect(item.locator('.tag-name', { hasText: 'urgent' })).toBeVisible();

    await todoPage.removeTag(taskName, 'urgent');

    await expect(
      item.locator('.tag-name', { hasText: 'urgent' })
    ).not.toBeVisible();
  });

  test('Edit a tag name', async ({ page }) => {
    const taskName = `Edit tag task ${Date.now()}`;
    await todoPage.addTodo(taskName);
    await todoPage.addTag(taskName, 'oldname');

    const item = page
      .locator('li.todo-item')
      .filter({ hasText: taskName });
    await expect(item.locator('.tag-name', { hasText: 'oldname' })).toBeVisible();

    await todoPage.editTag(taskName, 'oldname', 'newname');

    await expect(item.locator('.tag-name', { hasText: 'newname' })).toBeVisible();
    await expect(
      item.locator('.tag-name', { hasText: 'oldname' })
    ).not.toBeVisible();
  });
});
