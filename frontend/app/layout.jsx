import "./globals.css";
import { CartProvider } from "./context/CartContext";


export const metadata = {
  title: "E-JUST Customer Ordering System",
  description: "University merchandise e-commerce storefront",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<head>
        <script 
          src="https://upload-widget.cloudinary.com/global/all.js" 
          async
          defer
        />
      </head>      
      <body className="bg-gray-50 text-neutral-900 antialiased m-0 p-0">
         <CartProvider>

        {children}
        </CartProvider>

      </body>
    </html>
  );
}