class CartPage {
  constructor(page) {
    this.page = page;
    this.placeOrderButton = page.locator('button:has-text("Place Order")');
    this.emptyMessage = page.locator('text=Your cart is empty');
    this.orderConfirmation = page.locator('text=Order');
  }

  async navigate() {
    await this.page.goto('/cart');
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
module.exports = CartPage;