document.addEventListener('DOMContentLoaded', () => {
    const OPENWEATHER_API_KEY = 'dd12bd2f26a1bb30627cea3150e13250'; // Replace with your OpenWeatherMap API key
const UNSPLASH_API_KEY = 'KxCGBu5Sx6_Sq6-06HieLnCg71jv4NvwLjTkJm9Ev-I'; // Replace with your Unsplash API key

// Function to fetch image from Unsplash
async function fetchUnsplashImage(query, fallbackQuery = null) {
    if (!UNSPLASH_API_KEY || UNSPLASH_API_KEY === 'YOUR_UNSPLASH_API_KEY') {
        console.warn('Unsplash API key not set. Please replace YOUR_UNSPLASH_API_KEY with your actual key.');
        return 'https://via.placeholder.com/400x300?text=Image+Not+Available'; // Placeholder image
    }
    try {
        let finalQuery = query;
        let response = await fetch(`https://api.unsplash.com/search/photos?query=${finalQuery}&client_id=${UNSPLASH_API_KEY}&per_page=1`);
        let data = await response.json();

        if (!response.ok || data.results.length === 0) {
            if (fallbackQuery) {
                console.warn(`No results for "${query}". Trying fallback query: "${fallbackQuery}"`);
                finalQuery = fallbackQuery;
                response = await fetch(`https://api.unsplash.com/search/photos?query=${finalQuery}&client_id=${UNSPLASH_API_KEY}&per_page=1`);
                data = await response.json();
            }
        }

        console.log('Unsplash API response data:', data);
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

    const regions = [
        { name: 'Asia', query: 'Asia travel' },
        { name: 'Europe', query: 'Europe travel' },
        { name: 'Americas', query: 'Americas travel' },
        { name: 'Africa', query: 'Africa travel' },
        { name: 'Oceania', query: 'Oceania travel' }
    ];

    const destinationData = [
        {
            name: 'Bagan, Myanmar',
            description: 'Ancient city with thousands of temples and pagodas.',
            query: 'Bagan Myanmar temples',
            city: 'Bagan',
            region: 'Asia',
            latitude: 21.1716,
            longitude: 94.8718
        },
        {
            name: 'Transylvania, Romania',
            description: 'Mysterious region with medieval castles and folklore.',
            query: 'Transylvania Romania castles',
            city: 'Brașov',
            region: 'Europe',
            latitude: 45.6579,
            longitude: 25.6012
        },
        {
            name: 'Salar de Uyuni, Bolivia',
            description: 'The world\'s largest salt flat, creating a stunning mirror effect.',
            query: 'Salar de Uyuni Bolivia salt flat',
            city: 'Uyuni',
            region: 'Americas',
            latitude: -20.2111,
            longitude: -67.6250
        },
        {
            name: 'Chefchaouen, Morocco',
            description: 'The \'Blue Pearl\' of Morocco, a charming town nestled in the Rif Mountains.',
            query: 'Chefchaouen Morocco blue city',
            city: 'Chefchaouen',
            region: 'Africa',
            latitude: 35.1732,
            longitude: -5.2668
        },
        {
            name: 'Faroe Islands, Denmark',
            description: 'Rugged, volcanic archipelago with dramatic landscapes and abundant wildlife.',
            query: 'Faroe Islands',
            city: 'Tórshavn',
            region: 'Europe',
            latitude: 62.0100,
            longitude: -6.7700
        },
        {
            name: 'Patagonia, Argentina/Chile',
            description: 'Vast region of grasslands, deserts, and the Andes mountains.',
            query: 'Patagonia landscapes',
            city: 'El Calafate',
            region: 'Americas',
            latitude: -50.3400,
            longitude: -72.2700
        },
        {
            name: 'Bhutan',
            description: 'A Buddhist kingdom on the Himalayas\' eastern edge, known for its monasteries, fortresses (dzongs) and dramatic landscapes.',
            query: 'Bhutan monasteries',
            city: 'Thimphu',
            region: 'Asia',
            latitude: 27.4712,
            longitude: 89.6419
        },
        {
            name: 'Namibia',
            description: 'A land of vast open spaces, deserts, and diverse wildlife.',
            query: 'Namibia desert wildlife',
            city: 'Windhoek',
            region: 'Africa',
            latitude: -22.5594,
            longitude: 17.0832
        },
        {
            name: 'Tasmania, Australia',
            description: 'Island state known for its rugged wilderness, national parks, and unique wildlife.',
            query: 'Tasmania wilderness',
            city: 'Hobart',
            region: 'Oceania',
            latitude: -42.8821,
            longitude: 147.3272
        },
        {
            name: 'Slovenia',
            description: 'Small, mountainous country with stunning lakes, caves, and a charming capital.',
            query: 'Slovenia lakes caves',
            city: 'Ljubljana',
            region: 'Europe',
            latitude: 46.0569,
            longitude: 14.5058
        }
    ];

    const regionFiltersContainer = document.querySelector('.region-filters');
    const destinationGrid = document.querySelector('.destination-grid');

    // Function to fetch weather from OpenWeatherMap
    async function fetchWeatherData(latitude, longitude) {
        if (!OPENWEATHER_API_KEY) {
            console.warn('OpenWeatherMap API key is not set. Weather data will not be displayed.');
            return null;
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch weather data: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }

    // Function to create a destination card
    async function createDestinationCard(destination) {
        const card = document.createElement('div');
        card.classList.add('destination-card');
        const imageUrl = await fetchUnsplashImage(destination.name);

        const weatherData = destination.latitude && destination.longitude ? await fetchWeatherData(destination.latitude, destination.longitude) : null;

        let weatherInfoHtml = '';
        if (weatherData) {
            weatherInfoHtml = `
                <div class="weather-info">
                    ${Math.round(weatherData.main.temp)}°C, ${weatherData.weather[0].description}
                </div>
            `;
        }

        card.innerHTML = `
            <img src="" data-src="${imageUrl}" alt="${destination.name}" loading="lazy">
            <div class="destination-card-content">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
                ${weatherInfoHtml}
                <button>Explore</button>
            </div>
        `;
        return card;
    }

    // Function to render destinations
    async function renderDestinations(filteredDestinations) {
        destinationGrid.innerHTML = '';
        for (const dest of filteredDestinations) {
            const card = await createDestinationCard(dest);
            destinationGrid.appendChild(card);
        }
    }

    // Function to render region filters
    function renderRegionFilters() {
        regionFiltersContainer.innerHTML = '';
        regions.forEach(region => {
            const regionCard = document.createElement('div');
            regionCard.classList.add('region-filter-card');
            regionCard.textContent = region.name;
            regionCard.dataset.region = region.name;
            regionCard.addEventListener('click', () => filterByRegion(region.name));
            regionFiltersContainer.appendChild(regionCard);
        });
    }

    // Travel Tips Data
    const travelTipsData = [
        {
            title: 'Mastering Sustainable Travel',
            description: 'Learn how to minimize your environmental impact and support local communities while exploring the world.',
            image: 'sustainable-travel.jpg',
            link: '#'
        },
        {
            title: 'Navigating Local Cuisine Like a Pro',
            description: 'A guide to discovering authentic flavors and dining experiences, from street food to hidden gems.',
            image: 'local-cuisine.jpg',
            link: '#'
        },
        {
            title: 'The Art of Solo Travel: Empowerment and Safety',
            description: 'Tips for women and men embarking on solo adventures, focusing on safety, confidence, and making the most of your journey.',
            image: 'solo-travel.jpg',
            link: '#'
        },
        {
            title: 'Unlocking Cultural Immersion: Beyond the Tourist Traps',
            description: 'Strategies for deeper engagement with local cultures, traditions, and everyday life.',
            image: 'cultural-immersion.jpg',
            link: '#'
        }
    ];

    const tipsGridContainer = document.querySelector('.tips-grid');

    async function createTipCard(tip) {
        const card = document.createElement('div');
        card.classList.add('tip-card');
        const imageUrl = await fetchUnsplashImage(tip.title, tip.image);
        console.log('imageUrl in createTipCard:', imageUrl);
        card.innerHTML = `
            <img src="${imageUrl}" alt="${tip.title}">
            <div class="tip-card-content">
                <h3>${tip.title}</h3>
                <p>${tip.description}</p>
                <button>Explore</button>
            </div>
        `;
        return card;
    }

    async function renderTravelTips() {
        if (tipsGridContainer) {
            tipsGridContainer.innerHTML = '';
            for (const tip of travelTipsData) {
                const card = await createTipCard(tip);
                tipsGridContainer.appendChild(card);
            }
        }
    }

    // Seasonal Picks Data
    const seasonalPicksData = [
        {
            season: 'Spring',
            title: 'Cherry Blossom Magic in Kyoto',
            description: 'Experience the ethereal beauty of cherry blossoms in Japan\'s ancient capital.',
            image: 'kyoto-spring.jpg',
            query: 'Kyoto cherry blossoms',
            city: 'Kyoto',
            latitude: 35.0116,
            longitude: 135.7681
        },
        {
            season: 'Summer',
            title: 'Midnight Sun in Lofoten, Norway',
            description: 'Hike under the endless daylight in the stunning Norwegian fjords.',
            image: 'lofoten-summer.jpg',
            query: 'Lofoten Norway midnight sun',
            city: 'Lofoten',
            latitude: 68.1335,
            longitude: 13.5150
        },
        {
            season: 'Autumn',
            title: 'Fall Foliage in Bavaria, Germany',
            description: 'Explore fairytale castles amidst the vibrant autumn colors of the Bavarian Alps.',
            image: 'https://picsum.photos/seed/bavaria/800/600',
            query: 'Bavaria Germany autumn',
            city: 'Munich',
            latitude: 48.1351,
            longitude: 11.5820
        },
        {
            season: 'Winter',
            title: 'Northern Lights in Lapland, Finland',
            description: 'Witness the spectacular Aurora Borealis from a cozy glass igloo.',
            image: 'https://picsum.photos/seed/lapland/800/600',
            query: 'Lapland Finland northern lights',
            city: 'Rovaniemi',
            latitude: 66.5039,
            longitude: 25.7293
        }
    ];

    const seasonalPicksContainer = document.querySelector('.seasonal-picks-grid');

    async function createSeasonalCard(pick) {
        const card = document.createElement('div');
        card.classList.add('seasonal-card');
        const imageUrl = await fetchUnsplashImage(pick.query, pick.image);

        const weatherData = pick.latitude && pick.longitude ? await fetchWeatherData(pick.latitude, pick.longitude) : null;

        let weatherInfoHtml = '';
        if (weatherData) {
            weatherInfoHtml = `
                <div class="weather-info">
                    ${Math.round(weatherData.main.temp)}°C, ${weatherData.weather[0].description}
                </div>
            `;
        }

        card.innerHTML = `
            <img src="" data-src="${imageUrl}" alt="${pick.title}" loading="lazy">
            <div class="seasonal-card-content">
                <h3>${pick.title}</h3>
                <p>${pick.description}</p>
                ${weatherInfoHtml}
                <button>Explore</button>
            </div>
        `;
        return card;
    }

    async function renderSeasonalPicks() {
        if (seasonalPicksContainer) {
            seasonalPicksContainer.innerHTML = '';
            for (const pick of seasonalPicksData) {
                const card = await createSeasonalCard(pick);
                console.log('Card created for seasonal pick:', card);
                seasonalPicksContainer.appendChild(card);
            }
            lazyLoadImages();
        }
    }

    // Experience Categories Data
    const experienceCategoriesData = [
        {
            name: 'Adventure',
            description: 'Rough, rugged, and remote.',
            image: 'https://picsum.photos/seed/adventure/800/600',
            link: '#'
        },
        {
            name: 'Culture',
            description: 'Deep, historical, and cultural.',
            image: 'https://picsum.photos/seed/culture/800/600',
            link: '#'
        },
        {
            name: 'Nature',
            description: 'Calm, serene, and tranquil.',
            image: 'https://picsum.photos/seed/nature/800/600',
            link: '#'
        },
        {
            name: 'Food',
            description: 'Tasty, fresh, and local.',
            image: 'https://picsum.photos/seed/food/800/600',
            link: '#'
        },
        {
            name: 'Safety',
            description: 'Safe, secure, and reliable.',
            image: 'https://picsum.photos/seed/safety/800/600',
            link: '#'
        }
    ];

    const experienceCategoriesContainer = document.querySelector('.experience-categories-grid');

    async function createExperienceCard(category) {
        const card = document.createElement('div');
        card.classList.add('experience-card');
        const imageUrl = await fetchUnsplashImage(category.name);

        card.innerHTML = `
            <img src="" data-src="${imageUrl}" alt="${category.name}" loading="lazy">
            <div class="experience-card-content">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <button>Explore</button>
            </div>
        `;
        return card;
    }

    async function renderExperienceCategories() {
        if (experienceCategoriesContainer) {
            experienceCategoriesContainer.innerHTML = '';
            for (const category of experienceCategoriesData) {
                const card = createExperienceCard(category);
                experienceCategoriesContainer.appendChild(card);
            }
            lazyLoadImages();
        }
    }

    // Local Insights Data
    const localInsightsData = [
        {
            title: 'Hidden Gems of Kyoto',
            description: 'Discover serene temples and traditional tea houses away from the crowds.',
            image: 'https://picsum.photos/seed/kyoto-hidden/800/600',
            link: '#'
        },
        {
            title: 'Street Art and Culture in Berlin',
            description: 'Explore the vibrant street art scene and alternative cultural spaces.',
            image: 'https://picsum.photos/seed/berlin-street-art/800/600',
            link: '#'
        },
        {
            title: 'Culinary Journey Through Bologna',
            description: 'Savor authentic Italian flavors with a guide to the best local eateries and markets.',
            image: 'https://picsum.photos/seed/bologna-food/800/600',
            link: '#'
        },
        {
            title: 'Wildlife Encounters in Costa Rica',
            description: 'Experience the rich biodiversity with expert tips on spotting sloths, monkeys, and exotic birds.',
            image: 'https://picsum.photos/seed/costa-rica-wildlife/800/600',
            link: '#'
        }
    ];

    const localInsightsContainer = document.querySelector('.local-insights-grid');

    async function createLocalInsightCard(insight) {
        const card = document.createElement('div');
        card.classList.add('local-insight-card');
        const imageUrl = await fetchUnsplashImage(insight.title);
        card.innerHTML = `
            <img src="" data-src="${imageUrl}" alt="${insight.title}" loading="lazy">
            <div class="local-insight-card-content">
                <h3>${insight.title}</h3>
                <p>${insight.description}</p>
                <button>Learn More</button>
            </div>
        `;
        return card;
    }

    function renderLocalInsights() {
        if (localInsightsContainer) {
            localInsightsContainer.innerHTML = '';
            localInsightsData.forEach(insight => {
                const card = createLocalInsightCard(insight);
                localInsightsContainer.appendChild(card);
            });
            lazyLoadImages();
        }
    }

    // Timeline Data (Best Time to Visit)
    const timelineData = [
        {
            year: 2023,
            events: [
                {
                    month: 'January',
                    title: 'Winter Wonderland in Lapland',
                    description: 'Experience the magic of the Arctic with Northern Lights and husky safaris.',
                    image: 'https://picsum.photos/seed/lapland-winter/800/600'
                },
                {
                    month: 'March',
                    title: 'Cherry Blossom Festival in Tokyo',
                    description: 'Witness the iconic cherry blossoms and vibrant spring festivities.',
                    image: 'https://picsum.photos/seed/tokyo-cherry/800/600'
                }
            ]
        },
        {
            year: 2024,
            events: [
                {
                    month: 'June',
                    title: 'Summer Solstice in Stonehenge',
                    description: 'Join the ancient celebrations at this historic monument.',
                    image: 'https://picsum.photos/seed/stonehenge-summer/800/600'
                },
                {
                    month: 'October',
                    title: 'Oktoberfest in Munich',
                    description: 'Enjoy the world\'s largest beer festival with traditional Bavarian music and food.',
                    image: 'https://picsum.photos/seed/oktoberfest-munich/800/600'
                }
            ]
        }
    ];

    const timelineContainer = document.querySelector('.timeline-container');

    function createTimelineEvent(event) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('timeline-item');
        eventDiv.innerHTML = `
            <h3>${event.year}</h3>
            <h4>${event.month}: ${event.title}</h4>
            <p>${event.description}</p>
            <img src="${event.image}" alt="${event.title}">
        `;
        return eventDiv;
    }

    function renderTimeline() {
        if (timelineContainer) {
            timelineContainer.innerHTML = '';
            timelineData.forEach(yearData => {
                yearData.events.forEach(event => {
                    const eventWithYear = { ...event, year: yearData.year };
                    const eventElement = createTimelineEvent(eventWithYear);
                    timelineContainer.appendChild(eventElement);
                });
            });
        }
    }

    // Quiz Data
    const quizData = [
        {
            question: 'Which destination is known for its ancient temples and pagodas?',
            options: ['Bagan, Myanmar', 'Transylvania, Romania', 'Salar de Uyuni, Bolivia', 'Chefchaouen, Morocco'],
            answer: 'Bagan, Myanmar'
        },
        {
            question: 'Where can you find the world\'s largest salt flat?',
            options: ['Faroe Islands, Denmark', 'Patagonia, Argentina/Chile', 'Salar de Uyuni, Bolivia', 'Bhutan'],
            answer: 'Salar de Uyuni, Bolivia'
        },
        {
            question: 'Which city is famous for its blue-painted buildings?',
            options: ['Tasmania, Australia', 'Slovenia', 'Chefchaouen, Morocco', 'Namibia'],
            answer: 'Chefchaouen, Morocco'
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const quizContainer = document.getElementById('quiz-container');
    console.log('quizContainer:', quizContainer);
    const quizQuestion = document.querySelector('.quiz-question');
    console.log('quizQuestion:', quizQuestion);
    const quizOptions = document.querySelector('.quiz-options');
    console.log('quizOptions:', quizOptions);
    const quizResult = document.querySelector('.quiz-result');
    console.log('quizResult:', quizResult);
    const quizRecommendations = document.querySelector('.quiz-recommendations');
    console.log('quizRecommendations:', quizRecommendations);
    const quizRestartButton = document.querySelector('.quiz-restart-button');
    console.log('quizRestartButton:', quizRestartButton);
    const startQuizButton = document.getElementById('start-quiz-btn');

    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => {
            console.log('Start Quiz button clicked!');
            if (quizContainer) {
                quizContainer.style.display = 'block';
                renderQuiz();
            }
        });
    }

    function renderQuiz() {
        if (quizContainer) {
            quizContainer.style.display = 'block';
            quizResult.style.display = 'none';
            quizRecommendations.innerHTML = '';
            currentQuestionIndex = 0;
            score = 0;
            displayQuestion();
        }
    }

    function displayQuestion() {
        const question = quizData[currentQuestionIndex];
        quizQuestion.textContent = question.question;
        quizOptions.innerHTML = '';
        question.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.textContent = option;
            optionDiv.classList.add('quiz-option');
            optionDiv.addEventListener('click', () => {
                // Remove 'selected' class from all options
                Array.from(quizOptions.children).forEach(opt => opt.classList.remove('selected'));
                // Add 'selected' class to the clicked option
                optionDiv.classList.add('selected');
                checkAnswer(option);
            });
            quizOptions.appendChild(optionDiv);
        });
    }

    function checkAnswer(selectedOption) {
        const question = quizData[currentQuestionIndex];
        if (selectedOption === question.answer) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            displayQuestion();
        } else {
            displayQuizResult();
        }
    }

    function displayQuizResult() {
        quizQuestion.textContent = '';
        quizOptions.innerHTML = '';
        quizResult.style.display = 'block';
        quizResult.textContent = `You scored ${score} out of ${quizData.length}!`;
        generateRecommendations();
    }

    function generateRecommendations() {
        quizRecommendations.innerHTML = '<h3>Recommended Destinations:</h3>';
        const recommendations = [];

        if (score === quizData.length) {
            recommendations.push(...destinationData);
        } else if (score >= quizData.length / 2) {
            recommendations.push(...destinationData.filter(dest => dest.region === 'Asia' || dest.region === 'Americas'));
        } else {
            recommendations.push(...destinationData.filter(dest => dest.region === 'Europe' || dest.region === 'Africa'));
        }

        recommendations.forEach(rec => {
            const p = document.createElement('p');
            p.textContent = rec.name;
            quizRecommendations.appendChild(p);
        });
    }

    if (quizRestartButton) {
        quizRestartButton.addEventListener('click', renderQuiz);
    }

    // Top Picks Carousel Data
    const topPicksData = [
        {
            name: 'Machu Picchu, Peru',
            description: 'Ancient Inca city high in the Andes Mountains.',
            image: 'https://picsum.photos/seed/machu-picchu/800/600',
            query: 'Machu Picchu Peru',
            city: 'Machu Picchu',
            latitude: -13.1631,
            longitude: -72.5450
        },
        {
            name: 'Great Barrier Reef, Australia',
            description: 'World\'s largest coral reef system, teeming with marine life.',
            image: 'https://picsum.photos/seed/great-barrier-reef/800/600',
            query: 'Great Barrier Reef Australia',
            city: 'Cairns',
            latitude: -16.9255,
            longitude: 145.7775
        },
        {
            name: 'Petra, Jordan',
            description: 'Rose-red city carved into sandstone cliffs.',
            image: 'https://picsum.photos/seed/petra-jordan/800/600',
            query: 'Petra Jordan',
            city: 'Petra',
            latitude: 30.3285,
            longitude: 35.4444
        },
        {
            name: 'Pyramids of Giza, Egypt',
            description: 'Ancient wonders, iconic symbols of Egyptian civilization.',
            image: 'https://picsum.photos/seed/pyramids-giza/800/600',
            query: 'Pyramids of Giza Egypt',
            city: 'Giza',
            latitude: 29.9792,
            longitude: 31.1342
        }
    ];

    const topPicksCarousel = document.querySelector('.top-picks-carousel');
    let currentIndex = 0;

    async function createTopPickCard(pick) {
        const card = document.createElement('div');
        card.classList.add('top-pick-card');
        const imageUrl = await fetchUnsplashImage(pick.query, pick.name);


        const weatherData = pick.latitude && pick.longitude ? await fetchWeatherData(pick.latitude, pick.longitude) : null;

        let weatherInfoHtml = '';
        if (weatherData) {
            weatherInfoHtml = `
                <div class="weather-info">
                    ${Math.round(weatherData.main.temp)}°C, ${weatherData.weather[0].description}
                </div>
            `;
        }

        card.innerHTML = `
            <img src="" data-src="${imageUrl}" alt="${pick.name}" loading="lazy">
            <div class="top-pick-card-content">
                <h3>${pick.name}</h3>
                <p>${pick.description}</p>
                ${weatherInfoHtml}
                <button>Discover</button>
            </div>
        `;
        return card;
    }

    async function renderTopPicks() {
        if (topPicksCarousel) {
            topPicksCarousel.innerHTML = '';
            for (const pick of topPicksData) {
                const card = await createTopPickCard(pick);
                topPicksCarousel.appendChild(card);
            }
            lazyLoadImages();
        }
    }

    function showSlide(index) {
        const slides = document.querySelectorAll('.top-pick-card');
        if (slides.length === 0) return;

        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        }

        slides.forEach((slide, i) => {
            slide.style.display = (i === currentIndex) ? 'block' : 'none';
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    // Initial render
    renderDestinations(destinationData);
    renderRegionFilters();
    renderTravelTips();
    renderSeasonalPicks();
    renderExperienceCategories();
    renderLocalInsights();
    renderTimeline();
    renderQuiz();
    renderTopPicks();
    showSlide(currentIndex);
});