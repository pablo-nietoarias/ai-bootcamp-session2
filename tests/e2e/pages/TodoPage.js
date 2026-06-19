class TodoPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTodo(name, dueDate = null) {
    await this.page.fill('input[placeholder="Enter item name"]', name);
    if (dueDate) {
      await this.page.fill('input[type="date"]', dueDate);
    }
    await this.page.click('button.primary-button:has-text("Add Item")');
    await this.page
      .locator('li.todo-item')
      .filter({ hasText: name })
      .waitFor();
  }

  async deleteTodo(name) {
    const item = this.page
      .locator('li.todo-item')
      .filter({ has: this.page.locator('.todo-item-name', { hasText: name }) });
    await item.locator('button.secondary-button:has-text("Delete")').click();
  }

  async addTag(itemName, tagName) {
    const item = this.page
      .locator('li.todo-item')
      .filter({ has: this.page.locator('.todo-item-name', { hasText: itemName }) });
    await item.locator('input[placeholder="Add tag..."]').fill(tagName);
    await item.locator('button[aria-label="Add tag"]').click();
    await item.locator('.tag-name', { hasText: tagName }).waitFor();
  }

  async removeTag(itemName, tagName) {
    const item = this.page
      .locator('li.todo-item')
      .filter({ has: this.page.locator('.todo-item-name', { hasText: itemName }) });
    await item.locator(`button[aria-label="Remove tag ${tagName}"]`).click();
    await item
      .locator('.tag-name', { hasText: tagName })
      .waitFor({ state: 'hidden' });
  }

  async editTag(itemName, oldTagName, newTagName) {
    const item = this.page
      .locator('li.todo-item')
      .filter({ has: this.page.locator('.todo-item-name', { hasText: itemName }) });
    await item.locator('.tag-name', { hasText: oldTagName }).click();
    const input = item.locator('.tag-edit-input');
    await input.fill(newTagName);
    await input.press('Enter');
    await item.locator('.tag-name', { hasText: newTagName }).waitFor();
  }

  async getTodoItems() {
    await this.page.locator('li.todo-item').first().waitFor({ timeout: 5000 }).catch(() => {});
    return this.page.locator('li.todo-item').all();
  }

  async getTagsForItem(itemName) {
    const item = this.page
      .locator('li.todo-item')
      .filter({ has: this.page.locator('.todo-item-name', { hasText: itemName }) });
    return item.locator('.tag-name').all();
  }
}

module.exports = { TodoPage };
