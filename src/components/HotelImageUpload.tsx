import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddHotel = () => {
  const { token } = useAuth();  
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);  // 清除錯誤
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);  
    formData.append('name', hotelName);
    formData.append('location', hotelLocation);

    try {
      const res = await axios.post('/hotels', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(res.data.imageUrl);  
      setError(null);  
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
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Hotel Location"
          value={hotelLocation}
          onChange={(e) => setHotelLocation(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Create Hotel</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded Hotel" />}
    </div>
  );
};

export default AddHotel;
