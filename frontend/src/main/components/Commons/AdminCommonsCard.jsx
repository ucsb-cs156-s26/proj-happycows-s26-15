import React, { useState } from "react";
import { Card, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function AdminCommonsCard({ commons, currentUser }) {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/editcommons/${commons.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleLeaderboard = () => {
    navigate(`/leaderboard/${commons.id}`);
  };

  const handleChat = () => {
    navigate(`/admin/chat/${commons.id}`);
  };

  const objectToAxiosParamsDelete = (cell) => ({
    url: "/api/commons",
    method: "DELETE",
    params: {
      id: cell.id,
    },
  });

  const deleteMutation = useBackendMutation(
    objectToAxiosParamsDelete,
    {
      onSuccess: () => {
        toast(`Commons Deleted - id: ${commons.id} name: ${commons.name}`);
      },
    },
    ["/api/commons/all"],
  );

  const deleteCallback = () => {
    deleteMutation.mutate(commons);
    setShowDeleteModal(false);
  };

  const deleteModal = (
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Commons</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete <b>{commons.name}</b>?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>

        <Button variant="danger" onClick={deleteCallback}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col>
              <Card.Title>{commons.name}</Card.Title>
              <Card.Text>{commons.location}</Card.Text>
            </Col>
          </Row>

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
