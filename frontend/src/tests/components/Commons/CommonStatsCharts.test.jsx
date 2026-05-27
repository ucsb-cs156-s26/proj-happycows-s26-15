import { render } from "@testing-library/react";
import CommonStatsCharts from "main/components/Commons/CommonStatsCharts";

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
    ];

    const { container } = render(
      <CommonStatsCharts data={data} histogramData={histogramData} />,
    );

    expect(container.innerHTML).toContain("Cow Ownership Histogram");

    expect(container.innerHTML).toContain("Cows Over Time");

    expect(container.innerHTML).toContain("Average Health Over Time");

    const validHealthData = data.filter((d) => !isNaN(Number(d.avgHealth)));

    expect(validHealthData).toHaveLength(1);

    const mappedHistogram = histogramData.map((userCommons) => ({
      username: userCommons.username,
      numOfCows: userCommons.numOfCows,
    }));

    expect(mappedHistogram).toEqual([
      {
        username: "farmer1",
        numOfCows: 5,
      },
    ]);
  });
});
