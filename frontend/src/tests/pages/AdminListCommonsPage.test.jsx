import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import AdminListCommonPage from "main/pages/AdminListCommonPage";
import commonsPlusFixtures from "fixtures/commonsPlusFixtures";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import { vi } from "vitest";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

vi.mock("main/utils/currentUser", async () => {
  const actual = await vi.importActual("main/utils/currentUser");
  return {
    ...actual,
    useCurrentUser: () => ({
      data: currentUserFixtures.adminUser,
    }),
  };
});

describe("AdminListCommonPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();

    axiosMock
      .onGet("/api/commons/allplus")
      .reply(200, commonsPlusFixtures.threeCommonsPlus);
  });

  test("renders dashboard links", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminListCommonPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const dashboardButtons = await screen.findAllByText("Dashboard");

    expect(dashboardButtons.length).toBeGreaterThan(0);
  });
});
