const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const AdminProductsPage = require('../pages/AdminProductsPage');

test('Admin can add a product', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new AdminProductsPage(page);

  await loginPage.navigate();
  await loginPage.login('admin@admin.com', 'admin');

  await productsPage.navigate();
  await productsPage.fillForm('Notebook', '15.50', '100');
  await productsPage.uploadImage('./tests/fixtures/notebook.jpg');
  await productsPage.createProduct();

  await expect(productsPage.successMessage).toContainText('Product added successfully');
  await expect(productsPage.productTable).toContainText('Notebook');
});