import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function CommonStatsCharts({ data, histogramData }) {
  const healthData = data.filter((d) => !isNaN(Number(d.avgHealth)));

  const histogramChartData = histogramData.map((userCommons) => ({
    username: userCommons.username,
    numOfCows: userCommons.numOfCows,
  }));

  return (
    <div>
      <h3>Cow Ownership Histogram</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={histogramChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="numOfCows" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h3 className="mt-4">Cows Over Time</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="numCows" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="mt-4">Average Health Over Time</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={healthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avgHealth" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
