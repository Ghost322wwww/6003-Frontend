import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddHotel = () => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [availableRooms, setAvailableRooms] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('pricePerNight', pricePerNight);
    formData.append('availableRooms', availableRooms);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/hotels', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/hotels'); 
    } catch (err) {
      console.error('Error creating hotel:', err);
      setError('Failed to create hotel');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hotel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price per Night"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Available Rooms"
          value={availableRooms}
          onChange={(e) => setAvailableRooms(e.target.value)}
          required
        />
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Add Hotel</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddHotel;
