import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  imageUrl?: string;  // 改成 imageUrl
}

const Hotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [inputLocation, setInputLocation] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get('/hotels', {
          headers: { Authorization: `Bearer ${token}` },
          params: searchLocation ? { location: searchLocation } : {},
        });
        setHotels(res.data);
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      }
    };
    fetchHotels();
  }, [token, searchLocation]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchLocation(inputLocation);
    }
  };

  const handleSearchClick = () => {
    setSearchLocation(inputLocation);
  };

  const handleEdit = (hotelId: string) => {
    navigate(`/hotels/${hotelId}/edit`);
  };

  const handleDelete = async (hotelId: string) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await api.delete(`/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(hotels => hotels.filter(h => h._id !== hotelId));
    } catch (err) {
      alert('Delete failed');
      console.error(err);
    }
  };

  return (
    <div className="hotel-container">
      <h2>Hotels</h2>
      <div className="hotel-search-bar">
        <input
          type="text"
          placeholder="Search by location..."
          value={inputLocation}
          onChange={e => setInputLocation(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <div className="hotel-grid">
        {hotels.length === 0 && <p>No hotels available at the moment.</p>}
        {hotels.map((hotel) => (
          <div className="hotel-card" key={hotel._id}>
            {hotel.imageUrl && (
              <img
                src={hotel.imageUrl.startsWith('http') ? hotel.imageUrl : `http://localhost:5000${hotel.imageUrl}`}
                alt={hotel.name}
                className="hotel-image"
              />
            )}
            <div className="hotel-details">
              <div className="hotel-name">{hotel.name}</div>
              <div className="hotel-info">📍 {hotel.location}</div>
              <div className="hotel-info">🛏 {hotel.availableRooms} rooms</div>
              <div className="hotel-price">HK${hotel.pricePerNight}</div>
              <button className="detail-btn" onClick={() => navigate(`/hotels/${hotel._id}`)}>
                View Details
              </button>
              {user?.role === 'operator' && (
                <button className="detail-btn" onClick={() => handleEdit(hotel._id)}>
                  Edit Hotel
                </button>
              )}
              {user?.role === 'operator' && (
                <button className="delete-btn" onClick={() => handleDelete(hotel._id)}>
                  Delete Hotel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
