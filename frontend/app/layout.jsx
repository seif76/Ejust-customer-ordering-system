import "./globals.css";

export const metadata = {
  title: "E-JUST Customer Ordering System",
  description: "University merchandise e-commerce storefront",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-neutral-900 antialiased m-0 p-0">
        {children}
      </body>
    </html>
  );
}