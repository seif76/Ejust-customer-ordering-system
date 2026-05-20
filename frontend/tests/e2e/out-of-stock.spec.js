const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductDetailPage = require('../pages/ProductDetailPage');

test('Out-of-stock product cannot be added', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const detailPage = new ProductDetailPage(page);

  await loginPage.navigate();
  await loginPage.login('customer@test.com', 'password123');

  await detailPage.goto(999); // a product with stock = 0
  await expect(detailPage.outOfStockButton).toBeVisible();
  await expect(detailPage.addToCartButton).not.toBeVisible();
});