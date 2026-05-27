import { render, screen } from "@testing-library/react";
import CommonStatsCharts from "main/components/Commons/CommonStatsCharts";

describe("CommonStatsCharts tests", () => {
  test("renders charts with histogram data", () => {
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
  });
});
