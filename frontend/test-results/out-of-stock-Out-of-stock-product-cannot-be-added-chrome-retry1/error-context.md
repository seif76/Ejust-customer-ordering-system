# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: out-of-stock.spec.js >> Out-of-stock product cannot be added
- Location: tests\e2e\out-of-stock.spec.js:5:1

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | class LoginPage {
  2  |   constructor(page) {
  3  |     this.page = page;
  4  |     this.emailInput = page.locator('input[type="email"]');
  5  |     this.passwordInput = page.locator('input[type="password"]');
  6  |     this.loginButton = page.locator('button[type="submit"]');
  7  |   }
  8  | 
  9  |   async navigate() {
> 10 |     await this.page.goto('/login');
     |                     ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  11 |   }
  12 | 
  13 |   async login(email, password) {
  14 |     await this.emailInput.fill(email);
  15 |     await this.passwordInput.fill(password);
  16 |     await this.loginButton.click();
  17 |   }
  18 | }
  19 | module.exports = LoginPage;
```