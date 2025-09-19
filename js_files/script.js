document.addEventListener('DOMContentLoaded', () => {
    const destinationGrid = document.querySelector('.destination-grid');
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    const UNSPLASH_ACCESS_KEY = 'KxCGBu5Sx6_Sq6-06HieLnCg71jv4NvwLjTkJm9Ev-I';

    const OPENWEATHER_API_KEY = '';

    async function fetchUnsplashImage(query) {
        if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_API_KEY') {
            console.warn('Unsplash API key not set. Please replace YOUR_UNSPLASH_API_KEY with your actual key.');
            return 'https://via.placeholder.com/400x300?text=Image+Not+Available'; // Placeholder image
        }
        try {
            console.log(`Fetching Unsplash image for query: ${query}`);
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`);
            console.log(`Unsplash API response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Unsplash image: ${response.status}`);
            }
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].urls.regular;
            } else {
                return 'https://via.placeholder.com/400x300?text=No+Image+Found'; // Placeholder if no results
            }
        } catch (error) {
            console.error('Error fetching Unsplash image:', error);
            return 'https://via.placeholder.com/400x300?text=Error+Loading+Image'; // Placeholder on error
        }
    }

    // Placeholder data for destinations
    const destinations = [
        {
            name: 'Paris, France',
            description: 'The city of love, known for its iconic Eiffel Tower and rich history.',
            query: 'Paris city',
            city: 'Paris',
            region: 'Europe',
            activity: ['culture', 'sightseeing'],
            budget: 1500,
            image: 'https://picsum.photos/seed/paris/800/600'
        },
        {
            name: 'Kyoto, Japan',
            description: 'Ancient temples, beautiful gardens, and traditional geisha districts.',
            query: 'Kyoto Japan',
            city: 'Kyoto',
            region: 'Asia',
            activity: ['culture', 'sightseeing', 'nature'],
            budget: 1200,
            image: 'https://picsum.photos/seed/kyoto/800/600'
        },
        {
            name: 'Rio de Janeiro, Brazil',
            description: 'Vibrant carnivals, stunning beaches, and the Christ the Redeemer statue.',
            query: 'Rio de Janeiro',
            city: 'Rio de Janeiro',
            region: 'South America',
            activity: ['beach', 'adventure', 'culture'],
            budget: 1000,
            image: 'https://picsum.photos/seed/rio/800/600'
        },
        {
            name: 'Sydney, Australia',
            description: 'Iconic Opera House, Harbour Bridge, and beautiful coastal walks.',
            query: 'Sydney Australia',
            city: 'Sydney',
            region: 'Oceania',
            activity: ['sightseeing', 'beach', 'adventure'],
            budget: 1800,
            image: 'https://picsum.photos/seed/sydney/800/600'
        },
        {
            name: 'Cairo, Egypt',
            description: 'Home to the ancient pyramids of Giza and the Sphinx.',
            query: 'Cairo Egypt',
            city: 'Cairo',
            region: 'Africa',
            activity: ['culture', 'history'],
            budget: 900,
            image: 'https://picsum.photos/seed/cairo/800/600'
        },
        {
            name: 'New York, USA',
            description: 'The city that never sleeps, famous for its skyscrapers and diverse culture.',
            query: 'New York city',
            city: 'New York',
            region: 'North America',
            activity: ['culture', 'sightseeing', 'urban'],
            budget: 2000,
            image: 'https://picsum.photos/seed/newyork/800/600'
        }
    ];

    // Function to create a destination card
    async function createDestinationCard(destination) {
        const card = document.createElement('div');
        card.classList.add('destination-card');
        const imageUrl = await fetchUnsplashImage(destination.name);

        card.innerHTML = `
            <img src="" data-src="${imageUrl}" alt="${destination.name}" loading="lazy" crossorigin="anonymous">
            <div class="destination-card-content">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
                <button>Explore</button>
            </div>
        `;
        return card;
    }

    // Function to render destinations
    async function renderDestinations(filteredDestinations = destinations) {
        destinationGrid.innerHTML = ''; // Clear existing cards

        for (const dest of filteredDestinations) {
            const card = await createDestinationCard(dest);
            destinationGrid.appendChild(card);
        }
    }

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        const filteredBySearch = destinations.filter(dest =>
            dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderDestinations(filteredBySearch);
    });

    // Event listener for search input (on enter key)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value;
            const filteredBySearch = destinations.filter(dest =>
                dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderDestinations(filteredBySearch);
        }
    });

    // Function to filter destinations based on criteria
    function filterDestinations() {
        const searchTerm = searchInput.value;
        const regionFilter = document.getElementById('region-filter').value;
        const activityFilter = document.getElementById('activity-filter').value;
        const budgetFilter = document.getElementById('budget-filter').value;

        const filteredDestinations = destinations.filter(destination => {
            const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  destination.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRegion = regionFilter === 'all' || destination.region === regionFilter;
            const matchesActivity = activityFilter === 'all' || destination.activity.includes(activityFilter);
            const matchesBudget = budgetFilter === 'all' || checkBudget(destination.budget, budgetFilter);
            return matchesSearch && matchesRegion && matchesActivity && matchesBudget;
        });

        renderDestinations(filteredDestinations);
    }

    // Helper function to check budget
    function checkBudget(destinationBudget, selectedBudget) {
        switch (selectedBudget) {
            case 'low':
                return destinationBudget < 500;
            case 'medium':
                return destinationBudget >= 500 && destinationBudget < 2000;
            case 'high':
                return destinationBudget >= 2000;
            default:
                return true;
        }
    }

    // Event Listeners for filters
    document.getElementById('region-filter').addEventListener('change', filterDestinations);
    document.getElementById('activity-filter').addEventListener('change', filterDestinations);
    document.getElementById('budget-filter').addEventListener('change', filterDestinations);

    // Event listener for search button
    searchButton.addEventListener('click', filterDestinations);

    // Event listener for search input (on enter key)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterDestinations();
        }
    });

    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (name === '' || email === '' || message === '') {
                alert('Please fill in all fields.');
                return;
            }

            // Simple email validation regex
            const emailRegex = /^[\S@]+@[\S@]+\.[\S@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // In a real application, you would send this data to a server
            console.log('Form submitted:', { name, email, message });
            alert('Thank you for your message! We will get back to you soon.');

            // Clear the form
            contactForm.reset();
        });
    }

    // Lazy loading for images
    const lazyLoadImages = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            observer.observe(img);
        });
    };

    // Call lazy load function after initial render of destinations
    renderDestinations(destinations).then(() => {
        lazyLoadImages();
    });
});