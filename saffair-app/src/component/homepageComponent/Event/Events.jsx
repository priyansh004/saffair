import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:6600/api/events/Events");
        if (!response.ok) {
          throw new Error("Error while fetching events!");
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
        initializeMap(data);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };
    fetchData();
  }, []);

  const initializeMap = (events) => {
    if (window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      events.forEach((event) => {
        const marker = new window.google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map,
          title: event.title,
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `<div>
                      <h3>${event.title}</h3>
                      <p>${event.description}</p>
                      <a href="/events/${event._id}">Details</a>
                    </div>`,
        });

        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="p-4 mb-3 text-center font-bold text-5xl text-[#2196ba]">Campaigns</h1>

        <div className="flex flex-col justify-center">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden m-4" style={{ maxWidth: "1000px" }}>
              <Link to={`/events/${event._id}`}>
                <img src={event.eventImage} className="w-full h-48 object-cover" alt="event" />
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                <p className="text-gray-600">{event.description}</p>
                <Link
                  to={`/events/${event._id}`}
                  className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="map" className="w-full max-w-4xl h-96"></div>
    </div>
  );
};

export default Events;
