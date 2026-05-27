import React from "react";
import { useParams } from "react-router";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackend } from "main/utils/useBackend";
import CommonStatsCharts from "main/components/Commons/CommonStatsCharts";

export default function AdminDashboardPage() {
  const { id } = useParams();

  const { data: commonStats } = useBackend(
    [`/api/commonstats/commons?commonsId=${id}`],
    {
      method: "GET",
      url: "/api/commonstats/commons",
      params: {
        commonsId: id,
      },
    },
    [],
  );

  const { data: histogramData } = useBackend(
    [`/api/dashboard/histogram/${id}`],
    {
      method: "GET",
      url: `/api/dashboard/histogram/${id}`,
    },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Dashboard</h1>
        <p data-testid="AdminDashboardPage-commonsId">Commons ID: {id}</p>

        <CommonStatsCharts data={commonStats} histogramData={histogramData} />
      </div>
    </BasicLayout>
  );
}
