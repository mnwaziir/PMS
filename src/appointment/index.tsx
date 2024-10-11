import React, { useState } from "react";

// Define the Doctor interface
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  diseases: string[];
}

interface AppointmentProps {
  doctor: Doctor; // Use the Doctor interface here
  onSubmit: (doctor: Doctor, date: string, time: string) => Promise<void>; // Updated to allow async
  onClose: () => void; // Close function prop
}

const Appointment: React.FC<AppointmentProps> = ({ doctor, onSubmit, onClose }) => {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(doctor, date, time); // Await the async function
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Book Appointment with Dr. {doctor.name} ({doctor.specialty})
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Select Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select Time</label>
            <input
              type="time"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
            >
              Confirm Appointment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
