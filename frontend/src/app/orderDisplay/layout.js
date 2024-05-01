/**
 * @module OrderDisplay/Layout
 * @description Root layout component for the Order Display page.
 */


export const metadata = {
  title: 'Order Display',
  description: 'Order Display',
};
  
/**
 * Provides the root HTML structure for the Order Display page, encapsulating any child components passed to it.
 * It sets up a basic HTML layout with the specified children.
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
  