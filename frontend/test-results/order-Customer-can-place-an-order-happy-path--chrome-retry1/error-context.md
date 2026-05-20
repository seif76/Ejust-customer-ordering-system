# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order.spec.js >> Customer can place an order (happy path)
- Location: tests\e2e\order.spec.js:5:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]: The connection was reset.
    - generic [ref=e9]:
      - paragraph [ref=e10]: "Try:"
      - list [ref=e11]:
        - listitem [ref=e12]: Checking the connection
        - listitem [ref=e13]:
          - link "Checking the proxy and the firewall" [ref=e14] [cursor=pointer]:
            - /url: "#buttons"
        - listitem [ref=e15]:
          - link "Running Windows Network Diagnostics" [ref=e16] [cursor=pointer]:
            - /url: javascript:diagnoseErrors()
    - generic [ref=e17]: ERR_CONNECTION_RESET
  - generic [ref=e18]:
    - button "Reload" [ref=e20] [cursor=pointer]
    - button "Details" [ref=e21] [cursor=pointer]
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
     |                     ^ Error: page.goto: net::ERR_CONNECTION_RESET at http://localhost:3000/login
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