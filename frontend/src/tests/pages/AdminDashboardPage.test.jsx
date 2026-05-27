import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import AdminDashboardPage from "main/pages/AdminDashboardPage";
import { vi } from "vitest";

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useParams: () => ({
    id: 1,
  }),
}));

describe("AdminDashboardPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();

    axiosMock.onGet("/api/commonstats/commons").reply(200, [
      {
        id: 1,
        numCows: 12,
        avgHealth: 95,
      },
    ]);

    axiosMock.onGet("/api/dashboard/histogram/1").reply(200, [
      {
        username: "farmer1",
        numOfCows: 12,
      },
    ]);
  });

  test("renders dashboard and loads api data", async () => {
    const testQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter>
          <AdminDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Cow Ownership Histogram")).toBeInTheDocument();
    });

    expect(screen.getByText("Cows Over Time")).toBeInTheDocument();

    expect(screen.getByText("Average Health Over Time")).toBeInTheDocument();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThan(0);
    });

    expect(
      axiosMock.history.get.some(
        (req) =>
          req.url === "/api/commonstats/commons" && req.params.commonsId === 1,
      ),
    ).toBe(true);

    expect(
      axiosMock.history.get.some(
        (req) => req.url === "/api/dashboard/histogram/1",
      ),
    ).toBe(true);
  });
});
