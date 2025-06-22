// src/routes/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Hotels from '../pages/Hotels';
import AddHotel from '../pages/AddHotel';
import EditHotel from '../pages/EditHotel'; 
import HotelDetail from '../pages/HotelDetail';
import HotelMessagesWrapper from '../pages/HotelMessagesWrapper';
import SidebarLayout from '../components/SidebarLayout';
import { useAuth } from '../context/AuthContext';
import ViewMessages from '../pages/ViewMessages';
import Favorites from '../pages/Favorites';
import Profile from '../pages/Profile';



const AppRouter = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Navigate to="/hotels" replace />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/add-hotel" element={<AddHotel />} />
          <Route path="/hotels/:hotelId" element={<HotelDetail />} />
           <Route path="/hotels/:hotelId/edit" element={<EditHotel />} />  
          <Route
            path="/messages/:hotelId"
            element={token ? <HotelMessagesWrapper /> : <Navigate to="/login" />}
          />
          <Route path="/messages" element={<ViewMessages />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
