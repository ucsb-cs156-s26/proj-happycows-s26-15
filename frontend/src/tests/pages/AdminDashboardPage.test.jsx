import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import AdminDashboardPage from "main/pages/AdminDashboardPage";
import { vi } from "vitest";

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useParams: () => ({
    id: 1,
  }),
}));

describe("AdminDashboardPage tests", () => {
  test("renders dashboard placeholder page", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <AdminDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByTestId("AdminDashboardPage-commonsId"),
    ).toHaveTextContent("Commons ID: 1");
    expect(screen.getByText("Cows Over Time")).toBeInTheDocument();

    expect(screen.getByText("Average Health Over Time")).toBeInTheDocument();
  });
});
