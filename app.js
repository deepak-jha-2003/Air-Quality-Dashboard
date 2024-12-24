const apiUrl = 'https://api.thingspeak.com/channels/1596152/feeds.json?results=10'; // Fetch last 10 results
let chart;

function fetchData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.feeds || data.feeds.length === 0) {
                console.error('No data available from API');
                return;
            }

            const feeds = data.feeds;

            // Extract values for fields
            const pm25 = feeds.map(feed => parseFloat(feed.field1) || 0);
            const pm10 = feeds.map(feed => parseFloat(feed.field2) || 0);
            const ozone = feeds.map(feed => parseFloat(feed.field3) || 0);
            const humidity = feeds.map(feed => parseFloat(feed.field4) || 0);
            const temperature = feeds.map(feed => parseFloat(feed.field5) || 0);
            const co = feeds.map(feed => parseFloat(feed.field6) || 0);

            // Extract time labels
            const labels = feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());

            // Update the fields with the latest data
            const latestFeed = feeds[feeds.length - 1];
            document.getElementById('field1Value').textContent = latestFeed.field1 || 'N/A';
            document.getElementById('field2Value').textContent = latestFeed.field2 || 'N/A';
            document.getElementById('field3Value').textContent = latestFeed.field3 || 'N/A';
            document.getElementById('field4Value').textContent = latestFeed.field4 || 'N/A';
            document.getElementById('field5Value').textContent = latestFeed.field5 || 'N/A';
            document.getElementById('field6Value').textContent = latestFeed.field6 || 'N/A';

            // Update the graph
            const graphData = {
                labels: labels,
                datasets: [
                    {
                        label: 'PM2.5',
                        data: pm25,
                        borderColor: '#FF5733',
                        backgroundColor: 'rgba(255, 87, 51, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'PM10',
                        data: pm10,
                        borderColor: '#33FF57',
                        backgroundColor: 'rgba(51, 255, 87, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'Ozone',
                        data: ozone,
                        borderColor: '#5733FF',
                        backgroundColor: 'rgba(87, 51, 255, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'Humidity',
                        data: humidity,
                        borderColor: '#F4D03F',
                        backgroundColor: 'rgba(244, 208, 63, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'Temperature',
                        data: temperature,
                        borderColor: '#8E44AD',
                        backgroundColor: 'rgba(142, 68, 173, 0.2)',
                        fill: false,
                    },
                    {
                        label: 'CO',
                        data: co,
                        borderColor: '#1F618D',
                        backgroundColor: 'rgba(31, 97, 141, 0.2)',
                        fill: false,
                    }
                ],
            };

            if (chart) {
                chart.data = graphData;
                chart.update();
            } else {
                createChart(graphData);
            }

            // Update the last refresh time
            const lastRefreshTime = new Date(latestFeed.created_at);
            document.getElementById('lastRefreshTime').textContent = lastRefreshTime.toLocaleString();
        })
        .catch(error => console.error('Error fetching data:', error));
}

function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Values',
                    },
                },
            },
        },
    });
}

// Fetch data initially
fetchData();

// Refresh data every hours (60000 ms)
setInterval(fetchData, 3600000);
