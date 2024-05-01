/**
 * @module UserManagement/Layout
 * @description Root layout component that wraps children with global styles and appropriate HTML structure.
 */

import "../globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'User Management',
  description: 'User Management',
};

/**
 * Provides the root HTML structure for user management-related pages, encapsulating any child components passed to it.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 * @returns {React.Component} The root layout component with the specified children.
 */
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
