import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import AdminCommonsCard from "main/components/Commons/AdminCommonsCard";
import commonsPlusFixtures from "fixtures/commonsPlusFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import * as useBackend from "main/utils/useBackend";
import { onDeleteSuccess } from "main/utils/commonsUtils";
import { vi } from "vitest";
import "@testing-library/jest-dom";

const mockToast = vi.fn();

vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockedNavigate = vi.fn();

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => mockedNavigate,
}));

describe("AdminCommonsCard tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    mockedNavigate.mockClear();
    mockToast.mockClear();
  });

  test("renders without crashing for admin user", () => {
    const queryClient = new QueryClient();
    const commonItem = commonsPlusFixtures.threeCommonsPlus[0];
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCommonsCard commonItem={commonItem} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("AdminCommonsCard-1")).toBeInTheDocument();
  });

  test("dashboard button has correct href and testid", () => {
    const queryClient = new QueryClient();
    const commonItem = commonsPlusFixtures.threeCommonsPlus[0];
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCommonsCard commonItem={commonItem} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const dashboardButton = screen.getByTestId("AdminCommonsCard-Dashboard-1");

    expect(dashboardButton).toBeInTheDocument();

    expect(dashboardButton).toHaveAttribute("href", "/admin/dashboard/1");

    expect(dashboardButton).toHaveAttribute(
      "data-testid",
      "AdminCommonsCard-Dashboard-1",
    );
  });

  test("returns null for non-admin user", () => {
    const queryClient = new QueryClient();
    const commonItem = commonsPlusFixtures.threeCommonsPlus[0];
    const currentUser = currentUserFixtures.userOnly;

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCommonsCard commonItem={commonItem} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  test("delete mutation invalidates commons cache", () => {
    const queryClient = new QueryClient();
    const commonItem = commonsPlusFixtures.threeCommonsPlus[0];
    const currentUser = currentUserFixtures.adminUser;

    const useBackendMutationSpy = vi.spyOn(useBackend, "useBackendMutation");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCommonsCard commonItem={commonItem} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(useBackendMutationSpy).toHaveBeenCalledWith(
      expect.any(Function),
      { onSuccess: onDeleteSuccess },
      ["/api/commons/allplus"],
    );

    useBackendMutationSpy.mockRestore();
  });

  test("modal delete button confirms deletion", async () => {
    const queryClient = new QueryClient();
    const commonItem = commonsPlusFixtures.threeCommonsPlus[0];
    const currentUser = currentUserFixtures.adminUser;

    axiosMock
      .onDelete("/api/commons", { params: { id: 1 } })
      .reply(200, "Commons with id 1 was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCommonsCard commonItem={commonItem} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId("AdminCommonsCard-Delete-1");

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByTestId("AdminCommonsCard-Modal-Delete-1"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Modal-Delete-1"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Commons with id 1 was deleted");
    });

    expect(axiosMock.history.delete.length).toBe(1);

    expect(axiosMock.history.delete[0].params).toEqual({
      id: 1,
    });
  });

  test("clicking Chat button navigates to admin chat page", () => {
    const queryClient = new QueryClient();
    const commonItem = commonsPlusFixtures.threeCommonsPlus[0];
    const currentUser = currentUserFixtures.adminUser;

    mockedNavigate.mockClear();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCommonsCard commonItem={commonItem} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const chatButton = screen.getByTestId("AdminCommonsCard-Chat-1");
    expect(chatButton).toBeInTheDocument();
    fireEvent.click(chatButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/admin/chat/1");
  });
});
