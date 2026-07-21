"use client";
// import { useEffect, useState } from "react";

// export default function App() {
//   const API_KEY = "bf85ff4999aa467a80acb27d41d7a608";

//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const [address, setAddress] = useState({
//     line1: "",
//     suburb: "",
//     state: "",
//     postcode: "",
//   });

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (query.length > 2 && showDropdown) {
//         fetchLocations(query);
//       }
//     }, 400);
//     return () => clearTimeout(delayDebounceFn);
//   }, [query, showDropdown]);

//   const fetchLocations = async (searchText) => {
//     try {
//       // Note: filter=countrycode:au restricts to Australia.
//       const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchText)}&apiKey=${API_KEY}&filter=countrycode:au&limit=5`;
//       const response = await fetch(url);
//       const data = await response.json();
//       // Geoapify returns data inside a "features" array
//       setSuggestions(data.features || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setSuggestions([]);
//     }
//   };

//   const handleSelect = (item) => {
//     const props = item.properties;

//     setAddress({
//       line1: props.address_line1 || "",
//       suburb: props.city || props.suburb || "",
//       state: props.state_code || props.state || "",
//       postcode: props.postcode || "",
//     });

//     setQuery(props.formatted);
//     setShowDropdown(false);
//     setSuggestions([]);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "500px",
//         margin: "50px auto",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h2>Geoapify Test</h2>
//       <div style={{ position: "relative" }}>
//         <input
//           type="text"
//           value={query}
//           placeholder="Start typing..."
//           autoComplete="off"
//           onChange={(e) => {
//             setQuery(e.target.value);
//             setShowDropdown(true);
//           }}
//           style={{
//             width: "100%",
//             padding: "10px",
//             fontSize: "16px",
//             boxSizing: "border-box",
//           }}
//         />
//         {showDropdown && suggestions.length > 0 && (
//           <ul
//             style={{
//               position: "absolute",
//               top: "100%",
//               left: 0,
//               right: 0,
//               background: "white",
//               border: "1px solid #ccc",
//               margin: 0,
//               padding: 0,
//               listStyle: "none",
//               zIndex: 10,
//             }}
//           >
//             {suggestions.map((item) => (
//               <li
//                 key={item.properties.place_id}
//                 onClick={() => handleSelect(item)}
//                 style={{
//                   padding: "10px",
//                   borderBottom: "1px solid #eee",
//                   cursor: "pointer",
//                 }}
//               >
//                 {item.properties.formatted}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: "10px",
//           marginTop: "20px",
//         }}
//       >
//         <input
//           type="text"
//           value={address.line1}
//           readOnly
//           placeholder="Line 1"
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="text"
//           value={address.suburb}
//           readOnly
//           placeholder="Suburb"
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="text"
//           value={address.state}
//           readOnly
//           placeholder="State"
//           style={{ padding: "8px" }}
//         />
//         <input
//           type="text"
//           value={address.postcode}
//           readOnly
//           placeholder="Postcode"
//           style={{ padding: "8px" }}
//         />
//       </div>
//     </div>
//   );
// }

// LocationIQ:
import { useEffect, useState } from 'react';

export default function App() {
  // Replace this with your actual LocationIQ API key
  const API_KEY = 'pk.da7748ee95704123352a883dec787053';

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [address, setAddress] = useState({
    line1: '',
    suburb: '',
    state: '',
    postcode: ''
  });

  // Watch the user's typing and fetch data with a delay (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Only search if they typed at least 3 characters and the dropdown is active
      if (query.length > 2 && showDropdown) {
        fetchLocations(query);
      }
    }, 400); // Wait 400ms after they stop typing before making the API call

    return () => clearTimeout(delayDebounceFn);
  }, [query, showDropdown]);

  const fetchLocations = async (searchText) => {
    try {
      // Using LocationIQ's autocomplete endpoint
      // Note: ⁠ countrycodes=au ⁠ restricts it to Australia. Remove it for global search.
      const url = `https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${encodeURIComponent(searchText)}&limit=5&countrycodes=au`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    const addr = item.address || {};

    // OpenStreetMap data can be slightly unpredictable.
    // We fall back through a few options to build Line 1 and the Suburb.
    const houseNumber = addr.house_number || '';
    const road = addr.road || addr.pedestrian || '';
    const line1 = `${houseNumber} ${road}`.trim();
    const suburb = addr.suburb || addr.town || addr.city_district || addr.city || '';

    setAddress({
      line1: line1,
      suburb: suburb,
      state: addr.state || '',
      postcode: addr.postcode || ''
    });

    // Update the input field with the fully formatted text
    setQuery(item.display_name);
    // Hide the dropdown menu and clear suggestions
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>LocationIQ React Test</h2>

      <form onSubmit={(e) => { e.preventDefault(); alert(JSON.stringify(address, null, 2)); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Search Container */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Start typing an Australian address:
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true); // Re-open dropdown when typing
            }}
            placeholder="e.g. 100 Harris St"
            autoComplete="off"
            style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
          />

          {/* Custom Dropdown Menu */}
          {showDropdown && suggestions.length > 0 && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderTop: 'none',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              maxHeight: '200px',
              overflowY: 'auto',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 10
            }}>
              {suggestions.map((item) => (
                <li
                  key={item.place_id}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Read-Only Form Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
          <input type="text" value={address.line1} readOnly placeholder="Line 1" style={{ padding: '8px' }}/>
          <input type="text" value={address.suburb} readOnly placeholder="Suburb" style={{ padding: '8px' }}/>
          <input type="text" value={address.state} readOnly placeholder="State" style={{ padding: '8px' }}/>
          <input type="text" value={address.postcode} readOnly placeholder="Postcode" style={{ padding: '8px' }}/>
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          Test Submit to Laravel
        </button>
      </form>
    </div>
  );
}
