class AdminProductsPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.priceInput = page.locator('input[name="price"]');
    this.stockInput = page.locator('input[name="stock"]');
    this.uploadButton = page.locator('button:has-text("Upload")');
    this.createButton = page.locator('button:has-text("Create Product")');
    this.productTable = page.locator('table');
    this.successMessage = page.locator('.bg-green-50');
  }

  async navigate() {
    await this.page.goto('/admin/products');
  }

  async fillForm(name, price, stock) {
    await this.nameInput.fill(name);
    await this.priceInput.fill(price);
    await this.stockInput.fill(stock);
  }

  async uploadImage(filePath) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  async createProduct() {
    await this.createButton.click();
  }
}
module.exports = AdminProductsPage;