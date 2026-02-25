import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  updateRoom,
} from "../../api/roomsApi";
import "../../styles/addRoom.css";

const ROOM_TYPES = [
  "Deluxe Room",
  "Single Room",
  "Double Suite",
  "Family Room",
  "Executive Suite",
  "Presidential Suite",
];

export default function AddRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    roomNumber: "",
    type: "",
    pricePerNight: "",
    capacity: "",
    available: true,
    description: "",
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load room in edit mode
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      setLoadingRoom(true);
      setError("");
      try {
        const data = await getRoomById(id);

        // backend may return room or {room: {...}}
        const room = data?.room ?? data;

        setForm({
          roomNumber: room?.roomNumber ?? room?.number ?? room?.roomNo ?? "",
          type: room?.type ?? room?.roomType ?? "",
          pricePerNight: room?.pricePerNight ?? room?.price ?? "",
          capacity: room?.capacity ?? "",
          available:
            typeof room?.available === "boolean"
              ? room.available
              : room?.availability
              ? String(room.availability).toLowerCase() === "available"
              : true,
          description: room?.description ?? "",
        });
      } catch (e) {
        console.error("GET ROOM ERROR:", e);
        setError(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            "Failed to load room details."
        );
      } finally {
        setLoadingRoom(false);
      }
    })();
  }, [id, isEdit]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  const errors = useMemo(() => {
    const er = {};

    if (!String(form.roomNumber).trim()) er.roomNumber = "Room number is required";
    if (!String(form.type).trim()) er.type = "Room type is required";

    const price = Number(form.pricePerNight);
    if (!form.pricePerNight || Number.isNaN(price) || price <= 0) {
      er.pricePerNight = "Valid price is required";
    }

    const cap = Number(form.capacity);
    if (!form.capacity || Number.isNaN(cap) || cap <= 0) {
      er.capacity = "Valid capacity is required";
    }

    return er;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({
      roomNumber: true,
      type: true,
      pricePerNight: true,
      capacity: true,
      description: true,
      available: true,
    });

    if (!isValid) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        roomNumber: String(form.roomNumber).trim(),
        type: form.type,
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        available: Boolean(form.available),
        description: String(form.description || "").trim(),
      };

      if (isEdit) {
        await updateRoom(id, payload);
      } else {
        await createRoom(payload);
      }

      navigate("/admin/rooms");
    } catch (e2) {
      console.error("SAVE ROOM ERROR:", e2);
      setError(
        e2?.response?.data?.message ||
          e2?.response?.data?.error ||
          "Failed to save room."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!isEdit) return;
    const ok = window.confirm("Are you sure you want to delete this room?");
    if (!ok) return;

    setSubmitting(true);
    setError("");

    try {
      await deleteRoom(id);
      navigate("/admin/rooms");
    } catch (e) {
      console.error("DELETE ROOM ERROR:", e);
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to delete room."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">{isEdit ? "Edit Room" : "Add Room"}</h3>
          <p className="text-muted mb-0">
            {isEdit ? "Update room details." : "Create a new resort room."}
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary rounded-3"
            onClick={() => navigate("/admin/rooms")}
            disabled={submitting}
          >
            Back
          </button>

          {isEdit && (
            <button
              className="btn btn-outline-danger rounded-3"
              onClick={onDelete}
              disabled={submitting}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <div className="fw-semibold">Error</div>
          <div className="small">{error}</div>
        </div>
      )}

      <div className="card soft-card p-3 p-md-4">
        {loadingRoom ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" />
            <div className="mt-2 text-muted">Loading room...</div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Room Number</label>
              <input
                name="roomNumber"
                className={`form-control ${
                  touched.roomNumber && errors.roomNumber ? "is-invalid" : ""
                }`}
                placeholder="e.g. 101"
                value={form.roomNumber}
                onChange={onChange}
                onBlur={onBlur}
              />
              {touched.roomNumber && errors.roomNumber && (
                <div className="invalid-feedback">{errors.roomNumber}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Room Type</label>
              <select
                name="type"
                className={`form-select ${
                  touched.type && errors.type ? "is-invalid" : ""
                }`}
                value={form.type}
                onChange={onChange}
                onBlur={onBlur}
              >
                <option value="">Select type</option>
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {touched.type && errors.type && (
                <div className="invalid-feedback">{errors.type}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Price / Night</label>
              <input
                name="pricePerNight"
                type="number"
                className={`form-control ${
                  touched.pricePerNight && errors.pricePerNight ? "is-invalid" : ""
                }`}
                placeholder="e.g. 2500"
                value={form.pricePerNight}
                onChange={onChange}
                onBlur={onBlur}
              />
              {touched.pricePerNight && errors.pricePerNight && (
                <div className="invalid-feedback">{errors.pricePerNight}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Capacity</label>
              <input
                name="capacity"
                type="number"
                className={`form-control ${
                  touched.capacity && errors.capacity ? "is-invalid" : ""
                }`}
                placeholder="e.g. 2"
                value={form.capacity}
                onChange={onChange}
                onBlur={onBlur}
              />
              {touched.capacity && errors.capacity && (
                <div className="invalid-feedback">{errors.capacity}</div>
              )}
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check">
                <input
                  id="available"
                  name="available"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.available}
                  onChange={onChange}
                />
                <label htmlFor="available" className="form-check-label">
                  Available
                </label>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                placeholder="Optional..."
                value={form.description}
                onChange={onChange}
                onBlur={onBlur}
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button
                className="btn btn-primary rounded-3"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Saving..." : isEdit ? "Update Room" : "Create Room"}
              </button>

              <button
                className="btn btn-outline-secondary rounded-3"
                type="button"
                onClick={() =>
                  setForm({
                    roomNumber: "",
                    type: "",
                    pricePerNight: "",
                    capacity: "",
                    available: true,
                    description: "",
                  })
                }
                disabled={submitting}
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}