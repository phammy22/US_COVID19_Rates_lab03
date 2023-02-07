mapboxgl.accessToken =
    'pk.eyJ1IjoicGhhbW15MjIiLCJhIjoiY2xhZ2JoNmEwMHI2azN1bzFwczlkMTNqdiJ9.T2vpz0gVbuFh7jAZJo67QA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3.5, // starting zoom
    center: [-100, 40] // starting center
});

// load data and add as layer
async function geojsonFetch() {
    let response = await fetch('assets/us-covid-2020-rates.json');
    let state_data = await response.json();

    map.on('load', function loadingData() {
        map.addSource('state_data', {
            type: 'geojson',
            data: state_data
        });

        map.addLayer({
            'id': 'state_data_layer',
            'type': 'fill',
            'source': 'state_data',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#ffffcc',   // stop_output_0
                    20,          // stop_input_0
                    '#ffeda0',   // stop_output_1
                    50,          // stop_input_1
                    '#fed976',   // stop_output_2
                    60,          // stop_input_2
                    '#feb24c',   // stop_output_3
                    70,         // stop_input_3
                    '#fd8d3c',   // stop_output_4
                    80,         // stop_input_4
                    '#fc4e2a',   // stop_output_5
                    90,         // stop_input_5
                    '#e31a1c',   // stop_output_6
                    100,        // stop_input_6
                    '#bd0026',    // stop_output_7
                    120,
                    '#800026'   //stop_output_8
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

        const layers = [
            '0-19',
            '20-49',
            '50-59',
            '60-69',
            '70-79',
            '80-89',
            '90-99',
            '100-119',
            '120 and more'
        ];
        const colors = [
            '#ffffcc',
            '#ffeda0',
            '#fed976',
            '#feb24c',
            '#fd8d3c',
            '#fc4e2a',
            '#e31a1c',
            '#bd0026',
            '#800026'
        ];

        // create legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Cases/1k residents</b><br><br>";


        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
    });

    map.on('mousemove', ({point}) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['state_data_layer']
        });
        document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.county} County, ${state[0].properties.state}</h3><p><strong><em>${state[0].properties.rates}</strong> cases per 1,000 residents</em></p>` :
        `<p>Hover over a county to see their rate of cases per 1000 residents!</p>
        <p style="text-align: left; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a></p>`;
});
}

geojsonFetch();