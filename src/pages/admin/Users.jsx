import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/users.css";

const initialUsers = [
  {
    id: 1,
    name: "Aryan Doe",
    email: "aryan123@gmail.com",
    phone: "7894563218",
    idProofType: "Aadhar",
    idProofNumber: "1234 5678 9012",
    created: "Feb 9, 2026",
    status: "active",
  },
  {
    id: 2,
    name: "hdt",
    email: "himanshuthakre7509@gmail.com",
    phone: "9876543210",
    idProofType: "PAN",
    idProofNumber: "ABCDE1234F",
    created: "Feb 9, 2026",
    status: "active",
  },
  {
    id: 3,
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    idProofType: "Driving License",
    idProofNumber: "MH12-20234567",
    created: "Feb 3, 2026",
    status: "inactive",
  },
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.idProofType.toLowerCase().includes(q) ||
        u.idProofNumber.toLowerCase().includes(q)
    );
  }, [users, search]);

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Users</h3>
          <p className="text-muted mb-0">
            A list of all the users in your Elite Resort account.
          </p>
        </div>

        <input
          className="form-control users-search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      {/* Table */}
      <div className="card soft-card">
        <div className="table-responsive">
          <table className="table align-middle mb-0 users-table">
            <thead>
              <tr>
                <th><i className="bi bi-person me-2" />Name</th>
                <th><i className="bi bi-envelope me-2" />Email</th>
                <th><i className="bi bi-telephone me-2" />Phone</th>
                <th><i className="bi bi-card-text me-2" />ID Proof</th>
                <th><i className="bi bi-calendar me-2" />Created</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  {/* Name */}
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="user-avatar">
                        <i className="bi bi-person" />
                      </div>
                      <div className="fw-semibold">{user.name}</div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="text-muted">{user.email}</td>

                  {/* Phone */}
                  <td className="text-muted">{user.phone}</td>

                  {/* ID Proof */}
                  <td>
                    <div className="fw-semibold">{user.idProofType}</div>
                    <div className="text-muted small">
                      {user.idProofNumber}
                    </div>
                  </td>

                  {/* Created */}
                  <td className="text-muted">{user.created}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        user.status === "active"
                          ? "bg-success-subtle text-success"
                          : "bg-danger-subtle text-danger"
                      }`}
                    >
                      <i className="bi bi-circle-fill me-2 small" />
                      {user.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-end">
                    <button
                      className="btn btn-light btn-sm me-2 btn-action-view"
                      onClick={() =>
                        navigate(`/admin/users/${user.id}`)
                      }
                    >
                      <i className="bi bi-eye me-1" />
                      View
                    </button>

                    <button
                      className="btn btn-light btn-sm btn-action-delete"
                      onClick={() => deleteUser(user.id)}
                    >
                      <i className="bi bi-trash me-1 text-danger" />
                      <span className="text-danger">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No users found.
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