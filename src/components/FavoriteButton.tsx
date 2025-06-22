// src/components/FavoriteButton.tsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface FavoriteButtonProps {
  hotelId: string;
  onChange?: () => void;
}

const FavoriteButton = ({ hotelId, onChange }: FavoriteButtonProps) => {
  const { token } = useAuth();
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .get("/favorites", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const fav = res.data.find((f: any) => f.hotel._id === hotelId);
        setFavoriteId(fav ? fav._id : null);
      })
      .finally(() => setLoading(false));
  }, [hotelId, token]);

  const handleToggle = async () => {
    if (!token) return alert("Please log in first.");
    setLoading(true);
    try {
      if (favoriteId) {
        await api.delete(`/favorites/${favoriteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteId(null);
      } else {
        const res = await api.post(
          "/favorites",
          { hotelId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavoriteId(res.data.favorite._id);
      }
      if (onChange) onChange();
    } catch (err) {
      alert("Favorite operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        border: "none",
        background: "none",
        fontSize: "1.7rem",
        cursor: loading ? "wait" : "pointer",
        color: favoriteId ? "#fbbf24" : "#bbb",
        marginLeft: 12,
        verticalAlign: "middle",
      }}
      title={favoriteId ? "Remove from favorites" : "Add to favorites"}
      disabled={loading}
    >
      {favoriteId ? "★" : "☆"}
    </button>
  );
};

export default FavoriteButton;
