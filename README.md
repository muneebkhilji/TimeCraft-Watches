# TimeCraft Watches - React + Vite + Tailwind CSS demo store

A complete, beginner-friendly e-commerce watch store for learning and academic demonstration.

**Built with:** React (JavaScript/JSX), Vite, Tailwind CSS v3, React Router DOM, React Context API, browser localStorage and Lucide React icons. There is no backend, database or external service.

> **Important:** This is a demo. Accounts, passwords, orders and the admin area are saved in your browser's localStorage. That is **not secure** and is not real authentication. No payments are processed.

---

## 1. Setup on Windows (step by step)

1. **Install Node.js (LTS version 18 or newer)** from https://nodejs.org and accept the defaults. Restart your terminal afterwards.
2. **Check the install.** Open **Command Prompt** or **PowerShell** and run:
   ```
   node -v
   npm -v
   ```
   Both should print a version number (Node 18, 20 or 22 all work).
3. **Unzip the project.** Right-click `timecraft-watches.zip` and choose **Extract All...**. You will get a folder named `timecraft-watches`.
4. **Open a terminal inside the project folder.** Either:
   - In File Explorer, open the `timecraft-watches` folder, click the address bar, type `cmd` and press Enter; or
   - Run `cd C:\path\to\timecraft-watches` in your terminal (for example `cd %USERPROFILE%\Downloads\timecraft-watches`).
5. **Install dependencies** (needs internet, takes about a minute):
   ```
   npm install
   ```
6. **Start the development server:**
   ```
   npm run dev
   ```
7. **Open the store** at the address shown in the terminal (normally http://localhost:5173).
8. Press `Ctrl + C` in the terminal to stop the server.

Optional: `npm run build` creates a production build in `dist/`, and `npm run preview` serves it.

---

## 2. Demo logins

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@timecraft.com` | `Admin@12345` |
| **Customer** | `customer@timecraft.com` | `Customer@123` |

You can also create your own customer account on the Sign up page. New sign-ups are always customers. Logging in as the admin takes you to `/admin`.

---

## 3. Implemented features

**Pages (each with its own URL, working on direct open/refresh):**
`/` Home, `/products`, `/products/:id`, `/cart`, `/login`, `/signup`, `/checkout`, `/order-confirmation/:orderId`, `/orders`, `/admin` (overview), `/admin/products`, `/admin/orders`, and a 404 page.

**Storefront**
- Responsive navbar with search, live cart count, login/logout, mobile menu.
- Hero section, featured watches, category tiles, promo banner, footer.
- 13 sample watches (one is sold out on purpose to show the unavailable message).
- Search by name or brand, category filter, price range, sort (featured, price low-high, price high-low, A-Z). All filters work together and live in the URL. Clear-all-filters button and a no-results message.
- Product details with quantity selector limited to stock, add to cart, continue shopping, related products.
- Image fallbacks: if a remote image fails to load, a built-in watch picture is shown.

**Cart and checkout**
- Add, increase, decrease, remove, clear (with confirmation). Line totals, subtotal, shipping, total.
- Quantities can never exceed stock. The cart is saved in localStorage and cleaned automatically if a product is deleted or sells out.
- Checkout validates every field, re-checks stock, creates a unique order ID, saves the order, reduces stock, then clears the cart. A processing state and a submit lock stop duplicate orders.
- Shipping: flat $25, **free for orders of $1,000 or more**. The page states clearly that no payment is collected.

**Accounts**
- Signup validation: required fields, email format, password of 8+ characters, matching confirmation, duplicate-email prevention, success message.
- Login with clear error messages, redirect back to the page you wanted, logout.

**Orders**
- Confirmation page (order ID, date, items, total, shipping address, status).
- My Orders page: customers only see their own orders and their live status.

**Admin panel (separate sidebar layout)**
- Overview: total products, orders, customers, and sales from non-cancelled orders.
- Products: list, add, edit, delete (with confirmation), quick stock update, validated forms, success/error messages.
- Orders: all orders with customer details, items, totals; status dropdown (Pending, Processing, Shipped, Delivered, Cancelled).
- Allowed status changes: Pending -> Processing or Cancelled; Processing -> Shipped or Cancelled; Shipped -> Delivered. Delivered and Cancelled are final.
- Cancelling returns the items to stock **exactly once** (the order remembers it was restored, and cancelled orders cannot be reopened). Products deleted after the order was placed are skipped safely.
- A "Reset demo data" button on the overview page restores the original sample data.

**Data handling**
- Sample products and accounts are seeded only when that data is missing from localStorage.
- localStorage reads use safe parsing, so broken data cannot crash the app.
- Orders store a copy of each item's name, price and image, so editing or deleting a product never breaks old orders.

---

## 4. Project structure

```
src/
  components/   Navbar, Footer, layouts, ProductCard, ProductForm, route guards, small UI pieces
  pages/        Home, Products, ProductDetails, Cart, Login, Signup, Checkout, ...
    admin/      AdminDashboard, AdminProducts, AdminOrders
  context/      AuthContext, ProductContext, CartContext, OrderContext
  data/         sampleProducts.js, sampleUsers.js
  utils/        storage, validation, pricing, formatting, filters, order status rules
  App.jsx       Route definitions
  main.jsx      Providers + router
  index.css     Tailwind + a few shared button/input styles
```

Provider order in `main.jsx` matters: Auth -> Products -> Cart -> Orders (the cart needs products; orders need products and the cart).

---

## 5. Security limitations (please read)

- Passwords are stored as plain text in localStorage. Anyone can open the browser developer tools and read or change them.
- The admin route protection only hides pages in the browser. A user could edit localStorage to make themselves an admin. Real stores must check permissions on a server.
- Data lives only in the browser it was created in. Clearing site data or switching browsers resets the store.

---

## 6. Troubleshooting

| Problem | Fix |
|---------|-----|
| `'npm' is not recognized` | Node.js is not installed or the terminal was opened before installing. Install Node LTS and open a **new** terminal. |
| `npm install` fails with `ENOENT ... package.json` | You are in the wrong folder. `cd` into the folder that contains `package.json`. |
| `npm ERR! code EACCES` / permission errors | Move the project to a simple folder such as `C:\projects\timecraft-watches` and run the terminal as a normal user (not inside Program Files). |
| `npm ERR! network` / timeouts | Check your internet or proxy/VPN, then run `npm cache clean --force` and `npm install` again. |
| PowerShell says "running scripts is disabled" | Use **Command Prompt** instead, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` in PowerShell. |
| `Port 5173 is already in use` | Vite will pick the next port automatically (see the terminal). Or stop the other dev server first. |
| Strange errors after a failed install | Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again. |
| Old or odd data in the store | Log in as admin and press **Reset demo data**, or clear site data for localhost in your browser settings. |
| Watch images do not show | They load from Unsplash and need internet. Without it, a built-in fallback watch image is shown instead. |
| Fonts look different offline | Headings and text use Google Fonts. Without internet, safe fallback fonts are used. |

---

## 7. Deploying to GitHub and Vercel

1. Create an empty repository on GitHub (no README, no .gitignore).
2. In the project folder run:
   ```
   git init
   git add .
   git commit -m "TimeCraft Watches"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/timecraft-watches.git
   git push -u origin main
   ```
3. On https://vercel.com choose **Add New > Project**, import the repository, keep the detected **Vite** settings (build command `npm run build`, output directory `dist`) and click **Deploy**.
4. `vercel.json` makes direct links and page refreshes (for example `/products/p3` or `/admin`) work on the live site.
