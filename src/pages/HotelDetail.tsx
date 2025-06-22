import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import HotelMessages from "../components/HotelMessages";
import FavoriteButton from "../components/FavoriteButton";

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => {
    if (!hotelId) return;
    api
      .get(`/hotels/${hotelId}`)
      .then((res) => setHotel(res.data))
      .catch(() => setHotel(null));
  }, [hotelId]);

  if (!hotel) return <p>Loading...</p>;

  return (
    <div className="hotel-detail-card">
      <FavoriteButton hotelId={hotel._id} />
      <div className="hotel-detail-header">
        <h2>
          {hotel.name}
        </h2>
      </div>
      {hotel.imageUrl && (
        <img
          src={hotel.imageUrl.startsWith("http") ? hotel.imageUrl : `http://localhost:5000${hotel.imageUrl}`}
          alt={hotel.name}
          className="hotel-detail-image"
        />
      )}
      <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
        📍 Location: {hotel.location}
      </p>
      <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
        🛏 Available Rooms: {hotel.availableRooms}
      </p>
      <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
        💰 Price: HK${hotel.pricePerNight}
      </p>
      <HotelMessages hotelId={hotel._id} />
    </div>
  );
};

export default HotelDetail;
