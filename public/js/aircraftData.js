fetch('/data/boeing_aircraft_models.json')
  .then(response => response.json())
  .then(data => {
    const select = document.getElementById('aircraftSelect');

    data.forEach(aircraft => {
      const option = document.createElement('option');
      option.value = aircraft["Model Number"];
      option.textContent = `${aircraft["Model Number"]} - ${aircraft["Model Name"]}`;
      select.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error loading aircraft data:', error);
  });
