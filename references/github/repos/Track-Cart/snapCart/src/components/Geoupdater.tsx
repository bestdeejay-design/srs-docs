"use client"
import { getsocket } from '@/lib/socket'
import React, { useEffect } from 'react'

const GeoUpdater = ({ userId }: { userId: string }) => {

  const socket = getsocket();

  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    socket.emit("identity", userId);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        socket.emit("update-location", {
          userId,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [userId]);

  return null;
};

export default GeoUpdater;
