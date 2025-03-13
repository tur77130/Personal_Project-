// Global destinations data
let destinationsData = [];

// Fetch destinations and populate homepage with search functionality
if (document.getElementById('destinations-container')) {
    fetch('destinations.json')
        .then(res => res.json())
        .then(destinations => {
            destinationsData = destinations;
            displayDestinations(destinationsData);
        });

    function displayDestinations(destinations) {
        const container = document.getElementById('destinations-container');
        container.innerHTML = '';

        destinations.forEach(dest => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${dest.image}" alt="${dest.title}">
                <h3>${dest.title}</h3>
                <p>${dest.description}</p>
            `;

            card.onclick = () => {
                localStorage.setItem('selectedDestination', dest.id);
                window.location = 'destination.html';
            };

            container.appendChild(card);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const filteredDestinations = destinationsData.filter(dest =>
            dest.title.toLowerCase().includes(query) ||
            dest.description.toLowerCase().includes(query)
        );

        displayDestinations(filteredDestinations);
    });
}

// Function to display destinations
function displayDestinations(destinations) {
    const container = document.getElementById('destinations-container');
    container.innerHTML = '';

    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${dest.image}" alt="${dest.title}">
            <h3>${dest.title}</h3>
            <p>${dest.description}</p>
        `;

        card.onclick = () => {
            localStorage.setItem('selectedDestination', dest.id);
            window.location = 'destination.html';
        };

        container.appendChild(card);
    });
}

// Fetch destination details and populate destination.html
if (document.getElementById('destination-image')) {
    fetch('destinations.json')
        .then(res => res.json())
        .then(destinations => {
            const destId = parseInt(localStorage.getItem('selectedDestination'));
            const destination = destinations.find(dest => dest.id === destId);

            if (destination) {
                document.getElementById('destination-image').src = destination.image;
                document.getElementById('destination-title').textContent = destination.title;
                document.getElementById('destination-description').textContent = destination.description;

                const itineraryList = document.getElementById('destination-itinerary');
                itineraryList.innerHTML = '';
                destination.itinerary.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    itineraryList.appendChild(li);
                });

                const coords = destination.location.split(',').map(Number);
                const map = L.map('map').setView(coords, 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                L.marker(coords).addTo(map).bindPopup(destination.title).openPopup();
            } else {
                console.error('Destination not found!');
            }
        });
}

// Booking form functionality
if (document.getElementById('booking-form')) {
    document.getElementById('booking-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const travelers = document.getElementById('travelers').value;
        const travelDate = document.getElementById('travel-date').value;

        if (new Date(travelDate) < new Date()) {
            alert("Travel date can't be in the past!");
            return;
        }

        console.log({ name, email, travelers, travelDate });
        alert('Tour Booked!');

        e.target.reset();
    });
}
