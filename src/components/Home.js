import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = ({ athleteData }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce input to reduce the frequency of filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Filter data based on query
  const filteredData = athleteData.filter(
    (athlete) =>
      athlete.first_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      athlete.last_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      athlete.city.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      athlete.state.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="search-bar">
        <input
          placeholder="Search by Name, City, or State"
          onChange={(event) => setQuery(event.target.value)}
          className="SearchBar"
        />

        {debouncedQuery && filteredData.length > 0 ? (
          filteredData.map((post, index) => (
            <Link 
              to={`/Athlete/${post.first_name}_${post.last_name}`} 
              key={index}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div>
                <p>{post.first_name} {post.last_name} - {post.city}, {post.state}</p>
              </div>
            </Link>
          ))
        ) : debouncedQuery ? (
          <p>No results found</p>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default Home;
