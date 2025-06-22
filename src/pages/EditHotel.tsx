import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditHotel = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [availableRooms, setAvailableRooms] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hotelId) return;
    api.get(`/hotels/${hotelId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setHotel(res.data);
      setName(res.data.name);
      setLocation(res.data.location);
      setPricePerNight(res.data.pricePerNight.toString());
      setAvailableRooms(res.data.availableRooms.toString());
      setCurrentImageUrl(res.data.image || null);
    })
    .catch(err => {
      console.error('Failed to fetch hotel data', err);
    });
  }, [hotelId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('pricePerNight', pricePerNight);
    formData.append('availableRooms', availableRooms);
    if (image) formData.append('image', image);

    try {
      const res = await api.put(`/hotels/${hotelId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Hotel updated:', res.data);
      navigate(`/hotels/${hotelId}`);
    } catch (err) {
      console.error('Failed to update hotel', err);
      alert('Failed to update hotel');
    }
  };

  if (!hotel) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
      <h2>Edit Hotel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Hotel Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="pricePerNight">Price per Night</label>
          <input
            type="number"
            id="pricePerNight"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="availableRooms">Available Rooms</label>
          <input
            type="number"
            id="availableRooms"
            value={availableRooms}
            onChange={(e) => setAvailableRooms(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Current Image</label><br />
          {currentImageUrl ? (
            <img
              src={`http://localhost:5000${currentImageUrl}`}
              alt="Hotel"
              style={{ width: 200, height: 'auto', marginBottom: '1rem' }}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>

        <div>
          <label htmlFor="image">Change Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <button type="submit">Update Hotel</button>
      </form>
    </div>
  );
};

export default EditHotel;
