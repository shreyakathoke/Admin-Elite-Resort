import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/contacts.css";

const initialContacts = [
  {
    id: 1,
    user: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    subject: "Booking",
    message: "I want to book a sea view room for 3 nights.",
    date: "Feb 16, 2026, 10:38 AM",
  },
  {
    id: 2,
    user: "Sneha Sharma",
    email: "sneha@gmail.com",
    phone: "9988776655",
    subject: "Event",
    message: "Looking to host a wedding event at your resort.",
    date: "Feb 18, 2026, 02:15 PM",
  },
  {
    id: 3,
    user: "Rohit Patil",
    email: "rohit@gmail.com",
    phone: "9090909090",
    subject: "Other",
    message: "Do you provide airport pickup?",
    date: "Feb 19, 2026, 11:22 AM",
  },
  {
    id: 4,
    user: "Ananya",
    email: "ananya@mail.com",
    phone: "9898989898",
    subject: "Booking",
    message: "Need two rooms for family stay this weekend.",
    date: "Feb 20, 2026, 08:10 PM",
  },
  {
    id: 5,
    user: "Sahil",
    email: "sahil@mail.com",
    phone: "9123456780",
    subject: "Event",
    message: "Want banquet hall pricing for 150 guests.",
    date: "Feb 21, 2026, 09:30 AM",
  },
  {
    id: 6,
    user: "Isha",
    email: "isha@mail.com",
    phone: "9012345678",
    subject: "Other",
    message: "What are pool timings?",
    date: "Feb 22, 2026, 01:05 PM",
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Contacts() {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const pageSize = 5;

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;

    return contacts.filter(
      (c) =>
        c.user.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  const total = filteredContacts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // If search reduces items, keep page valid
  const safePage = clamp(page, 1, totalPages);

  const paginatedContacts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, safePage]);

  const showingFrom = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(total, safePage * pageSize);

  const deleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const goToPage = (p) => setPage(clamp(p, 1, totalPages));

  const visiblePages = useMemo(() => {
    // show up to 5 page numbers
    const maxButtons = 5;
    let start = Math.max(1, safePage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [safePage, totalPages]);

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Header */}
      <div className="contacts-header mb-4">
        <div>
          <h3 className="fw-bold d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-chat-dots text-primary" />
            Contact Inquiries
          </h3>
          <p className="text-muted mb-0">
            Manage all contact form submissions from users.
          </p>
        </div>

        <div className="contacts-meta">
          <span className="badge text-bg-light border">
            Total: <b>{total}</b>
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="card soft-card p-3 mb-4">
        <input
          type="text"
          className="form-control contact-search"
          placeholder="Search by name, email, phone, subject..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page when searching
          }}
        />
      </div>

      {/* Table */}
      <div className="card soft-card">
        <div className="card-header soft-card-header d-flex flex-column flex-md-row justify-content-between gap-2">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-chat-left-text me-2 text-primary" />
            Contact Submissions
          </h5>

          <div className="small text-muted">
            Showing <b>{showingFrom}</b>–<b>{showingTo}</b> of <b>{total}</b>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0 contact-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Send Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="user-avatar">
                        <i className="bi bi-person" />
                      </div>
                      <div className="fw-semibold">{contact.user}</div>
                    </div>
                  </td>

                  <td className="text-muted">{contact.email}</td>
                  <td className="text-muted">{contact.phone}</td>

                  <td>
                    <span className="badge bg-primary-subtle text-primary">
                      {contact.subject}
                    </span>
                  </td>

                  <td className="text-truncate" style={{ maxWidth: 260 }}>
                    {contact.message}
                  </td>

                  <td className="text-muted">{contact.date}</td>

                  <td className="text-end">
                    <button
                      className="btn btn-light btn-sm me-2 contact-action"
                      onClick={() => navigate(`/admin/contacts/${contact.id}`)}
                      title="View"
                    >
                      <i className="bi bi-eye text-primary" />
                    </button>

                    <button
                      className="btn btn-light btn-sm contact-action"
                      onClick={() => deleteContact(contact.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash text-danger" />
                    </button>
                  </td>
                </tr>
              ))}

              {total === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No contact submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="card-footer bg-white border-0">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <div className="small text-muted">
              Page <b>{safePage}</b> of <b>{totalPages}</b>
            </div>

            <nav aria-label="Contacts pagination">
              <ul className="pagination pagination-sm mb-0 contacts-pagination">
                <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(safePage - 1)}>
                    Prev
                  </button>
                </li>

                {visiblePages.map((p) => (
                  <li key={p} className={`page-item ${p === safePage ? "active" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(p)}>
                      {p}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${safePage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(safePage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}