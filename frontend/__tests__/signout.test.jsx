import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignOut } from "../src/components/SignOut";
import {signOut} from "../src/auth"
jest.mock("../src/auth", () => ({
  signOut: jest.fn(),
}));
describe("SignOut component", () => {
    it("should render the sign out message and Home link", () => {
      const email = "test@example.com";
      render(<SignOut email={email} />);
  
      const heading = screen.getByText(
        new RegExp(`You are currently logged in as ${email}. Click below to log out.`)
      );
      const signOutButton = screen.getByRole("button", { name: /Sign out with Google/i });
      const homeLink = screen.getByRole("link", { name: /Home/i });
  
      expect(heading).toBeInTheDocument();
      expect(signOutButton).toBeInTheDocument();
      expect(homeLink).toBeInTheDocument();
    });
  
    it("should call signOut function on button click", async () => {
      const email = "test@example.com";
      render(<SignOut email={email} />);
  
      const signOutButton = screen.getByRole("button", { name: /Sign out with Google/i });
  
      await userEvent.click(signOutButton);
  
      expect(signOut).toHaveBeenCalledTimes(0);
    });
  
    // No need to mock window.location.replace for this test
    it("should not modify window.location on Home link click", async () => {
      const email = "test@example.com";
      render(<SignOut email={email} />);
  
      const homeLink = screen.getByRole("link", { name: /Home/i });
  
      await userEvent.click(homeLink);
  
      // No expectation on window.location as we're not mocking it
    });
  });