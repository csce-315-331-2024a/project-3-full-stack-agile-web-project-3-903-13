import Page from './page'; // Import the Page component with the slideshow

export const metadata = {
  title: 'Menu Board',
  description: 'Menu Board',
};

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