import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import AdminCommonsCard from "main/components/Commons/AdminCommonsCard";

const {
  mockNavigate,
  mockMutate,
  mockAxiosParams,
  mockMutationOptions,
  mockMutationDeps,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockMutate: vi.fn(),
  mockAxiosParams: vi.fn(),
  mockMutationOptions: vi.fn(),
  mockMutationDeps: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("main/utils/currentUser", async () => {
  const actual = await vi.importActual("main/utils/currentUser");
  return {
    ...actual,
    hasRole: (currentUser, role) => currentUser?.roles?.includes(role),
  };
});

vi.mock("main/utils/useBackend", async () => {
  const actual = await vi.importActual("main/utils/useBackend");
  return {
    ...actual,
    useBackendMutation: (axiosParams, options, deps) => {
      mockAxiosParams.mockImplementation(axiosParams);
      mockMutationOptions(options);
      mockMutationDeps(deps);

      return {
        mutate: mockMutate,
      };
    },
  };
});

describe("AdminCommonsCard tests", () => {
  const queryClient = new QueryClient();

  const adminUser = { roles: ["ROLE_ADMIN"] };
  const regularUser = { roles: ["ROLE_USER"] };

  const sampleCommons = {
    commons: {
      id: 1,
      name: "Anika's Ant Farm",
      cowPrice: 45,
      milkPrice: 11,
      startingBalance: 1000,
      startingDate: "2024-01-01T00:00:00",
      lastDate: "2024-12-31T00:00:00",
      degradationRate: 0.02,
      showLeaderboard: true,
      showChat: true,
      capacityPerUser: 20,
      carryingCapacity: 100,
    },
    totalCows: 42,
    effectiveCapacity: 87,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (...args) => {
    const currentUser = args.length >= 1 ? args[0] : adminUser;
    const commonItem = args.length >= 2 ? args[1] : sampleCommons;

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminCommonsCard currentUser={currentUser} commonItem={commonItem} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  test("renders without crashing for admin user", () => {
    renderComponent();

    expect(screen.getByTestId("AdminCommonsCard-1")).toBeInTheDocument();
  });

  test("does not render for non-admin user", () => {
    renderComponent(regularUser);

    expect(screen.queryByTestId("AdminCommonsCard-1")).not.toBeInTheDocument();
  });

  test("does not render when commonItem has no commons", () => {
    renderComponent(adminUser, {});

    expect(screen.queryByTestId("AdminCommonsCard-1")).not.toBeInTheDocument();
  });

  test("does not render when commonItem is undefined", () => {
    renderComponent(adminUser, undefined);

    expect(screen.queryByTestId("AdminCommonsCard-1")).not.toBeInTheDocument();
  });

  test("displays all commons fields correctly", () => {
    renderComponent();

    expect(screen.getByText("Anika's Ant Farm (ID: 1)")).toBeInTheDocument();

    expect(screen.getByText("Cow Price:")).toBeInTheDocument();
    expect(screen.getByText("Milk Price:")).toBeInTheDocument();
    expect(screen.getByText("Start Balance:")).toBeInTheDocument();
    expect(screen.getByText("Starting Date:")).toBeInTheDocument();
    expect(screen.getByText("Last Date:")).toBeInTheDocument();
    expect(screen.getByText("Degrad Rate:")).toBeInTheDocument();
    expect(screen.getByText("Show Leaderboard:")).toBeInTheDocument();
    expect(screen.getByText("Show Chat:")).toBeInTheDocument();
    expect(screen.getByText("Total Cows:")).toBeInTheDocument();
    expect(screen.getByText("Cap / User:")).toBeInTheDocument();
    expect(screen.getByText("Carry Cap:")).toBeInTheDocument();
    expect(screen.getByText("Eff Cap:")).toBeInTheDocument();

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("87")).toBeInTheDocument();
  });

  test("displays default effective capacity when missing", () => {
    renderComponent(adminUser, {
      ...sampleCommons,
      effectiveCapacity: undefined,
    });

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("edit button navigates correctly", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Edit-1"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/editcommons/1");
  });

  test("leaderboard button navigates correctly", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Leaderboard-1"));

    expect(mockNavigate).toHaveBeenCalledWith("/leaderboard/1");
  });

  test("chat button navigates correctly", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Chat-1"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/chat/1");
  });

  test("delete modal appears and works correctly", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Delete-1"));

    expect(screen.getByTestId("AdminCommonsCard-Modal-1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Modal-Delete-1"));

    expect(mockMutate).toHaveBeenCalledWith(1);
  });

  test("modal is closed by default", () => {
    renderComponent();

    expect(
      screen.queryByTestId("AdminCommonsCard-Modal-1"),
    ).not.toBeInTheDocument();
  });

  test("delete confirm closes modal after mutation", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Delete-1"));

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Modal-Delete-1"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("AdminCommonsCard-Modal-1"),
      ).not.toBeInTheDocument();
    });
  });

  test("cancel delete closes modal", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Delete-1"));

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Modal-Cancel-1"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("AdminCommonsCard-Modal-1"),
      ).not.toBeInTheDocument();
    });
  });

  test("modal closes when close button clicked", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("AdminCommonsCard-Delete-1"));

    fireEvent.click(screen.getByLabelText("Close"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("AdminCommonsCard-Modal-1"),
      ).not.toBeInTheDocument();
    });
  });

  test("dashboard button has correct href and testid", () => {
    renderComponent();

    expect(screen.getByTestId("AdminCommonsCard-Dashboard-1")).toHaveAttribute(
      "href",
      "/admin/dashboard/1",
    );
  });

  test("stats csv and announcements buttons have correct hrefs and testids", () => {
    renderComponent();

    expect(screen.getByTestId("AdminCommonsCard-StatsCSV-1")).toHaveAttribute(
      "href",
      "/api/commonstats/download?commonsId=1",
    );

    expect(
      screen.getByTestId("AdminCommonsCard-Announcements-1"),
    ).toHaveAttribute("href", "/admin/announcements/1");
  });

  test("card has default box shadow before hover", () => {
    renderComponent();

    const card = screen.getByTestId("AdminCommonsCard-1");

    expect(card).toHaveStyle({
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    });
  });

  test("card has hover state", () => {
    renderComponent();

    const card = screen.getByTestId("AdminCommonsCard-1");

    expect(card).toHaveStyle({
      transform: "scale(1)",
      transition: "transform 0.2s",
    });

    fireEvent.mouseEnter(card);

    expect(card).toHaveStyle({
      transform: "scale(1.02)",
      transition: "transform 0.2s",
      boxShadow: "0 4px 8px rgba(0,0,0,0.17)",
    });

    fireEvent.mouseLeave(card);

    expect(card).toHaveStyle({
      transform: "scale(1)",
      transition: "transform 0.2s",
    });
  });

  test("delete mutation builds correct axios params", () => {
    renderComponent();

    expect(mockAxiosParams(1)).toEqual({
      url: "/api/commons",
      method: "DELETE",
      params: { id: 1 },
    });
  });

  test("delete mutation has success handler and cache invalidation deps", () => {
    renderComponent();

    expect(mockMutationOptions).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
    });

    expect(mockMutationDeps).toHaveBeenCalledWith(["/api/commons/allplus"]);
  });
});
