class ProductDetailPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator('button:has-text("Add to Cart")');
    this.outOfStockButton = page.locator('button:has-text("Out of Stock")');
  }

  async goto(productId) {
    await this.page.goto(`/products/${productId}`);
  }
}
module.exports = ProductDetailPage;