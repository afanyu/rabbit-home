import React from "react";
import { useSelector } from "react-redux";

const useRoom = (id = "") => {
  const [rooms, setRooms] = React.useState([]);
  const [room, setRoom] = React.useState([]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  React.useEffect(() => {
    const url = `http://localhost:8000/api/room`;
    const fetchRooms = async (url) => {
      const token = userInfo.token
      try {
        const response = await fetch(url, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setRooms(data);
      } catch (error) {
        console.log("Room Error.", error);
      }
    };

    fetchRooms(url);
  }, [id]);

  React.useEffect(() => {
    const url = `/api/room/${id}`;
    const fetchRoom = async (url) => {
      const token = userInfo.token
      try {
        const response = await fetch(url, {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setRoom(data);
      } catch (error) {
        console.log("Room Error.", error);
      }
    };

    fetchRoom(url);
  }, [id]);

  return { room, rooms };
};

export default useRoom;
