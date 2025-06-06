import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

// Replace with your Mapbox access token - Consider moving this to an environment variable
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2lybHNpbmdlYXIiLCJhIjoiY2xwcmF1ajNlMDdiOTJpb2xpcjI5dXF3YiJ9.gAAFitjNaaaHyWJ86qdG9A";

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
  clickedProgramCoords?: [number, number] | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  programs,
  selectedLocation,
  searchQuery,
  searchLocationCoords,
  clickedProgramCoords,
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

          // Create a DOM element for the marker with the bicycle SVG
          const el = document.createElement('div');
          el.className = 'marker';
          el.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white p-2">
                <svg fill="currentColor" height="20" width="20" viewBox="0 0 491.351 491.351" xmlns="http://www.w3.org/2000/svg">
                  <path d="M381.559,182.007c-0.895,0-1.755,0.115-2.632,0.138l-14.934-87.322c-0.809-4.71-3.613-8.842-7.674-11.355
                    c-4.051-2.511-8.998-3.154-13.582-1.772l-44.975,13.622c-8.792,2.667-13.763,11.963-11.097,20.771
                    c2.667,8.801,11.992,13.789,20.757,11.111l26.901-8.15l6.167,35.949H198.895v-7.076l17.403-4.393
                    c6.916-1.741,11.845-8.19,11.433-15.575c-0.464-8.369-7.639-14.77-16.018-14.29l-64.285,3.653c-1.282,0.08-2.701,0.292-4.001,0.616
                    c-11.415,2.889-18.349,14.487-15.467,25.906c2.882,11.419,14.495,18.339,25.911,15.458l11.707-2.959v10.815l-13.694,23.586
                    c-12.964-5.61-27.142-8.733-42.032-8.733C49.282,182.007,0,233.227,0,296.184C0,359.151,49.282,410.37,109.852,410.37
                    c55.081,0,100.708-42.453,108.494-97.529h17.763c4.732,0,9.239-2.017,12.396-5.547l24.432-27.287
                    c-0.732,5.304-1.239,10.673-1.239,16.177c0,62.968,49.291,114.187,109.861,114.187c60.543,0,109.792-51.219,109.792-114.187
                    C491.351,233.227,442.102,182.007,381.559,182.007z M109.852,377.058c-42.203,0-76.544-36.28-76.544-80.874
                    c0-44.591,34.341-80.864,76.544-80.864c8.783,0,17.084,1.895,24.956,4.789l-39.365,67.709c-2.994,5.148-3.011,11.508-0.035,16.672
                    c2.959,5.165,8.474,8.352,14.444,8.352h74.824C177.39,349.464,146.62,377.058,109.852,377.058z M184.676,279.528h-45.868
                    l24.078-41.406C173.682,249.151,181.476,263.423,184.676,279.528z M228.66,279.528h-10.314
                    c-4.001-28.383-17.988-53.433-38.255-71.018l11.743-20.202h118.464L228.66,279.528z M381.559,377.058
                    c-42.211,0-76.544-36.28-76.544-80.874c0-33.481,19.355-62.272,46.874-74.536l13.239,77.351c1.403,8.118,8.431,13.842,16.397,13.842
                    c0.945,0,1.892-0.072,2.829-0.236c9.085-1.553,15.166-10.167,13.618-19.232l-13.307-77.72c40.714,1.774,73.378,37.07,73.378,80.531
                    C458.043,340.777,423.719,377.058,381.559,377.058z"/>
                </svg>
              </div>
            </div>
          `;

          // Create popup content
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-4 rounded-xl">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <h4 class="font-semibold text-cyan-600 text-sm mb-1">
                    Girls on the Run ${program.region}
                  </h4>
                  <p class="text-xs text-gray-600 mb-1">
                    ${program.address}, ${program.city}, ${program.state} ${program.zip}
                  </p>
                  <p class="text-xs text-gray-500 mb-1">
                    <svg class="inline-block w-3 h-3 mr-1 text-cyan-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z"/>
                    </svg>
                    (555)-55555
                  </p>
                  <p class="text-xs text-cyan-500 mb-3">
                    <svg class="inline-block w-3 h-3 mr-1 text-cyan-500" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M477.984,39.203H34.016C15.219,39.203,0,54.438,0,73.219v283.969c0,18.781,15.219,34.016,34.016,34.016H220
                        v7.578c0,18.781-15.219,34.016-34.016,34.016H136v40h73.188h93.625H376v-40h-49.984c-18.797,0-34.016-15.234-34.016-34.016v-7.578
                        h185.984c18.797,0,34.016-15.234,34.016-34.016V73.219C512,54.438,496.781,39.203,477.984,39.203z M464,315.859
                        c0,6.266-5.078,11.344-11.344,11.344H59.344c-6.266,0-11.344-5.078-11.344-11.344V98.547c0-6.266,5.078-11.344,11.344-11.344
                        h393.313c6.266,0,11.344,5.078,11.344,11.344V315.859z"/>
                    </svg>
                    http://girlsingear.org/
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
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
          })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current);

          markers.current.push(marker);
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    }
  };

  useEffect(() => {
    addProgramMarkers(programs);
  }, [programs]); // Add markers whenever the programs prop changes

  // Effect to update map view based on selected location, search query, or clicked program
  useEffect(() => {
    if (!map.current) return;

    if (clickedProgramCoords) {
      // If a program in the list was clicked, fly to its coordinates
      map.current.flyTo({
        center: clickedProgramCoords,
        zoom: 14, // Adjust zoom level as needed for individual program locations
        duration: 2000,
      });
    } else if (searchQuery.trim()) {
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
  }, [
    selectedLocation,
    searchQuery,
    searchLocationCoords,
    clickedProgramCoords,
  ]); // Add clickedProgramCoords to dependencies

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-2xl shadow-lg min-h-[400px]"
    ></div>
  );
};

export default MapComponent;
