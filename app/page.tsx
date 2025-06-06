"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lybHNpbmdlYXIiLCJhIjoiY2xwcmF1ajNlMDdiOTJpb2xpcjI5dXF3YiJ9.gAAFitjNaaaHyWJ86qdG9A';

const URI = "http://localhost:4000/program";

type Location = {
  center: [number, number];
  zoom: number;
};

type Locations = {
  [key: string]: Location;
};

// Location data with coordinates
const locations: Locations = {
  "Select Location": { center: [-120.0, 40.0], zoom: 4.5 },
  "Alaska": { center: [-149.4937, 61.3707], zoom: 4 },
  "Virginia": { center: [-78.6569, 37.5215], zoom: 6 },
  "California": { center: [-119.4179, 37.1848], zoom: 5 },
  "Oregon": { center: [-120.5542, 43.8041], zoom: 6 },
  "Washington": { center: [-120.4472, 47.3826], zoom: 6 },
  "Nevada": { center: [-116.4194, 38.8026], zoom: 6 },
  "Arizona": { center: [-111.0937, 34.0489], zoom: 6 }
};

export default function Home() {
  const [data, setData] = useState();
  const [selectedLocation, setSelectedLocation] = useState<string>("Select Location");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const programRequest = async () => {
    const res = await axios.get(URI);
    setData(res.data);
  };

  useEffect(() => {
    programRequest();
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: locations["Select Location"].center,
      zoom: locations["Select Location"].zoom,
      minZoom: 3,
      maxZoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    if (map.current && locations[location]) {
      map.current.flyTo({
        center: locations[location].center,
        zoom: locations[location].zoom,
        duration: 2000
      });
    }
  };

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !map.current) return;

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          searchQuery
        )}&access_token=${mapboxgl.accessToken}`
      );

      if (response.data.features && response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].geometry.coordinates;
        
        // Remove existing marker if any
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);

        // Fly to the location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  console.log(data);
  return (
    <div className="px-4 py-8 bg-[#fbf2fc] size-full">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">
          Where are we located?
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <div className="relative">
            <select 
              className="bg-cyan-400 text-white px-6 py-3 rounded-full font-semibold appearance-none pr-10 cursor-pointer hover:bg-cyan-500 transition-colors"
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              {Object.keys(locations).map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Vienna, VA 22181"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors"
              disabled={isSearching}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </form>

          <button className="bg-cyan-200 text-cyan-700 px-6 py-3 rounded-full font-semibold hover:bg-cyan-300 transition-colors">
            Reset Map
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 bg-white rounded-2xl p-6 shadow-lg">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              48 Local Chapters Found
            </h3>
            <p className="text-gray-600 text-sm">
              Girls in your area need your support!
            </p>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                👟
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-600 text-sm">
                  Girls on the Run Alaska
                </h4>
                <p className="text-xs text-gray-600">
                  Anchorage, Matanuska Susitna
                </p>
                <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                <p className="text-xs text-cyan-500">
                  🌐 www.gotrsouthcentralak.org
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                👟
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-600 text-sm">
                  Girls on the Run Southcentral Ala...
                </h4>
                <p className="text-xs text-gray-600">
                  Anchorage, Matanuska Susitna
                </p>
                <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                <p className="text-xs text-cyan-500">
                  🌐 www.gotrsouthcentralak.org
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                👟
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-600 text-sm">
                  Girls on the Run Southcentral Ala...
                </h4>
                <p className="text-xs text-gray-600">
                  Anchorage, Matanuska Susitna
                </p>
                <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                <p className="text-xs text-cyan-500">
                  🌐 www.gotrsouthcentralak.org
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                👟
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-600 text-sm">
                  Girls on the Run Southcentral Ala...
                </h4>
                <p className="text-xs text-gray-600">
                  Anchorage, Matanuska Susitna
                </p>
                <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                <p className="text-xs text-cyan-500">
                  🌐 www.gotrsouthcentralak.org
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                👟
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-600 text-sm">
                  Girls on the Run Southcentral Ala...
                </h4>
                <p className="text-xs text-gray-600">
                  Anchorage, Matanuska Susitna
                </p>
                <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                <p className="text-xs text-cyan-500">
                  🌐 www.gotrsouthcentralak.org
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 relative">
          <div
            ref={mapContainer}
            className="w-full h-96 lg:h-full rounded-2xl shadow-lg min-h-[400px]"
          ></div>

          <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white text-sm">
                👟
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyan-600 text-sm mb-1">
                  Girls on the Run Southcentral Alaska
                </h4>
                <p className="text-xs text-gray-600 mb-1">
                  Anchorage, Matanuska Susitna
                </p>
                <p className="text-xs text-gray-500 mb-1">📞 (907) 306-0789</p>
                <p className="text-xs text-cyan-500 mb-3">
                  🌐 www.gotrsouthcentralak.org
                </p>
                <button className="bg-cyan-400 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-cyan-500 transition-colors">
                  View Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
