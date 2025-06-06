import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

// Replace with your Mapbox access token - Consider moving this to an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lybHNpbmdlYXIiLCJhIjoiY2xwcmF1ajNlMDdiOTJpb2xpcjI5dXF3YiJ9.gAAFitjNaaaHyWJ86qdG9A';

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

interface MapComponentProps {
  programs: Program[];
  selectedLocation: string;
  searchQuery: string;
  searchLocationCoords?: [number, number] | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  programs,
  selectedLocation,
  searchQuery,
  searchLocationCoords,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_LOCATIONS["Select Location"].center,
      zoom: DEFAULT_LOCATIONS["Select Location"].zoom,
      minZoom: 3,
      maxZoom: 15,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Function to clear all markers
  const clearMarkers = () => {
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];
  };

  // Function to add markers for programs
  const addProgramMarkers = async (programsToAdd: Program[]) => {
    if (!map.current) return;
    clearMarkers();

    for (const program of programsToAdd) {
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
                  <button 
                    onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      program.address +
                        " " +
                        program.address2 +
                        " " +
                        program.city +
                        " " +
                        program.state +
                        " " +
                        program.zip
                    )}', '_blank')"
                    class="block w-full text-center bg-cyan-400 text-white px-4 py-3 rounded-xl text-xs font-semibold hover:bg-cyan-500 transition-colors mt-4"
                  >
                    View Directions
                  </button>
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

  useEffect(() => {
    addProgramMarkers(programs);
  }, [programs]); // Add markers whenever the programs prop changes

  // Effect to update map view based on selected location or search query
  useEffect(() => {
    if (!map.current) return;

    if (searchQuery.trim()) {
      // Handle map view for search query - This logic might need to be passed down or handled differently
      // For now, it's commented out or simplified as map component shouldn't directly handle search API calls
      // You would likely want the parent component to handle search and pass down the center/zoom
      if (searchLocationCoords) {
        map.current.flyTo({
          center: searchLocationCoords,
          zoom: 12, // Or another appropriate zoom level for search results
          duration: 2000,
        });
      }

    } else if (selectedLocation && DEFAULT_LOCATIONS[selectedLocation]) {
      // Handle map view for selected location
      map.current.flyTo({
        center: DEFAULT_LOCATIONS[selectedLocation].center,
        zoom: DEFAULT_LOCATIONS[selectedLocation].zoom,
        duration: 2000,
      });
    } else {
       // Default view or reset
       map.current.flyTo({
         center: DEFAULT_LOCATIONS["Select Location"].center,
         zoom: DEFAULT_LOCATIONS["Select Location"].zoom,
         duration: 2000,
       });
    }

  }, [selectedLocation, searchQuery, searchLocationCoords]); // Rerun when selectedLocation or searchQuery changes


  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-2xl shadow-lg min-h-[400px]"
    ></div>
  );
};

export default MapComponent; 