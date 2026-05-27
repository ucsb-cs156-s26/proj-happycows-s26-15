import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import OurTable, {
  ButtonColumn,
  HrefButtonColumn,
} from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";

import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/commonsUtils";

import { useNavigate } from "react-router";
import { hasRole } from "main/utils/currentUser";

export default function CommonsTable({ commons, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [cellToDelete, setCellToDelete] = useState(null);

  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/admin/editcommons/${cell.row.values["commons.id"]}`);
  };

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    {
      onSuccess: onDeleteSuccess,
    },
    ["/api/commons/all"],
  );

  const deleteCallback = (cell) => {
    setCellToDelete(cell);
    setShowModal(true);
  };

  const leaderboardCallback = (cell) => {
    navigate(`/leaderboard/${cell.row.values["commons.id"]}`);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Short Description",
      accessor: "shortDescription",
    },
    {
      Header: "Price Per Cow",
      accessor: "pricePerCow",
    },
    {
      Header: "Milk Price",
      accessor: "milkPrice",
    },
    {
      Header: "Starting Balance",
      accessor: "startingBalance",
    },
    {
      Header: "Starting Date",
      accessor: "startingDate",
    },
    {
      Header: "Full Capacity",
      accessor: "fullCapacity",
    },
    {
      Header: "Below Capacity Health Multiplier",
      accessor: "belowCapacityHealthMultiplier",
    },
    {
      Header: "Effective Capacity",
      accessor: "effectiveCapacity",
    },
  ];

  const testid = "CommonsTable";

  const columnsIfAdmin = [
    ...columns,
    ButtonColumn("Edit", "primary", editCallback, testid),
    ButtonColumn("Delete", "danger", deleteCallback, testid),
    ButtonColumn("Leaderboard", "secondary", leaderboardCallback, testid),

    HrefButtonColumn(
      "Stats CSV",
      "success",
      `/api/commonstats/download?commonsId=`,
      testid,
    ),

    HrefButtonColumn("Announcements", "info", `/admin/announcements/`, testid),

    HrefButtonColumn("Chat", "primary", `/admin/chat/`, testid),

    HrefButtonColumn("Dashboard", "info", `/admin/dashboard/`, testid),
  ];

  const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN")
    ? columnsIfAdmin
    : columns;

  const commonsModal = (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Commons</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete the commons{" "}
        {cellToDelete?.row.values["commons.name"]}?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Keep this Commons
        </Button>

        <Button
          variant="danger"
          onClick={() => {
            deleteMutation.mutate(cellToDelete);
            setShowModal(false);
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      {commonsModal}

      <OurTable data={commons} columns={columnsToDisplay} testid={testid} />
    </>
  );
}
