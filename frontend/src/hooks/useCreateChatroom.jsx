import { useState } from "react";
import { fetchPath, fetchWithCredentials } from "../utils";

const useCreateChatroom = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const roomsEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value._id === arr2[index]);
  }

  const createRoom = async (roomInfo) => {
    setIsLoading(true);
    setError(null);

    const responseRooms = await fetchWithCredentials(fetchPath("/chat"), {
      method: "GET",
    });

    let json = await responseRooms.json()
    let terminate = false;

    if (!responseRooms.ok) {
      setIsLoading(false);
      setError(json.message);
      terminate = true;
    } else {
      const allRooms = json.allChatrooms;
      allRooms.forEach((room) => {
        if (roomsEqual(room.users, roomInfo.users)) {
          setIsLoading(false);
          setRoomId(room._id); 
          terminate = true;
        }
      });
    }

    if (terminate) return;

    const response = await fetchWithCredentials(fetchPath("/chat"), {
      method: "POST",
      body: JSON.stringify({roomInfo})
    });

    json = await response.json();

    setIsLoading(false);
    if (!response.ok) {
      setError(json.message);
      setRoomId(null);
    } else {
      setError(null);
      setRoomId(json.room._id);
    }
  };
  return { error, createRoom, isLoading, roomId };
};

export default useCreateChatroom;
