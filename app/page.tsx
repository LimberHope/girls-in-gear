"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import programsData from './data/programs.json';

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
const DEFAULT_LOCATIONS: Locations = {
  "Select Location": { center: [-120.0, 40.0], zoom: 4.5 },
  "Alaska": { center: [-149.4937, 61.3707], zoom: 4 },
  "Virginia": { center: [-78.6569, 37.5215], zoom: 6 },
  "California": { center: [-119.4179, 37.1848], zoom: 5 },
  "Oregon": { center: [-120.5542, 43.8041], zoom: 6 },
  "Washington": { center: [-120.4472, 47.3826], zoom: 6 },
  "Nevada": { center: [-116.4194, 38.8026], zoom: 6 },
  "Arizona": { center: [-111.0937, 34.0489], zoom: 6 }
};

type Program = {
  programType: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  ageRange: string;
  meetingDay: string;
  meetingTime: string;
  region: string;
  registrationStatus: string;
  acceptingVolunteers: string;
};

export default function Home() {
  const [data, setData] = useState<{ programs: Program[] }>({ programs: programsData.programs });
  const [selectedLocation, setSelectedLocation] = useState<string>("Select Location");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(programsData.programs);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_LOCATIONS["Select Location"].center,
      zoom: DEFAULT_LOCATIONS["Select Location"].zoom,
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

  // Function to clear all markers
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  // Function to add markers for programs
  const addProgramMarkers = async (programs: Program[]) => {
    if (!map.current) return;
    clearMarkers();

    for (const program of programs) {
      try {
        const address = `${program.address} ${program.address2} ${program.city} ${program.state} ${program.zip}`;
        const response = await axios.get(
          `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
            address
          )}&access_token=${mapboxgl.accessToken}`
        );

        if (response.data.features && response.data.features.length > 0) {
          const [lng, lat] = response.data.features[0].geometry.coordinates;
          
          // Create popup content
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-4 rounded-lg">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <h4 class="font-semibold text-cyan-600 text-sm mb-1">
                    ${program.programType}
                  </h4>
                  <p class="text-xs text-gray-600 mb-1">
                    ${program.region}
                  </p>
                  <p class="text-xs text-gray-500 mb-1">📞 (555)-55555</p>
                  <p class="text-xs text-cyan-500 mb-3">
                    💻 www.examplewebsite.org
                  </p>
                  <div class="mt-4 text-center">
                    <button 
                      onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(program.address + ' ' + program.address2 + ' ' + program.city + ' ' + program.state + ' ' + program.zip)}', '_blank')"
                      class="block w-full bg-cyan-400 text-white px-4 py-3 rounded-full text-xs font-semibold hover:bg-cyan-500 transition-colors"
                    >
                      View Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `);

          // Add marker with popup
          const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current);
          
          markers.current.push(marker);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }
  };

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    
    // Filter programs based on selected location
    if (location !== "Select Location") {
      const filtered = data.programs.filter(program => 
        program.state === location || 
        (location === "DMV" && ["DC", "MD", "VA"].includes(program.state))
      );
      setFilteredPrograms(filtered);
      addProgramMarkers(filtered);
    } else {
      setFilteredPrograms(data.programs);
      addProgramMarkers(data.programs);
    }

    // Update map view
    if (map.current && DEFAULT_LOCATIONS[location]) {
      map.current.flyTo({
        center: DEFAULT_LOCATIONS[location].center,
        zoom: DEFAULT_LOCATIONS[location].zoom,
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
        
        clearMarkers();

        // Filter programs that match the search query
        const matchingPrograms = data.programs.filter(program => 
          program.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.address2.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Update filtered programs
        setFilteredPrograms(matchingPrograms);

        // Add markers for matching programs
        for (const program of matchingPrograms) {
          try {
            const address = `${program.address} ${program.address2} ${program.city} ${program.state} ${program.zip}`;
            const programResponse = await axios.get(
              `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
                address
              )}&access_token=${mapboxgl.accessToken}`
            );

            if (programResponse.data.features && programResponse.data.features.length > 0) {
              const [programLng, programLat] = programResponse.data.features[0].geometry.coordinates;
              
              // Create popup content
              const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-4 rounded-xl">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white text-sm">
                      👟
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-cyan-600 text-sm mb-1">
                        ${program.programType}
                      </h4>
                      <p class="text-xs text-gray-600 mb-1">
                        ${program.region}
                      </p>
                      <p class="text-xs text-gray-500 mb-1">📞 (555)-55555</p>
                      <p class="text-xs text-cyan-500 mb-3">
                        💻 www.examplewebsite.org
                      </p>
                      <div class="mt-4 text-center">
                        <button 
                          onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(program.address + ' ' + program.address2 + ' ' + program.city + ' ' + program.state + ' ' + program.zip)}', '_blank')"
                          class="block w-full bg-cyan-400 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-cyan-500 transition-colors"
                        >
                          View Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `);

              // Add marker with popup
              const marker = new mapboxgl.Marker()
                .setLngLat([programLng, programLat])
                .setPopup(popup)
                .addTo(map.current);
              
              markers.current.push(marker);
            }
          } catch (error) {
            console.error('Error geocoding program address:', error);
          }
        }

        // Fly to the searched location
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

  // Handle reset
  const handleReset = () => {
    if (!map.current) return;
    
    clearMarkers();
    
    // Reset to default view showing continental USA
    map.current.flyTo({
      center: DEFAULT_LOCATIONS["Select Location"].center,
      zoom: DEFAULT_LOCATIONS["Select Location"].zoom,
      duration: 2000
    });

    // Reset selected location and show all programs
    setSelectedLocation("Select Location");
    setSearchQuery("");
    setFilteredPrograms(data.programs);
    addProgramMarkers(data.programs);
  };

  return (
    <div className="w-screen h-screen min-h-0 min-w-0 flex flex-col bg-[#fbf2fc]">
      <div className="text-center mb-4 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1FC0DD' }}>
          Where are we located?
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <div className="relative">
            <select 
              className="text-white px-6 py-3 rounded-full font-semibold appearance-none pr-10 cursor-pointer transition-colors"
              style={{ backgroundColor: '#1FC0DD' }}
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              {Object.keys(DEFAULT_LOCATIONS).map((location) => (
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

          <button 
            onClick={handleReset}
            className="bg-cyan-200 text-cyan-700 px-6 py-3 rounded-full font-semibold hover:bg-cyan-300 transition-colors"
          >
            Reset Map
          </button>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden w-[80vw] mx-auto">
        <div className="w-full lg:w-1/3 bg-white rounded-none p-6 shadow-lg h-full overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {filteredPrograms?.length || 0} Local Chapters Found
            </h3>
            <p className="text-gray-600 text-sm">
              Girls in your area need your support!
            </p>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredPrograms?.map((program, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  👟
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-cyan-600 text-sm">
                    {program.programType}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {program.address}, {program.city}, {program.state} {program.zip}
                  </p>
                  <p className="text-xs text-gray-500">📞 (555)-55555</p>
                  <p className="text-xs text-gray-500">Age Range: {program.ageRange}</p>
                  <p className="text-xs text-cyan-500">
                    {program.meetingDay} {program.meetingTime}
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
            ))}
          </div>
        </div>
        <div className="w-full lg:w-2/3 relative h-full min-h-0 min-w-0">
          <div
            ref={mapContainer}
            className="w-full h-full rounded-none shadow-lg min-h-0 min-w-0"
          ></div>
        </div>
      </div>
    </div>
  );
}
