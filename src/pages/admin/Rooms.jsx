import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/rooms.css";

const initialRooms = [
  { id: 101, type: "Deluxe Room", status: "available" },
  { id: 102, type: "Sea View Suite", status: "available" },
  { id: 103, type: "Executive Room", status: "not_available" },
  { id: 104, type: "Villa Room", status: "available" },
  { id: 105, type: "Family Suite", status: "not_available" },
];

export default function Rooms() {
  const [rooms, setRooms] = useState(initialRooms);
  const navigate = useNavigate();

  const deleteRoom = (id) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Room Management</h3>
          <p className="text-muted mb-0">
            Manage all resort rooms and availability status.
          </p>
        </div>

        <button
          className="btn btn-primary rounded-3"
          onClick={() => navigate("/admin/rooms/add")}
        >
          Add Room
        </button>
      </div>

      {/* Table */}
      <div className="card soft-card">
        <div className="table-responsive">
          <table className="table align-middle mb-0 rooms-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room Type</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="fw-semibold">#{room.id}</td>
                  <td>{room.type}</td>

                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        room.status === "available"
                          ? "bg-success-subtle text-success"
                          : "bg-danger-subtle text-danger"
                      }`}
                    >
                      {room.status === "available"
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </td>

                  {/* TEXT BUTTONS */}
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2 flex-wrap">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navigate(`/admin/rooms/${room.id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() =>
                          navigate(`/admin/rooms/edit/${room.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteRoom(room.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rooms.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No rooms available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}