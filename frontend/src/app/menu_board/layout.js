/**
 * @module MenuBoard/Layout
 * @description Root layout component for the MenuBoard page.
 */

import Page from './page'; // Import the Page component with the slideshow

export const metadata = {
  title: 'Menu Board',
  description: 'Menu Board',
};

/**
 * Provides the root HTML structure for the Menu Board page, encapsulating any child components passed to it.
 * It sets up a basic HTML layout with the specified children.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout.
 * @returns {React.Component} The root layout component with the specified children.
 */
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
        {/* Render the Page component with the slideshow */}
        <Page />
       
      </body>
    </html>
  )
}