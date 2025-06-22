
import { useParams } from 'react-router-dom';
import HotelMessages from '../components/HotelMessages';

const HotelMessagesWrapper = () => {
  const { hotelId } = useParams<{ hotelId: string }>();

  if (!hotelId) return <p>Hotel not found</p>;

  return <HotelMessages hotelId={hotelId!} />

};

export default HotelMessagesWrapper;
