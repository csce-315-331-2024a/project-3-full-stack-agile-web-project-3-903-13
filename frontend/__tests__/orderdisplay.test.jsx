import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios"; // Import axios for mocking
import OrderDisplayPage from "@/app/orderDisplay/page";

jest.mock("axios"); // Mock axios to control its behavior



describe("OrderDisplayPage component", () => {
  beforeEach(() => {
    // Mock axios responses for both API calls
    axios.get.mockResolvedValueOnce({ data: [{ transactionid: 1 }] }); // Mock in-progress orders
    axios.get.mockResolvedValueOnce({ data: [{ transactionid: 2 }] }); // Mock recent fulfilled orders
  });

  it("should render the preparing and collect sections with order IDs", async () => {
    render(<OrderDisplayPage />);

    const preparingSection = await screen.findByText(/Preparing.../, { exact: false });
    const collectSection = await screen.findByText(/Please Collect/, { exact: false });

    expect(preparingSection).toBeInTheDocument();
    expect(collectSection).toBeInTheDocument();

    const preparingOrders = screen.getAllByText(/#[0-9]{3}/);
    const collectOrders = screen.getAllByText(/#[0-9]{3}/);

    expect(preparingOrders.length).toBe(2);
    expect(collectOrders.length).toBe(2);
  });


});
