const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CartPage = require('../pages/CartPage');

test('Customer can place an order (happy path)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cartPage = new CartPage(page);

  await loginPage.navigate();
  await loginPage.login('customer@test.com', 'password123');

  // Ensure cart has items (you can add a product via API beforehand)
  await cartPage.navigate();
  await expect(page.locator('text=Your cart is empty')).not.toBeVisible();
  await cartPage.placeOrder();

  await expect(page).toHaveURL(/\/orders/);
  await expect(page.locator('text=Your cart is empty')).toBeVisible();
  await expect(cartPage.orderConfirmation).toBeVisible();
});