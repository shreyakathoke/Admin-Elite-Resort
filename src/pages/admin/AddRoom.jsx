import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/addRoom.css";
import { createRoom, deleteRoom, getRoomById, updateRoom } from "../../api/roomsApi";

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
    availability: "available",
    description: "",
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(false);

  // ✅ Load room in edit mode (supports {room:{}} or plain {})
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      setLoadingRoom(true);
      try {
        const data = await getRoomById(id);

        const room = data?.room ?? data;

        setForm({
          roomNo: room?.roomNumber ?? room?.roomNo ?? room?.number ?? "",
          roomType: room?.type ?? room?.roomType ?? "",
          price: room?.pricePerNight ?? room?.price ?? "",
          capacity: room?.capacity ?? "",
          availability:
            typeof room?.available === "boolean"
              ? room.available
                ? "available"
                : "unavailable"
              : room?.availability
              ? String(room.availability).toLowerCase()
              : "available",
          description: room?.description ?? "",
        });

        if (room?.imageUrl) setPreviewUrl(room.imageUrl);
      } catch (err) {
        console.error("GET ROOM ERROR:", err?.response?.data || err);
        alert(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load room. Check API route / token."
        );
        navigate("/admin/rooms");
      } finally {
        setLoadingRoom(false);
      }
    })();
  }, [isEdit, id, navigate]);

  // cleanup blob preview
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
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
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onBlur(e) {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  }

  function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
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
    });

    if (!isValid) return;

    setSubmitting(true);

    // ✅ Payload A (your current API)
    const payloadA = {
      roomNumber: form.roomNo.trim(),
      type: form.roomType,
      pricePerNight: Number(form.price),
      capacity: Number(form.capacity),
      available: form.availability === "available",
      description: form.description.trim(),
    };

    // ✅ Payload B (alternate backend format)
    const payloadB = {
      roomNo: form.roomNo.trim(),
      roomType: form.roomType,
      price: Number(form.price),
      capacity: Number(form.capacity),
      availability: form.availability, // "available" | "unavailable"
      description: form.description.trim(),
    };

    // embed fallback so roomsApi can retry automatically
    payloadA.__fallbackB = payloadB;

    try {
      if (isEdit) {
        await updateRoom(id, payloadA);
        alert("Room updated successfully ");
      } else {
        await createRoom(payloadA);
        alert("Room added successfully ");
      }

      navigate("/admin/rooms");
    } catch (err) {
      const status = err?.response?.status;
      const url = (err?.config?.baseURL || "") + (err?.config?.url || "");
      console.log("SAVE ROOM ERROR:", {
        status,
        url,
        response: err?.response?.data,
        message: err?.message,
      });

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.msg ||
          (status ? `Failed to save room (HTTP ${status}).` : "Failed to save room.")
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
    try {
      await deleteRoom(id);
      alert("Room deleted successfully ");
      navigate("/admin/rooms");
    } catch (err) {
      console.error("DELETE ROOM ERROR:", err?.response?.data || err);
      alert(err?.response?.data?.message || err?.response?.data?.error || "Failed to delete room.");
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

  // ✅ Keep your existing UI (I’m not changing your markup)
  return (
    <section className="add-room-sec">
      <div className="container py-5">
        {/* --- your same JSX UI here --- */}
        {/* Just ensure form onSubmit={onSubmit} and delete button calls onDelete */}
      </div>
    </section>
  );
}