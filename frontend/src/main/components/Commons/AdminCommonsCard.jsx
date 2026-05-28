import React, { useState } from "react";
import { Card, Button, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { hasRole } from "main/utils/currentUser";
import { onDeleteSuccess } from "main/utils/commonsUtils";

export default function AdminCommonsCard({ commonItem, currentUser }) {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const commons = commonItem?.commons;

  const axiosParamsDelete =
    /* istanbul ignore next */
    (id) => ({
      url: "/api/commons",
      method: "DELETE",
      params: { id },
    });

  const deleteMutation = useBackendMutation(
    axiosParamsDelete,
    {
      onSuccess: onDeleteSuccess,
    },
    ["/api/commons/allplus"],
  );

  if (!hasRole(currentUser, "ROLE_ADMIN")) {
    return null;
  }

  if (!commons) {
    return null;
  }

  const handleEdit = () => {
    navigate(`/admin/editcommons/${commons.id}`);
  };

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleLeaderboard = () => {
    navigate(`/leaderboard/${commons.id}`);
  };

  const handleChat = () => {
    navigate(`/admin/chat/${commons.id}`);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(commons.id);
    setShowModal(false);
  };

  const formatDate = (dateString) => String(dateString).slice(0, 10);

  const renderField = (label, value) => (
    <Row className="mb-2">
      <Col sm={6}>
        <strong>{label}:</strong>
      </Col>
      <Col sm={6}>{value}</Col>
    </Row>
  );

  const deleteModal = (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      data-testid={`AdminCommonsCard-Modal-${commons.id}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>

      <Modal.Body>Are you sure you want to delete this commons?</Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowModal(false)}
          data-testid={`AdminCommonsCard-Modal-Cancel-${commons.id}`}
        >
          Keep this Commons
        </Button>

        <Button
          variant="danger"
          onClick={handleDeleteConfirm}
          data-testid={`AdminCommonsCard-Modal-Delete-${commons.id}`}
        >
          Permanently Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <Card
        className="mb-3"
        data-testid={`AdminCommonsCard-${commons.id}`}
        style={{
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.2s",
          boxShadow: isHovered
            ? "0 4px 8px rgba(0,0,0,0.17)"
            : "0 2px 4px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card.Body>
          <Card.Title>
            {commons.name} (ID: {commons.id})
          </Card.Title>

          {renderField("Cow Price", commons.cowPrice)}
          {renderField("Milk Price", commons.milkPrice)}
          {renderField("Start Balance", commons.startingBalance)}
          {renderField("Starting Date", formatDate(commons.startingDate))}
          {renderField("Last Date", formatDate(commons.lastDate))}
          {renderField("Degrad Rate", commons.degradationRate)}
          {renderField("Show Leaderboard", String(commons.showLeaderboard))}
          {renderField("Show Chat", String(commons.showChat))}
          {renderField("Total Cows", commonItem.totalCows || 0)}
          {renderField("Cap / User", commons.capacityPerUser)}
          {renderField("Carry Cap", commons.carryingCapacity)}
          {renderField("Eff Cap", commonItem.effectiveCapacity || 0)}

          <hr />

          <div className="d-flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleEdit}
              data-testid={`AdminCommonsCard-Edit-${commons.id}`}
            >
              Edit
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              data-testid={`AdminCommonsCard-Delete-${commons.id}`}
            >
              Delete
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLeaderboard}
              data-testid={`AdminCommonsCard-Leaderboard-${commons.id}`}
            >
              Leaderboard
            </Button>

            <Button
              variant="success"
              size="sm"
              href={`/api/commonstats/download?commonsId=${commons.id}`}
              data-testid={`AdminCommonsCard-StatsCSV-${commons.id}`}
            >
              Stats CSV
            </Button>

            <Button
              variant="info"
              size="sm"
              href={`/admin/announcements/${commons.id}`}
              data-testid={`AdminCommonsCard-Announcements-${commons.id}`}
            >
              Announcements
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleChat}
              data-testid={`AdminCommonsCard-Chat-${commons.id}`}
            >
              Chat
            </Button>

            <Button
              variant="info"
              size="sm"
              href={`/admin/dashboard/${commons.id}`}
              data-testid={`AdminCommonsCard-Dashboard-${commons.id}`}
            >
              Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>

      {deleteModal}
    </>
  );
}
