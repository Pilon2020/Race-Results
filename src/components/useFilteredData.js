import { useMemo } from 'react';

const useFilteredData = (query, athleteData) => {
  return useMemo(() => {
    if (!query) return athleteData; // Return all data if no query

    const lowercasedQuery = query.toLowerCase();
    return athleteData.filter(({ first_name, last_name, city, state }) => 
      first_name.toLowerCase().includes(lowercasedQuery) ||
      last_name.toLowerCase().includes(lowercasedQuery) ||
      city.toLowerCase().includes(lowercasedQuery) ||
      state.toLowerCase().includes(lowercasedQuery)
    );
  }, [query, athleteData]);
};

export default useFilteredData;
