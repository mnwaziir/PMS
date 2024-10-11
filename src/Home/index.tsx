import React, { useState, useEffect } from "react";
import axios from "axios";
import Appointment from "../appointment";

// Define the Doctor interface
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  diseases: string[];
}

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Type explicitly as string
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]); // Use Doctor[] for array of doctors
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Doctor or null
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Carousel state
  const [activeIndex, setActiveIndex] = useState<number>(0); // Index of current slide
  const images = [
    "/images/irwan-rbDE93-0hHs-unsplash.jpg",
    "/images/marcelo-leal-6pcGTJDuf6M-unsplash.jpg",
    "/images/hms.jpg",
  ];

  // Automatically change the active slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [images.length]);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:4000/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    const filtered = doctors.filter((doctor) =>
      doctor.diseases.some((disease: string) =>
        disease.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = async (doctor: Doctor, date: string, time: string) => {
    const userEmail = localStorage.getItem("login-system"); // Get user email from localStorage

    const appointment = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialty,
      date,
      time,
      userEmail, // Include user's email
    };

    try {
      await axios.post("http://localhost:4000/appointments", appointment);
      alert("Appointment booked successfully!");
      setSelectedDoctor(null); // Close the appointment modal after successful booking
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Full-screen Carousel Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full flex transition-transform duration-500" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Book Appointment Section */}
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-3xl font-bold text-indigo-600">Book Appointment</h2>
        <div className="mt-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Type disease..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Doctor List */}
      <div className="mt-8 px-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 bg-white shadow rounded-lg mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
              </div>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                onClick={() => setSelectedDoctor(doctor)}
              >
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No doctors found for this disease</p>
        )}
      </div>

      {/* Appointment Modal */}
      {selectedDoctor && (
        <Appointment
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)} // Close modal
          onSubmit={handleBookAppointment}
        />
      )}
    </div>
  );
};

export default Home;
