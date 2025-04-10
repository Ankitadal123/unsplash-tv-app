import { useEffect, useRef, useState } from 'react';
import './app.css';
import PhotoModal from './PhotoModal';

// Import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const ACCESS_KEY = 'ZWzRZF6Ewy5AhXTa9LKLcUpf05ufHpZIdjwGBDMaTnU';


export default function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null); // Start as null
  const [photos, setPhotos] = useState([]);


  // Effect to fetch topics
  useEffect(() => {
    fetch('https://api.unsplash.com/topics?per_page=10', {
      headers: {
        // Corrected Authorization header syntax
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTopics(data);
        // --- Modification Start ---
        // Check if data is an array and has items
        if (Array.isArray(data) && data.length > 0) {
          // Set the first topic as selected *after* topics are set
          setSelectedTopic(data[0].slug);
        }
        // --- Modification End ---
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        // Handle error appropriately, e.g., set an error state
      });
  }, []); // Empty dependency array: runs only once on mount

  // Effect to fetch photos when selectedTopic changes
  useEffect(() => {
    // Only fetch if selectedTopic has a value (is not null)
    if (!selectedTopic) return;

    // Clear previous photos when topic changes (optional, good practice)
    setPhotos([]);

    fetch(`https://api.unsplash.com/topics/${selectedTopic}/photos?per_page=30`, { // Corrected URL syntax
      headers: {
        // Corrected Authorization header syntax
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    })
      .then((res) => {
         if (!res.ok) {
           // Check for specific rate limiting errors etc.
           if (res.status === 403) {
             console.error("Access Forbidden (Check API Key or Permissions)");
           } else {
              console.error(`HTTP error! status: ${res.status}`);
           }
           throw new Error(`HTTP error! status: ${res.status}`);
         }
        return res.json();
        })
      .then((data) => setPhotos(data))
      .catch((error) => {
        console.error(`Error fetching photos for topic "${selectedTopic}":`, error);
        // Handle error appropriately
      });
  }, [selectedTopic]); // Dependency array: runs when selectedTopic changes

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [modalPhoto, setModalPhoto] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && photos.length > 0) {
        setModalPhoto(photos[selectedPhotoIndex]);
      }
      if (e.key === 'Escape') {
        setModalPhoto(null);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos, selectedPhotoIndex]);
  
  
  return (
    <div className="bg-black text-white h-screen w-screen p-4 flex flex-col overflow-hidden"> {/* Use flex-col */}
      <h1 className="text-3xl font-bold mb-4 flex-shrink-0">📺 Unsplash Smart TV App</h1>

      {/* Topics Menu */}
      <div className="flex gap-3 overflow-x-auto mb-6 pb-2 flex-shrink-0">
        {/* Added check for topics length before mapping */}
        {topics.length > 0 ? topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic.slug)}
            // Ensure focus styles are good for TV navigation if needed
            className={`px-4 py-2 text-sm rounded-full whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 ${
              selectedTopic === topic.slug
                ? 'bg-white text-black font-semibold' // Make selected stand out
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {topic.title}
          </button>
        )) : (
          <p className="text-gray-400">Loading topics...</p> // Show loading state
        )}
      </div>

      {/* Photos Grid - Using Swiper */}
      {/* Added flex-grow to allow Swiper to fill remaining space */}
      <div className="relative flex-grow min-h-0"> {/* Ensure Swiper has space */}
        {/* Removed custom scroll buttons */}
        {
         }
         {/* Conditionally render Swiper only when photos are loaded or topic selected */}
         {selectedTopic && (
            <Swiper
                // Make Swiper fill the container
                style={{ width: '100%', height: '100%' }}
                onSlideChange={(swiper) => setSelectedPhotoIndex(swiper.activeIndex)} 
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={20} // Adjust spacing as needed
                slidesPerView={3} // Adjust based on desired look
                navigation // Enable Swiper's built-in navigation arrows
                pagination={{ clickable: true }}
                // scrollbar={{ draggable: true }} // Optional: adds a scrollbar
                // Consider breakpoints for different screen sizes if needed
                breakpoints={{
                    // Example: More slides on larger screens
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                     },
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    }
                }}
            >
                {/* Added check for photos length */}
                {photos.length > 0 ? photos.map((photo) => (
                <SwiperSlide key={photo.id}>
                    {/* Adjusted styling for the slide content */}
                    <div onClick={() => setModalPhoto(photo)} className="w-full h-full overflow-hidden rounded-lg shadow-lg bg-gray-800 cursor-pointer hover:opacity-90 transition"> {/* Added bg color for loading */}
                    <img
                        src={photo.urls.regular} // Use 'regular' or 'small' based on need
                        alt={photo.alt_description || 'Unsplash image'}
                        className="w-full h-full object-cover"
                        loading="lazy" // Add lazy loading for performance
                    />
                    </div>
                </SwiperSlide>
                )) : (
                    // Optional: Show a loading indicator inside Swiper if photos are loading
                    <SwiperSlide>
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Loading photos...
                        </div>
                    </SwiperSlide>
                 )}
             </Swiper>
         )}
         {/* Show message if no topic is selected yet (e.g., during initial load) */}
         {!selectedTopic && (
             <div className="w-full h-full flex items-center justify-center text-gray-400">
                 Select a topic to view photos.
             </div>
         )}
      </div>
      {/* Removed custom scroll buttons */}
      {modalPhoto && (
      <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
    )}
    </div>
  );
}