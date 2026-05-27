import { render, screen } from "@testing-library/react";
import CommonStatsCharts from "main/components/Commons/CommonStatsCharts";
import { vi } from "vitest";

vi.mock("recharts", async () => {
  const MockResponsiveContainer = ({ children }) => (
    <div data-testid="ResponsiveContainer">{children}</div>
  );

  const MockBarChart = ({ data, children }) => (
    <div data-testid="BarChart">
      {JSON.stringify(data)}
      {children}
    </div>
  );

  const MockLineChart = ({ data, children }) => (
    <div data-testid="LineChart">
      {JSON.stringify(data)}
      {children}
    </div>
  );

  const MockBar = () => <div data-testid="Bar" />;
  const MockLine = () => <div data-testid="Line" />;
  const MockXAxis = () => <div data-testid="XAxis" />;
  const MockYAxis = () => <div data-testid="YAxis" />;
  const MockCartesianGrid = () => <div data-testid="CartesianGrid" />;
  const MockTooltip = () => <div data-testid="Tooltip" />;
  const MockLegend = () => <div data-testid="Legend" />;

  return {
    ResponsiveContainer: MockResponsiveContainer,
    BarChart: MockBarChart,
    LineChart: MockLineChart,
    Bar: MockBar,
    Line: MockLine,
    XAxis: MockXAxis,
    YAxis: MockYAxis,
    CartesianGrid: MockCartesianGrid,
    Tooltip: MockTooltip,
    Legend: MockLegend,
  };
});

describe("CommonStatsCharts tests", () => {
  test("renders charts with filtered and mapped data", () => {
    const data = [
      {
        id: 1,
        numCows: 10,
        avgHealth: 100,
      },
      {
        id: 2,
        numCows: 20,
        avgHealth: "NaN",
      },
    ];

    const histogramData = [
      {
        username: "farmer1",
        numOfCows: 5,
      },
      {
        username: "farmer2",
        numOfCows: 10,
      },
    ];

    render(<CommonStatsCharts data={data} histogramData={histogramData} />);

    expect(screen.getByText("Cow Ownership Histogram")).toBeInTheDocument();
    expect(screen.getByText("Cows Over Time")).toBeInTheDocument();
    expect(screen.getByText("Average Health Over Time")).toBeInTheDocument();

    expect(screen.getByText(/farmer1/)).toBeInTheDocument();
    expect(screen.getByText(/farmer2/)).toBeInTheDocument();
    expect(screen.getByText(/numOfCows/)).toBeInTheDocument();

    const lineCharts = screen.getAllByTestId("LineChart");

    expect(lineCharts[1].textContent).not.toContain("NaN");
    expect(lineCharts[1].textContent).toContain("100");
  });
});
