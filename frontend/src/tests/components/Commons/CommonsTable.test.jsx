import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter as Router } from "react-router";
import CommonsTable from "main/components/Commons/CommonsTable";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import commonsPlusFixtures from "fixtures/commonsPlusFixtures";
import * as useBackendModule from "main/utils/useBackend";
import { vi } from "vitest";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/commonsUtils";

const mockedNavigate = vi.fn();

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => mockedNavigate,
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test("renders without crashing for empty table with user not logged in", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable commons={[]} currentUser={null} />
        </Router>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={[]}
            currentUser={currentUserFixtures.userOnly}
          />
        </Router>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for empty table for admin", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={[]}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers and content for adminUser", () => {
    const testId = "CommonsTable";

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={commonsPlusFixtures.threeCommonsPlus}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "id",
      "Name",
      /Cow\s+Price/,
      /Milk\s+Price/,
      /Start\s+Bal/,
      /Starting\s+Date/,
      /Last\s+Date/,
      /Degrad\s+Rate/,
      /Show\s+LrdrBrd\?/,
      /Show\s+Chat\?/,
      /Tot\s+Cows/,
      /Cap \/\s+User/,
      /Carry\s+Cap/,
      /Eff\s+Cap/,
    ];

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-commons.id`),
    ).toHaveTextContent("1");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.id`),
    ).toHaveTextContent("2");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.name`),
    ).toHaveTextContent("Com2");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.cowPrice`),
    ).toHaveTextContent("1");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.milkPrice`),
    ).toHaveTextContent("2");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.degradationRate`),
    ).toHaveTextContent("0.01");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.capacityPerUser`),
    ).toHaveTextContent("5");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.carryingCapacity`),
    ).toHaveTextContent("42");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.startingBalance`),
    ).toHaveTextContent("10");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.startingDate`),
    ).toHaveTextContent(/^2022-11-22$/);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.lastDate`),
    ).toHaveTextContent(/^2022-11-22$/);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.showLeaderboard`),
    ).toHaveTextContent("true");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-commons.showChat`),
    ).toHaveTextContent("true");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-totalCows`),
    ).toHaveTextContent("0");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-effectiveCapacity`),
    ).toHaveTextContent("42");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).toHaveClass("btn-primary");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).toHaveClass("btn-danger");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Leaderboard-button`),
    ).toHaveClass("btn-secondary");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Stats CSV-button`),
    ).toHaveClass("btn-success");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Stats CSV-button`),
    ).toHaveAttribute("href", "/api/commonstats/download?commonsId=1");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Announcements-button`),
    ).toHaveClass("btn-info");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Announcements-button`),
    ).toHaveAttribute("href", "/admin/announcements/1");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Chat-button`),
    ).toHaveClass("btn-primary");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Chat-button`),
    ).toHaveAttribute("href", "/admin/chat/1");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Dashboard-button`),
    ).toHaveClass("btn-info");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Dashboard-button`),
    ).toHaveAttribute("href", "/admin/dashboard/1");
  });

  test("Edit button navigates to edit commons page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={commonsPlusFixtures.threeCommonsPlus}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    const editButton = await screen.findByTestId(
      "CommonsTable-cell-row-0-col-Edit-button",
    );

    fireEvent.click(editButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/admin/editcommons/1");
  });

  test("Leaderboard button navigates to leaderboard page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={commonsPlusFixtures.threeCommonsPlus}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    const leaderboardButton = await screen.findByTestId(
      "CommonsTable-cell-row-0-col-Leaderboard-button",
    );

    fireEvent.click(leaderboardButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/leaderboard/1");
  });
});

describe("Modal tests", () => {
  const queryClient = new QueryClient();

  const mockMutate = vi.fn();

  const mockUseBackendMutation = {
    mutate: mockMutate,
  };

  beforeEach(() => {
    vi.spyOn(useBackendModule, "useBackendMutation").mockReturnValue(
      mockUseBackendMutation,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Clicking Delete button opens the modal for adminUser", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={commonsPlusFixtures.threeCommonsPlus}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(document.body).not.toHaveClass("modal-open");
    });

    const deleteButton = screen.getByTestId(
      "CommonsTable-cell-row-0-col-Delete-button",
    );

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(document.body).toHaveClass("modal-open");
    });
  });

  test("Clicking Permanently Delete button deletes the commons", async () => {
    const useBackendMutationSpy = vi.spyOn(
      useBackendModule,
      "useBackendMutation",
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={commonsPlusFixtures.threeCommonsPlus}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      "CommonsTable-cell-row-0-col-Delete-button",
    );

    fireEvent.click(deleteButton);

    const permanentlyDeleteButton = await screen.findByTestId(
      "CommonsTable-Modal-Delete",
    );

    fireEvent.click(permanentlyDeleteButton);

    await waitFor(() => {
      expect(useBackendMutationSpy).toHaveBeenCalledWith(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/commons/allplus"],
      );
    });

    await waitFor(() => {
      expect(document.body).not.toHaveClass("modal-open");
    });
  });

  test("Clicking Keep this Commons button cancels the deletion", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={commonsPlusFixtures.threeCommonsPlus}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      "CommonsTable-cell-row-0-col-Delete-button",
    );

    fireEvent.click(deleteButton);

    const cancelButton = await screen.findByTestId("CommonsTable-Modal-Cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(document.body).not.toHaveClass("modal-open");
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  test("Pressing the escape key on the modal cancels the deletion", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <CommonsTable
            commons={commonsPlusFixtures.threeCommonsPlus}
            currentUser={currentUserFixtures.adminUser}
          />
        </Router>
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByTestId(
      "CommonsTable-cell-row-0-col-Delete-button",
    );

    fireEvent.click(deleteButton);

    expect(document.body).toHaveClass("modal-open");

    const closeButton = screen.getByLabelText("Close");

    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(document.body).not.toHaveClass("modal-open");
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });
});
