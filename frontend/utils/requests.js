if (typeof window !== "undefined") {
  const getRequestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Token"),
    },
  };
}

export const fetchTags = () => {
  return fetch(`http://localhost:8000/tags/`, getRequestOptions).then((response) => {
    return response.json().then((data) => {
      return {
        tags: data.map((tag) => tag[0]),
        tagMap: data.reduce((obj, tag) => {
          return {
            ...obj,
            [tag[0]]: tag[1],
          };
        }, {}),
      };
    });
  });
};

export const fetchLocations = () => {
  return fetch(`http://localhost:8000/locations/`, getRequestOptions).then((response) => {
    return response.json().then((data) => {
      return {
        locations: data.map((location) => location[0]),
        locationMap: data.reduce((obj, location) => {
          return {
            ...obj,
            [location[0]]: location[1],
          };
        }, {}),
      };
    });
  });
};