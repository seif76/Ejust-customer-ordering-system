class AdminOrdersPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/admin/orders');
  }

  confirmButton(orderId) {
    return this.page.locator(`tr:has-text("#${orderId}") >> button:has-text("Confirm")`);
  }

  statusCell(orderId) {
    return this.page.locator(`tr:has-text("#${orderId}") >> td:has-text("confirmed")`);
  }

  async confirmOrder(orderId) {
    await this.confirmButton(orderId).click();
  }
}
module.exports = AdminOrdersPage;