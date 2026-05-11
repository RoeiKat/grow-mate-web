const TEL_AVIV = {
  latitude: 32.0853,
  longitude: 34.7818,
  town: "Tel Aviv",
  state: "Israel"
};

function getBrowserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(TEL_AVIV);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          town: "",
          state: ""
        });
      },
      () => resolve(TEL_AVIV),
      { timeout: 6000 }
    );
  });
}

async function reverseLocation(latitude, longitude) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    const data = await res.json();

    return {
      town: data.city || data.locality || data.principalSubdivision || "Tel Aviv",
      state: data.principalSubdivision || data.countryName || "Israel"
    };
  } catch {
    return {
      town: "Tel Aviv",
      state: "Israel"
    };
  }
}

export async function getWeatherForecast() {
  const location = await getBrowserLocation();
  const readable = await reverseLocation(location.latitude, location.longitude);

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Weather service is unavailable right now.");
  }

  const weather = await res.json();

  return {
    weather,
    location: readable
  };
}