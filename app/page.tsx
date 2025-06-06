"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';

import programsData from './data/programs.json';

import MapComponent from "./components/MapComponent";
import ProgramList from "./components/ProgramList";

// Mapbox access token removed - now handled in MapComponent
// const mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lybHNpbmdlYXIiLCJhIjoiY2xwcmF1ajNlMDdiOTJpb2xpcjI5dXF3YiJ9.gAAFitjNaaaHyWJ86qdG9A';

const URI = "http://localhost:4000/program"; // Still needed for search API call if not moved

// Location types and DEFAULT_LOCATIONS moved to MapComponent, but Program type is needed here for state
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

// Keep DEFAULT_LOCATIONS and stateAbbreviations here as they are used by filtering/location logic
type Location = {
  center: [number, number];
  zoom: number;
};

type Locations = {
  [key: string]: Location;
};

const DEFAULT_LOCATIONS: Locations = {
  "Select Location": { center: [-98.5795, 39.8283], zoom: 4.5 },
  Alabama: { center: [-86.9023, 32.3182], zoom: 6 },
  Arizona: { center: [-111.0937, 34.0489], zoom: 6 },
  Arkansas: { center: [-92.3731, 34.9697], zoom: 6 },
  California: { center: [-119.4179, 36.7783], zoom: 5 },
  Colorado: { center: [-105.7821, 39.5501], zoom: 6 },
  Connecticut: { center: [-72.7554, 41.6032], zoom: 7 },
  Delaware: { center: [-75.5277, 38.9108], zoom: 7 },
  Florida: { center: [-81.5158, 27.6648], zoom: 6 },
  Georgia: { center: [-82.9001, 32.1656], zoom: 6 },
  Idaho: { center: [-114.742, 44.0682], zoom: 6 },
  Illinois: { center: [-89.3985, 40.6331], zoom: 6 },
  Indiana: { center: [-86.1349, 40.2672], zoom: 6 },
  Iowa: { center: [-93.0977, 41.878], zoom: 6 },
  Kansas: { center: [-98.4842, 39.0119], zoom: 6 },
  Kentucky: { center: [-84.27, 37.8393], zoom: 6 },
  Louisiana: { center: [-91.9623, 30.9843], zoom: 6 },
  Maine: { center: [-69.4455, 45.2538], zoom: 7 },
  Maryland: { center: [-76.6413, 39.0458], zoom: 7 },
  Massachusetts: { center: [-71.3824, 42.4072], zoom: 7 },
  Michigan: { center: [-85.6024, 44.3148], zoom: 6 },
  Minnesota: { center: [-94.6859, 46.7296], zoom: 6 },
  Mississippi: { center: [-89.3985, 32.3547], zoom: 6 },
  Missouri: { center: [-91.8318, 37.9643], zoom: 6 },
  Montana: { center: [-110.3626, 46.8797], zoom: 6 },
  Nebraska: { center: [-99.9018, 41.4925], zoom: 6 },
  Nevada: { center: [-116.4194, 38.8026], zoom: 6 },
  "New Hampshire": { center: [-71.5724, 43.1939], zoom: 7 },
  "New Jersey": { center: [-74.4057, 40.0583], zoom: 7 },
  "New Mexico": { center: [-105.8701, 34.5199], zoom: 6 },
  "New York": { center: [-74.2179, 43.2994], zoom: 6 },
  "North Carolina": { center: [-79.0193, 35.7596], zoom: 6 },
  "North Dakota": { center: [-101.002, 47.5515], zoom: 6 },
  Ohio: { center: [-82.9071, 40.4173], zoom: 6 },
  Oklahoma: { center: [-97.0929, 35.0078], zoom: 6 },
  Oregon: { center: [-120.5542, 43.8041], zoom: 6 },
  Pennsylvania: { center: [-77.1945, 41.2033], zoom: 6 },
  "Rhode Island": { center: [-71.4774, 41.5801], zoom: 7 },
  "South Carolina": { center: [-81.1637, 33.8361], zoom: 6 },
  "South Dakota": { center: [-99.9018, 43.9695], zoom: 6 },
  Tennessee: { center: [-86.5804, 35.5175], zoom: 6 },
  Texas: { center: [-99.9018, 31.9686], zoom: 5 },
  Utah: { center: [-111.0937, 39.321], zoom: 6 },
  Vermont: { center: [-72.5778, 44.5588], zoom: 7 },
  Virginia: { center: [-78.6569, 37.4316], zoom: 6 },
  Washington: { center: [-120.7401, 47.7511], zoom: 6 },
  "West Virginia": { center: [-80.4549, 38.5976], zoom: 6 },
  Wisconsin: { center: [-88.7879, 43.7844], zoom: 6 },
  Wyoming: { center: [-107.2903, 43.0759], zoom: 6 },
};

const stateAbbreviations: { [key: string]: string } = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  // Add other states as needed
};

export default function Home() {
  const [data, setData] = useState<{ programs: Program[] }>({ programs: programsData.programs });
  const [selectedLocation, setSelectedLocation] = useState<string>("Select Location");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(programsData.programs);
  const [searchLocationCoords, setSearchLocationCoords] = useState<[number, number] | null>(null);
  const [clickedProgramCoords, setClickedProgramCoords] = useState<[number, number] | null>(null);

  // Mapbox refs and functions removed - now in MapComponent
  // const mapContainer = useRef<HTMLDivElement>(null);
  // const map = useRef<mapboxgl.Map | null>(null);
  // const markers = useRef<mapboxgl.Marker[]>([]);

  // Function to clear all markers removed - now in MapComponent
  // const clearMarkers = () => { ... }

  // Function to add markers for programs removed - now in MapComponent
  // const addProgramMarkers = async (programsToAdd: Program[]) => { ... }

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);

    // Filter programs based on selected location using abbreviation mapping
    let filtered = data.programs;
    if (location !== "Select Location") {
      const locationAbbreviation = stateAbbreviations[location];
      if (locationAbbreviation) {
         filtered = data.programs.filter(
           (program) =>
             program.state === locationAbbreviation ||
             (location === "DMV" && ["DC", "MD", "VA"].includes(program.state))
         );
      } else if (location === "DMV") {
         filtered = data.programs.filter(
           (program) => ["DC", "MD", "VA"].includes(program.state)
         );
      } else {
        // If location is not in the mapping and not DMV, show no programs
        filtered = [];
      }
    } else {
      // If "Select Location" is chosen, show all programs
      filtered = data.programs;
    }

    setFilteredPrograms(filtered);
    // Removed direct call to addProgramMarkers here, MapComponent will handle based on filteredPrograms prop
    // addProgramMarkers(filtered);

    // Map view update logic moved to MapComponent useEffect
  };

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchLocationCoords(null); // Clear previous search coordinates on new search

    try {
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          searchQuery
        )}&access_token=${mapboxgl.accessToken}` // Mapbox access token still needed here for search geocoding
      );

      if (response.data.features && response.data.features.length > 0) {
        // Get coordinates of the original search query
        const [lng, lat] = response.data.features[0].geometry.coordinates;

        // Filter programs that match the search query
        const matchingPrograms = data.programs.filter(
          (program) =>
            program.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.address2.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Update filtered programs list
        setFilteredPrograms(matchingPrograms);

        // Determine coordinates to center the map on
        if (matchingPrograms.length > 0) {
          // If programs match, geocode the first one to center the map on a program location
          try {
            const firstMatch = matchingPrograms[0];
            const programAddress = `${firstMatch.address} ${firstMatch.address2} ${firstMatch.city} ${firstMatch.state} ${firstMatch.zip}`;
            const programResponse = await axios.get(
              `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
                programAddress
              )}&access_token=${mapboxgl.accessToken}`
            );

            if (programResponse.data.features && programResponse.data.features.length > 0) {
              const [programLng, programLat] = programResponse.data.features[0].geometry.coordinates;
              setSearchLocationCoords([programLng, programLat]); // Center on the program's coordinates
            } else {
               console.error('Could not geocode the first matching program address for centering.');
               // Fallback: center on the original search query coordinates if program geocoding fails
               setSearchLocationCoords([lng, lat]);
            }
          } catch (programError) {
             console.error('Error during geocoding of the first matching program address for centering:', programError);
             // Fallback: center on the original search query coordinates on error
            setSearchLocationCoords([lng, lat]);
          }
        } else {
          // If no programs match, center on the original search query coordinates
           console.log("No matching programs found, centering on search query location.");
           setSearchLocationCoords([lng, lat]);
        }

      } else {
        // Handle case where search query doesn't return a location
        console.log("Search query did not return a valid location.");
        setFilteredPrograms([]); // Clear list
        setSearchLocationCoords(null); // Clear search coords
      }
    } catch (error) {
      console.error('Error searching location or geocoding:', error);
      setFilteredPrograms([]); // Clear list on error
      setSearchLocationCoords(null); // Clear search coords on error
    } finally {
      setIsSearching(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    // Removed map.current check
    // clearMarkers(); // Handled by MapComponent when programs prop changes

    // Reset to default view showing continental USA - MapComponent will handle based on selectedLocation prop
    // map.current.flyTo({ ... });

    // Reset selected location and show all programs
    setSelectedLocation("Select Location");
    setSearchQuery("");
    setFilteredPrograms(data.programs); // MapComponent will add markers for all programs
    // Removed direct call to addProgramMarkers here
    // addProgramMarkers(data.programs);
    setSearchLocationCoords(null);
    setClickedProgramCoords(null); // Clear clicked program coords on reset
  };

  // Handle clicking a program in the list
  const handleProgramClick = async (program: Program) => {
    setClickedProgramCoords(null); // Clear previous clicked program coords
     try {
      const address = `${program.address} ${program.address2} ${program.city} ${program.state} ${program.zip}`;
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          address
        )}&access_token=${mapboxgl.accessToken}`
      );

      if (response.data.features && response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].geometry.coordinates;
        setClickedProgramCoords([lng, lat]); // Set clicked program coords
      } else {
         console.error('Could not geocode address for clicked program:', address);
      }
    } catch (error) {
      console.error('Error geocoding address for clicked program:', error);
    }
  };

  return (
    <div className="w-screen h-screen min-h-0 min-w-0 flex flex-col bg-[#fbf2fc]">
      <div className="text-center mb-4 pt-4">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "#1FC0DD" }}
        >
          Where are we located?
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <div className="relative">
            <select
              className="text-white px-6 py-3 rounded-full font-semibold appearance-none pr-10 cursor-pointer transition-colors"
              style={{ backgroundColor: "#1FC0DD" }}
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
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="flex flex-1 min-h-0 min-w-0 w-[80vw] mx-auto">
        <div className="w-full lg:w-1/3 bg-white rounded-none p-6 shadow-lg h-full overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {filteredPrograms?.length || 0} Local Chapters Found
            </h3>
            <p className="text-gray-600 text-sm">
              Girls in your area need your support!
            </p>
          </div>

          <ProgramList programs={filteredPrograms} handleProgramClick={handleProgramClick} />
        </div>

        <div className="w-full lg:w-2/3 relative h-full min-h-0 min-w-0">
           <MapComponent 
              programs={filteredPrograms} 
              selectedLocation={selectedLocation} 
              searchQuery={searchQuery} 
              searchLocationCoords={searchLocationCoords} 
              clickedProgramCoords={clickedProgramCoords}
            />
        </div>
      </div>
    </div>
  );
}
