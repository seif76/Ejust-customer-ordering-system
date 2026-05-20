const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const AdminOrdersPage = require('../pages/AdminOrdersPage');

test('Admin can confirm a pending order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const ordersPage = new AdminOrdersPage(page);

  await loginPage.navigate();
  await loginPage.login('admin@admin.com', 'admin');

  await ordersPage.navigate();
  // Assume order #1 exists
  await ordersPage.confirmOrder(1);
  await expect(ordersPage.statusCell(1)).toBeVisible();
});