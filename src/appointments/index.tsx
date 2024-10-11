import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Appointment {
  id: number;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  userEmail: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editAppointmentId, setEditAppointmentId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get the logged-in user's email from localStorage
  const userEmail = localStorage.getItem("login-system");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/appointments", {
          params: { userEmail }, // Fetch appointments related to the logged-in user's email
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchAppointments();
    }
  }, [userEmail]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/appointments/${id}`);
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
      toast.success("Appointment deleted successfully.");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment.");
    }
  };

  const handleEditClick = (appointment: Appointment) => {
    setEditAppointmentId(appointment.id);
    setEditFormData({ ...appointment });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    try {
      await axios.put(`http://localhost:4000/appointments/${editAppointmentId}`, editFormData);
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === editAppointmentId ? editFormData : appointment
        )
      );
      setEditAppointmentId(null);
      setEditFormData(null);
      toast.success("Appointment updated successfully.");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment.");
    }
  };

  const handleCancelEdit = () => {
    setEditAppointmentId(null);
    setEditFormData(null);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading appointments...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <h2 className="text-3xl text-center font-bold text-indigo-600 mb-8">
        Booked Appointments
      </h2>

      <div className="max-w-4xl mx-auto p-4">
        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white shadow-lg p-4 mb-4 rounded-lg"
            >
              {editAppointmentId === appointment.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="doctorName"
                    value={editFormData?.doctorName || ""}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                    placeholder="Doctor Name"
                  />
                  <input
                    type="text"
                    name="specialization"
                    value={editFormData?.specialization || ""}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                    placeholder="Specialization"
                  />
                  <input
                    type="date"
                    name="date"
                    value={editFormData?.date || ""}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="time"
                    name="time"
                    value={editFormData?.time || ""}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white py-1 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-500 text-white py-1 px-4 rounded"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">
                    Doctor: {appointment.doctorName}
                  </h3>
                  <p>Specialization: {appointment.specialization}</p>
                  <p>Date: {appointment.date}</p>
                  <p>Time: {appointment.time}</p>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={() => handleEditClick(appointment)}
                      className="bg-blue-500 text-white py-1 px-4 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="bg-red-500 text-white py-1 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
