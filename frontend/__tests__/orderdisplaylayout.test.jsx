import { render } from "@testing-library/react";
import RootLayout from "../src/app/orderDisplay/layout"; // Assuming the file is named RootLayout.js

describe('RootLayout component', () => {
    test('renders children within HTML body', () => {
      // Arrange
      const ChildComponent = () => <div>Child Component</div>;
  
      // Act
      const { getByText } = render(
        <RootLayout>
          <ChildComponent />
        </RootLayout>
      );
  
      // Assert
      expect(getByText('Child Component')).toBeInTheDocument();
    });
  
    test('renders HTML with lang="en"', () => {
      // Arrange
      const ChildComponent = () => <div>Child Component</div>;
  
      // Act
      const { container } = render(
        <RootLayout>
          <ChildComponent />
        </RootLayout>
      );
  
      // Assert
      expect(container.firstChild).toHaveAttribute('lang', 'en');
    });
  });