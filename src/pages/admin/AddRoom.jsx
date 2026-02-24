import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    roomNo: "",
    roomType: "",
    price: "",
    capacity: "",
    availability: "available", // ✅ available | unavailable
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(false);

  // ✅ Load room in edit mode (demo)
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      setLoadingRoom(true);
      try {
        // DEMO DATA (replace with API)
        const data = {
          roomNo: "101",
          roomType: "Deluxe Room",
          price: "4500",
          capacity: "2",
          availability: "available", 
          description: "Luxury deluxe room with balcony and premium interior.",
          imageUrl: "", 
        };

        setForm({
          roomNo: data.roomNo || "",
          roomType: data.roomType || "",
          price: data.price || "",
          capacity: data.capacity || "",
          availability: data.availability || "available",
          description: data.description || "",
        });

        if (data.imageUrl) setPreviewUrl(data.imageUrl);
      } finally {
        setLoadingRoom(false);
      }
    })();
  }, [isEdit, id]);

  
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.roomNo.trim()) e.roomNo = "Room number is required.";
    if (!form.roomType) e.roomType = "Room type is required.";
    if (form.price === "" || Number(form.price) <= 0) e.price = "Enter a valid price.";
    if (form.capacity === "" || Number(form.capacity) <= 0) e.capacity = "Enter a valid capacity.";
    if (!form.availability) e.availability = "Availability is required.";
    if (!form.description.trim()) e.description = "Description is required.";

    if (!isEdit && !imageFile) e.image = "Room image is required.";
    if (isEdit && !imageFile && !previewUrl) e.image = "Room image is required.";

    return e;
  }, [form, imageFile, isEdit, previewUrl]);

  const isValid = Object.keys(errors).length === 0;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onBlur(e) {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  }

  function onImageChange(e) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function onSubmit(e) {
    e.preventDefault();

    setTouched({
      roomNo: true,
      roomType: true,
      price: true,
      capacity: true,
      availability: true,
      description: true,
      image: true,
    });

    if (!isValid) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("roomNo", form.roomNo);
      fd.append("roomType", form.roomType);
      fd.append("price", form.price);
      fd.append("capacity", form.capacity);
      fd.append("availability", form.availability);
      fd.append("description", form.description);

      if (imageFile) fd.append("image", imageFile);

      if (isEdit) {
        alert("Room updated (demo). Connect backend to update.");
      } else {
        alert("Room added (demo). Connect backend to save.");
      }

      // ✅ Correct route for your admin panel
      navigate("/admin/rooms");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!isEdit) return;
    const ok = window.confirm("Are you sure you want to delete this room?");
    if (!ok) return;

    setSubmitting(true);
    try {
      alert("Room deleted (demo). Connect backend to delete.");
      navigate("/admin/rooms");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingRoom) {
    return (
      <section className="add-room-sec">
        <div className="container py-5">
          <div className="card add-room-card">
            <div className="card-body p-5 text-center">
              <div className="spinner-border" role="status" />
              <div className="mt-3">Loading room...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="add-room-sec">
      <div className="container py-5">
        <div className="add-room-head mb-4">
          <h1 className="add-room-title">{isEdit ? "Edit Room" : "Add New Room"}</h1>
          <p className="add-room-sub">
            {isEdit
              ? "Update room details or delete this room from inventory."
              : "Fill the details below to add a new room to your resort inventory."}
          </p>
        </div>

        <div className="row g-4">
          {/* FORM */}
          <div className="col-12 col-lg-7">
            <form className="card add-room-card" onSubmit={onSubmit}>
              <div className="card-body p-4 p-md-5">
                <div className="row g-3">
                  {/* Room No */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">Room No *</label>
                    <input
                      type="text"
                      name="roomNo"
                      value={form.roomNo}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`form-control ${touched.roomNo && errors.roomNo ? "is-invalid" : ""}`}
                      placeholder="e.g. 101"
                    />
                    {touched.roomNo && errors.roomNo && (
                      <div className="invalid-feedback">{errors.roomNo}</div>
                    )}
                  </div>

                  {/* Room Type */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">Room Type *</label>
                    <select
                      name="roomType"
                      value={form.roomType}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`form-select ${touched.roomType && errors.roomType ? "is-invalid" : ""}`}
                    >
                      <option value="">Select room type</option>
                      {ROOM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {touched.roomType && errors.roomType && (
                      <div className="invalid-feedback">{errors.roomType}</div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">Price (per night) *</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`form-control ${touched.price && errors.price ? "is-invalid" : ""}`}
                        placeholder="e.g. 4500"
                        min="1"
                      />
                      {touched.price && errors.price && (
                        <div className="invalid-feedback">{errors.price}</div>
                      )}
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="col-12 col-md-6">
                    <label className="form-label">Capacity (guests) *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`form-control ${touched.capacity && errors.capacity ? "is-invalid" : ""}`}
                      placeholder="e.g. 2"
                      min="1"
                    />
                    {touched.capacity && errors.capacity && (
                      <div className="invalid-feedback">{errors.capacity}</div>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="col-12">
                    <label className="form-label d-block">Availability *</label>
                    <div className="d-flex flex-wrap gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="availability"
                          id="availYes"
                          value="available"
                          checked={form.availability === "available"}
                          onChange={onChange}
                        />
                        <label className="form-check-label" htmlFor="availYes">
                          Available
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="availability"
                          id="availNo"
                          value="unavailable"
                          checked={form.availability === "unavailable"}
                          onChange={onChange}
                        />
                        <label className="form-check-label" htmlFor="availNo">
                          Unavailable
                        </label>
                      </div>
                    </div>

                    {touched.availability && errors.availability && (
                      <div className="text-danger small mt-2">{errors.availability}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`form-control ${touched.description && errors.description ? "is-invalid" : ""}`}
                      rows="5"
                      placeholder="Write a short description about this room..."
                    />
                    {touched.description && errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="col-12">
                    <label className="form-label">Room Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                      className={`form-control ${touched.image && errors.image ? "is-invalid" : ""}`}
                    />
                    {touched.image && errors.image && (
                      <div className="invalid-feedback d-block">{errors.image}</div>
                    )}
                    <div className="form-text">
                      {isEdit ? "Upload new image only if you want to replace." : "JPG/PNG recommended."}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-12 d-flex flex-wrap gap-2 pt-2">
                    <button type="submit" className="btn btn-primary add-room-submit" disabled={submitting}>
                      {submitting ? "Saving..." : isEdit ? "Update Room" : "Add Room"}
                    </button>

                    {isEdit && (
                      <button type="button" className="btn btn-danger" onClick={onDelete} disabled={submitting}>
                        Delete Room
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(-1)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* PREVIEW */}
          <div className="col-12 col-lg-5">
            <div className="card preview-card">
              <div className="card-body p-4 p-md-5">
                <div className="preview-title mb-3">Preview</div>

                <div className="preview-img">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" />
                  ) : (
                    <div className="preview-placeholder">Upload image to preview</div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="preview-name">
                    {form.roomType || "Room Type"}
                    <span
                      className={`badge ms-2 ${
                        form.availability === "available" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {form.availability === "available" ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="preview-meta mt-2">
                    <div>
                      <span>Room No:</span> {form.roomNo || "—"}
                    </div>
                    <div>
                      <span>Price:</span> {form.price ? `₹${form.price}/night` : "—"}
                    </div>
                    <div>
                      <span>Capacity:</span> {form.capacity ? `${form.capacity} guests` : "—"}
                    </div>
                  </div>

                  <p className="preview-desc mt-3">
                    {form.description || "Room description will appear here..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="small text-muted mt-3">
              Tip: Keep the description short and attractive (2–4 lines).
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}