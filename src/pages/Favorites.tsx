import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchFavorites = () => {
    if (!token) return setFavorites([]);
    api
      .get("/favorites", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setFavorites(res.data));
  };

  useEffect(fetchFavorites, [token]);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>⭐ My Favorite Hotels</h2>
      <div className="hotel-grid">
        {favorites.length === 0 && <p>You have no favorite hotels yet.</p>}
        {favorites.map((fav) => (
        <div className="hotel-card" key={fav._id}>
            {fav.hotel.imageUrl && (
            <img
            src={fav.hotel.imageUrl ? `http://localhost:5000${fav.hotel.imageUrl}` : "/default-image.png"}
            alt={fav.hotel.name}
            className="hotel-image"
            />

            )}
            <div className="hotel-details">
            <div className="hotel-name">{fav.hotel.name}</div>
            <div className="hotel-info">📍 {fav.hotel.location}</div>
            <div className="hotel-info">🛏 {fav.hotel.availableRooms} rooms</div>
            <div className="hotel-price">HK${fav.hotel.pricePerNight}</div>
            <button className="detail-btn" onClick={() => navigate(`/hotels/${fav.hotel._id}`)}>
                View Details
            </button>
            </div>
        </div>
        ))}

      </div>
    </div>
  );
};

export default Favorites;
