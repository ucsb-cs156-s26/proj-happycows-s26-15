import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import AdminDashboardPage from "main/pages/AdminDashboardPage";
import * as useBackendModule from "main/utils/useBackend";
import { vi } from "vitest";

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useParams: () => ({
    id: 1,
  }),
}));

describe("AdminDashboardPage tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders dashboard and calls backend with correct endpoints", () => {
    const useBackendSpy = vi.spyOn(useBackendModule, "useBackend");

    useBackendSpy
      .mockReturnValueOnce({
        data: [{ id: 1, numCows: 12, avgHealth: 95 }],
      })
      .mockReturnValueOnce({
        data: [{ username: "farmer1", numOfCows: 12 }],
      });

    const testQueryClient = new QueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter>
          <AdminDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Cow Ownership Histogram")).toBeInTheDocument();
    expect(screen.getByText("Cows Over Time")).toBeInTheDocument();
    expect(screen.getByText("Average Health Over Time")).toBeInTheDocument();

    expect(useBackendSpy).toHaveBeenCalledWith(
      ["/api/commonstats/commons?commonsId=1"],
      {
        method: "GET",
        url: "/api/commonstats/commons",
        params: {
          commonsId: 1,
        },
      },
      [],
    );

    expect(useBackendSpy).toHaveBeenCalledWith(
      ["/api/dashboard/histogram/1"],
      {
        method: "GET",
        url: "/api/dashboard/histogram/1",
      },
      [],
    );

    useBackendSpy.mockRestore();
  });
});
