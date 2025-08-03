import React, { useState, useEffect } from 'react';
import { 
  FaShoppingBag, 
  FaHome, 
  FaStore, 
  FaFilter, 
  FaSearch, 
  FaHeart, 
  FaEye, 
  FaMapMarkerAlt, 
  FaClock, 
  FaDollarSign,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaBookOpen,
  FaLaptop,
  FaGamepad,
  FaTshirt,
  FaUtensils,
  FaCar,
  FaCouch,
  FaPlus,
  FaImage,
  FaTag,
  FaBuilding,
  FaBed,
  FaBath,
  FaWifi,
  FaParking,
  FaPaw,
  FaLeaf,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
  FaUpload,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaShare,
  FaFlag
} from 'react-icons/fa';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('product');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Form states for creating listings
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'books',
    quantity: 1,
    is_second_hand: false,
    condition: 'new',
    location: '',
    rental_rate: '',
    rental_type: 'daily',
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    utilities_included: false,
    pet_friendly: false,
    amenities: [],
    available_from: '',
    business_category: 'food',
    services: [],
    operating_hours: '',
    phone: '',
    email: '',
    website: ''
  });

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch products
      const productsRes = await fetch('http://localhost:5000/api/marketplace/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch rentals
      const rentalsRes = await fetch('http://localhost:5000/api/marketplace/rentals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch businesses
      const businessesRes = await fetch('http://localhost:5000/api/marketplace/businesses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      } else {
        // Mock data for products
        setProducts([
          {
            id: 1,
            name: "Statistics Textbook - 12th Edition",
            description: "Excellent condition, barely used. Perfect for STAT 101 and 201 courses. All chapters included with answer key.",
            price: 35.00,
            category: "books",
            quantity: 1,
            is_second_hand: true,
            seller: { 
              name: "John Doe", 
              email: "john@uiu.ac.bd",
              phone: "+8801712345678",
              rating: 4.8,
              total_sales: 23
            },
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
            views: 24,
            likes: 5,
            location: "UIU Campus",
            created_at: "2025-01-28T10:30:00Z",
            condition: "Like New",
            verified: true
          },
          {
            id: 2,
            name: "MacBook Pro 13\" 2021",
            description: "M1 chip, 8GB RAM, 256GB SSD. Perfect for programming and design work. Comes with original charger and box.",
            price: 850.00,
            category: "electronics",
            quantity: 1,
            is_second_hand: true,
            seller: { 
              name: "Sarah Khan", 
              email: "sarah@uiu.ac.bd",
              phone: "+8801687654321",
              rating: 4.9,
              total_sales: 12
            },
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
            views: 156,
            likes: 23,
            location: "Dhanmondi",
            created_at: "2025-01-27T14:20:00Z",
            condition: "Excellent",
            verified: true
          },
          {
            id: 3,
            name: "Gaming Chair RGB",
            description: "Ergonomic gaming chair with RGB lighting. Very comfortable for long study sessions. Adjustable height and armrests.",
            price: 120.00,
            category: "furniture",
            quantity: 1,
            is_second_hand: false,
            seller: { 
              name: "Tech Store UIU", 
              email: "techstore@uiu.ac.bd",
              phone: "+8801798765432",
              rating: 4.7,
              total_sales: 156
            },
            images: ["/api/placeholder/400/300"],
            views: 89,
            likes: 12,
            location: "UIU Campus Store",
            created_at: "2025-01-26T09:15:00Z",
            condition: "New",
            verified: true
          },
          {
            id: 4,
            name: "Organic Chemistry Textbook",
            description: "Latest edition with all practice problems. Perfect for CHE courses.",
            price: 45.00,
            category: "books",
            quantity: 1,
            is_second_hand: true,
            seller: { 
              name: "Ahmed Hassan", 
              email: "ahmed@uiu.ac.bd",
              phone: "+8801823456789",
              rating: 4.6,
              total_sales: 8
            },
            images: ["/api/placeholder/400/300"],
            views: 67,
            likes: 8,
            location: "Bashundhara",
            created_at: "2025-01-25T16:45:00Z",
            condition: "Good",
            verified: false
          }
        ]);
      }

      if (rentalsRes.ok) {
        const rentalsData = await rentalsRes.json();
        setRentals(rentalsData.rentals || []);
      } else {
        // Mock data for rentals
        setRentals([
          {
            id: 1,
            name: "Single Room Near UIU",
            description: "Fully furnished single room with AC, WiFi, and meal facilities. 5 minutes walk to UIU. Safe and secure environment.",
            rental_rate: 15000.00,
            rental_type: "monthly",
            owner: { 
              name: "Mrs. Rahman", 
              phone: "+8801712345678",
              email: "rahman@gmail.com",
              rating: 4.8,
              properties: 5
            },
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
            amenities: ["WiFi", "AC", "Meals", "Laundry", "Security", "Parking"],
            location: "Madani Avenue",
            available_from: "2025-02-01",
            bedrooms: 1,
            bathrooms: 1,
            furnished: true,
            utilities_included: true,
            pet_friendly: false,
            views: 234,
            likes: 18,
            verified: true,
            floor: "3rd Floor",
            size: "120 sq ft"
          },
          {
            id: 2,
            name: "Apartment for Sharing",
            description: "3-bedroom apartment looking for 2 roommates. Great location and friendly environment. Common kitchen and living room.",
            rental_rate: 8000.00,
            rental_type: "monthly",
            owner: { 
              name: "Ahmed Hassan", 
              phone: "+8801898765432",
              email: "ahmed.hassan@gmail.com",
              rating: 4.5,
              properties: 3
            },
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
            amenities: ["WiFi", "Kitchen", "Balcony", "Parking", "Generator"],
            location: "Bashundhara R/A",
            available_from: "2025-02-15",
            bedrooms: 3,
            bathrooms: 2,
            furnished: true,
            utilities_included: false,
            pet_friendly: true,
            views: 167,
            likes: 31,
            verified: true,
            floor: "5th Floor",
            size: "1200 sq ft"
          },
          {
            id: 3,
            name: "Studio Apartment",
            description: "Modern studio apartment perfect for single student. Fully equipped kitchen and bathroom.",
            rental_rate: 12000.00,
            rental_type: "monthly",
            owner: { 
              name: "Fatima Khatun", 
              phone: "+8801756789012",
              email: "fatima@outlook.com",
              rating: 4.9,
              properties: 8
            },
            images: ["/api/placeholder/400/300"],
            amenities: ["WiFi", "AC", "Kitchen", "Elevator", "Security"],
            location: "Uttara",
            available_from: "2025-02-10",
            bedrooms: 1,
            bathrooms: 1,
            furnished: true,
            utilities_included: true,
            pet_friendly: false,
            views: 123,
            likes: 15,
            verified: true,
            floor: "7th Floor",
            size: "450 sq ft"
          }
        ]);
      }

      if (businessesRes.ok) {
        const businessesData = await businessesRes.json();
        setBusinesses(businessesData.businesses || []);
      } else {
        // Mock data for businesses
        setBusinesses([
          {
            id: 1,
            name: "Fresh Bites Catering",
            description: "Healthy and delicious meals delivered fresh to your dorm. Daily meal plans available with variety of cuisines.",
            category: "food",
            owner: { 
              name: "Fatima Begum", 
              email: "freshbites@gmail.com", 
              phone: "+8801611223344",
              experience: "5 years"
            },
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
            rating: 4.8,
            reviews: 156,
            services: ["Daily Meals", "Custom Orders", "Healthy Options", "Fast Delivery", "Bulk Orders"],
            location: "Serves UIU Area",
            price_range: "৳80-200 per meal",
            verified: true,
            operating_hours: "7:00 AM - 10:00 PM",
            delivery_time: "30-45 minutes",
            min_order: "৳150"
          },
          {
            id: 2,
            name: "Tech Repair Hub",
            description: "Professional laptop and smartphone repair services. Quick turnaround and student discounts available.",
            category: "services",
            owner: { 
              name: "Raj Patel", 
              email: "techrepair@outlook.com", 
              phone: "+8801755667788",
              experience: "8 years"
            },
            images: ["/api/placeholder/400/300"],
            rating: 4.6,
            reviews: 89,
            services: ["Laptop Repair", "Phone Repair", "Data Recovery", "Hardware Upgrade", "Software Installation"],
            location: "Panthapath",
            price_range: "৳500-5000",
            verified: true,
            operating_hours: "10:00 AM - 8:00 PM",
            warranty: "3 months",
            student_discount: "15%"
          },
          {
            id: 3,
            name: "Study Buddy Tutoring",
            description: "Expert tutors for all subjects. Group and individual sessions available with flexible timings.",
            category: "education",
            owner: { 
              name: "Dr. Nashir Uddin", 
              email: "studybuddy@uiu.ac.bd", 
              phone: "+8801933445566",
              experience: "12 years"
            },
            images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
            rating: 4.9,
            reviews: 203,
            services: ["Math Tutoring", "Programming", "Business Studies", "Language Classes", "Exam Preparation"],
            location: "UIU Campus",
            price_range: "৳300-800 per hour",
            verified: true,
            operating_hours: "9:00 AM - 9:00 PM",
            group_sessions: true,
            online_available: true
          },
          {
            id: 4,
            name: "Campus Laundry Express",
            description: "Professional laundry and dry cleaning services with pickup and delivery to your dorm.",
            category: "services",
            owner: { 
              name: "Mohammad Ali", 
              email: "laundry@express.com", 
              phone: "+8801634567890",
              experience: "6 years"
            },
            images: ["/api/placeholder/400/300"],
            rating: 4.4,
            reviews: 67,
            services: ["Washing", "Dry Cleaning", "Ironing", "Pickup & Delivery", "Express Service"],
            location: "Serves All Dorms",
            price_range: "৳50-300 per item",
            verified: true,
            operating_hours: "8:00 AM - 9:00 PM",
            same_day: true,
            eco_friendly: true
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
      // Set mock data on error
      setProducts([]);
      setRentals([]);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: FaShoppingBag },
    { id: 'books', name: 'Books', icon: FaBookOpen },
    { id: 'electronics', name: 'Electronics', icon: FaLaptop },
    { id: 'furniture', name: 'Furniture', icon: FaCouch },
    { id: 'clothing', name: 'Clothing', icon: FaTshirt },
    { id: 'food', name: 'Food', icon: FaUtensils },
    { id: 'transportation', name: 'Transport', icon: FaCar },
    { id: 'other', name: 'Other', icon: FaTag }
  ];

  const businessCategories = [
    { id: 'food', name: 'Food & Catering', icon: FaUtensils },
    { id: 'services', name: 'Services', icon: FaStore },
    { id: 'education', name: 'Education', icon: FaBookOpen },
    { id: 'transportation', name: 'Transportation', icon: FaCar },
    { id: 'other', name: 'Other', icon: FaTag }
  ];

  const formatPrice = (price) => {
    return `৳${price.toLocaleString()}`;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const endpoint = createType === 'product' 
        ? 'http://localhost:5000/api/marketplace/products'
        : createType === 'rental'
        ? 'http://localhost:5000/api/marketplace/rentals'
        : 'http://localhost:5000/api/marketplace/businesses';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'books',
          quantity: 1,
          is_second_hand: false,
          condition: 'new',
          location: '',
          rental_rate: '',
          rental_type: 'daily',
          bedrooms: 1,
          bathrooms: 1,
          furnished: false,
          utilities_included: false,
          pet_friendly: false,
          amenities: [],
          available_from: '',
          business_category: 'food',
          services: [],
          operating_hours: '',
          phone: '',
          email: '',
          website: ''
        });
        fetchMarketplaceData();
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCondition = conditionFilter === 'all' || 
                           (conditionFilter === 'new' && !product.is_second_hand) ||
                           (conditionFilter === 'used' && product.is_second_hand);
    return matchesSearch && matchesCategory && matchesPrice && matchesCondition;
  });

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = rental.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = rental.rental_rate >= priceRange[0] && rental.rental_rate <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortData = (data, type) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
        case 'oldest':
          return new Date(a.created_at || Date.now()) - new Date(b.created_at || Date.now());
        case 'price_low':
          const priceA = type === 'rental' ? a.rental_rate : a.price || 0;
          const priceB = type === 'rental' ? b.rental_rate : b.price || 0;
          return priceA - priceB;
        case 'price_high':
          const priceA2 = type === 'rental' ? a.rental_rate : a.price || 0;
          const priceB2 = type === 'rental' ? b.rental_rate : b.price || 0;
          return priceB2 - priceA2;
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  };

  const ProductCard = ({ product }) => (
    <div 
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group cursor-pointer relative"
      onClick={() => setSelectedProduct(product)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.images?.[0] || "/api/placeholder/400/300"} 
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            product.is_second_hand 
              ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' 
              : 'bg-gradient-to-r from-green-400 to-green-600 text-white'
          }`}>
            {product.is_second_hand ? 'Used' : 'New'}
          </span>
          {product.verified && (
            <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full text-xs font-bold flex items-center">
              <FaCheckCircle className="mr-1" size={10} />
              Verified
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Handle like functionality
            }}
          >
            <FaHeart className="text-gray-600 hover:text-red-500 transition-colors" size={14} />
          </button>
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Handle share functionality
            }}
          >
            <FaShare className="text-gray-600 hover:text-blue-500 transition-colors" size={14} />
          </button>
        </div>
        
        {product.condition && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full font-medium">
              {product.condition}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="text-right ml-2">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <FaEye className="mr-1" />
              {product.views}
            </span>
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <FaHeart className="mr-1" />
              {product.likes}
            </span>
          </div>
          <span className="flex items-center bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
            <FaClock className="mr-1" size={10} />
            {formatTimeAgo(product.created_at)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="mr-1" size={12} />
            {product.location}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            categories.find(c => c.id === product.category)?.id === 'books' 
              ? 'bg-blue-100 text-blue-600'
              : categories.find(c => c.id === product.category)?.id === 'electronics'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {categories.find(c => c.id === product.category)?.name || 'Other'}
          </span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <FaUser className="text-white" size={14} />
            </div>
            <div>
              <span className="text-sm text-gray-700 font-semibold block">{product.seller?.name}</span>
              {product.seller?.rating && (
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" size={10} />
                  <span className="text-xs text-gray-500">{product.seller.rating} ({product.seller.total_sales} sales)</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 bg-gray-100 hover:bg-indigo-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle contact functionality
              }}
            >
              <FaPhone className="text-gray-600 hover:text-indigo-600" size={12} />
            </button>
            <button 
              className="p-2 bg-gray-100 hover:bg-indigo-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle email functionality
              }}
            >
              <FaEnvelope className="text-gray-600 hover:text-indigo-600" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RentalCard = ({ rental }) => (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden">
        <img 
          src={rental.images?.[0] || "/api/placeholder/400/300"} 
          alt={rental.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full text-xs font-bold">
            For Rent
          </span>
          {rental.verified && (
            <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full text-xs font-bold flex items-center">
              <FaCheckCircle className="mr-1" size={10} />
              Verified
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Handle like functionality
            }}
          >
            <FaHeart className="text-gray-600 hover:text-red-500 transition-colors" size={14} />
          </button>
          <button 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Handle share functionality
            }}
          >
            <FaShare className="text-gray-600 hover:text-blue-500 transition-colors" size={14} />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
            {rental.name}
          </h3>
          <div className="text-right ml-2">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">
              {formatPrice(rental.rental_rate)}
            </div>
            <span className="text-sm font-normal text-gray-500">/{rental.rental_type}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{rental.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
            <FaBed className="mr-2 text-gray-400" size={14} />
            <span className="font-medium">{rental.bedrooms} Bedroom{rental.bedrooms > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
            <FaBath className="mr-2 text-gray-400" size={14} />
            <span className="font-medium">{rental.bathrooms} Bathroom{rental.bathrooms > 1 ? 's' : ''}</span>
          </div>
          {rental.size && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              <FaBuilding className="mr-2 text-gray-400" size={14} />
              <span className="font-medium">{rental.size}</span>
            </div>
          )}
          {rental.floor && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              <FaBuilding className="mr-2 text-gray-400" size={14} />
              <span className="font-medium">{rental.floor}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {rental.amenities?.slice(0, 4).map((amenity, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
              {amenity}
            </span>
          ))}
          {rental.amenities?.length > 4 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
              +{rental.amenities.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <FaEye className="mr-1" />
              {rental.views}
            </span>
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <FaHeart className="mr-1" />
              {rental.likes}
            </span>
          </div>
          <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
            Available {new Date(rental.available_from).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-1" size={12} />
            {rental.location}
          </span>
          <div className="flex items-center space-x-2">
            {rental.furnished && (
              <div className="flex items-center bg-green-50 text-green-600 px-2 py-1 rounded-full">
                <FaCouch className="mr-1" size={10} />
                <span className="text-xs">Furnished</span>
              </div>
            )}
            {rental.pet_friendly && (
              <div className="flex items-center bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
                <FaPaw className="mr-1" size={10} />
                <span className="text-xs">Pet OK</span>
              </div>
            )}
            {rental.utilities_included && (
              <div className="flex items-center bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                <FaLeaf className="mr-1" size={10} />
                <span className="text-xs">Utilities</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
              <FaUser className="text-white" size={14} />
            </div>
            <div>
              <span className="text-sm text-gray-700 font-semibold block">{rental.owner?.name}</span>
              {rental.owner?.rating && (
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" size={10} />
                  <span className="text-xs text-gray-500">{rental.owner.rating} ({rental.owner.properties} properties)</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle contact functionality
              }}
            >
              <FaPhone className="text-gray-600 hover:text-blue-600" size={12} />
            </button>
            <button 
              className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle email functionality
              }}
            >
              <FaEnvelope className="text-gray-600 hover:text-blue-600" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BusinessCard = ({ business }) => (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden">
        <img 
          src={business.images?.[0] || "/api/placeholder/400/300"} 
          alt={business.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-full text-xs font-bold">
            Business
          </span>
          {business.verified && (
            <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full text-xs font-bold flex items-center">
              <FaCheckCircle className="mr-1" size={10} />
              Verified
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
            <FaStar className="text-yellow-400 mr-1" size={12} />
            <span className="text-sm font-bold text-gray-800">{business.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors leading-tight">
            {business.name}
          </h3>
          <div className="flex items-center ml-2">
            <span className="text-xs text-gray-500">({business.reviews} reviews)</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{business.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {business.services?.slice(0, 3).map((service, index) => (
            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
              {service}
            </span>
          ))}
          {business.services?.length > 3 && (
            <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
              +{business.services.length - 3} more
            </span>
          )}
        </div>
        
        <div className="space-y-3 text-sm text-gray-600 mb-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-gray-400" size={12} />
              <span className="font-medium">{business.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <FaDollarSign className="mr-2 text-gray-400" size={12} />
              <span className="font-medium">{business.price_range}</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <FaClock className="mr-2 text-gray-400" size={12} />
              <span className="font-medium">{business.operating_hours}</span>
            </div>
          </div>
        </div>
        
        {/* Additional business features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {business.delivery_time && (
            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
              🚚 {business.delivery_time}
            </span>
          )}
          {business.student_discount && (
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
              🎓 {business.student_discount} off
            </span>
          )}
          {business.same_day && (
            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
              ⚡ Same day
            </span>
          )}
          {business.online_available && (
            <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">
              💻 Online
            </span>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
              <FaStore className="text-white" size={14} />
            </div>
            <div>
              <span className="text-sm text-gray-700 font-semibold block">{business.owner?.name}</span>
              {business.owner?.experience && (
                <span className="text-xs text-gray-500">{business.owner.experience} experience</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 bg-gray-100 hover:bg-purple-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle contact functionality
              }}
            >
              <FaPhone className="text-gray-600 hover:text-purple-600" size={12} />
            </button>
            <button 
              className="p-2 bg-gray-100 hover:bg-purple-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle email functionality
              }}
            >
              <FaEnvelope className="text-gray-600 hover:text-purple-600" size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CreateListingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Listing</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>
        
        {/* Listing Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Listing Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'product', name: 'Product', icon: FaShoppingBag, desc: 'Sell items' },
              { id: 'rental', name: 'Rental', icon: FaHome, desc: 'Rent property' },
              { id: 'business', name: 'Business', icon: FaStore, desc: 'Offer services' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setCreateType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  createType === type.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <type.icon className={`mx-auto mb-2 ${
                  createType === type.id ? 'text-indigo-600' : 'text-gray-400'
                }`} size={24} />
                <div className={`font-medium ${
                  createType === type.id ? 'text-indigo-900' : 'text-gray-700'
                }`}>{type.name}</div>
                <div className="text-xs text-gray-500">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreateListing} className="space-y-6">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name/Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Product-specific fields */}
          {createType === 'product' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (৳)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_second_hand"
                    checked={formData.is_second_hand}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Second Hand Item</label>
                </div>
                
                {formData.is_second_hand && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="new">New</option>
                      <option value="like_new">Like New</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Rental-specific fields */}
          {createType === 'rental' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rental Rate (৳)</label>
                  <input
                    type="number"
                    name="rental_rate"
                    value={formData.rental_rate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rental Type</label>
                  <select
                    name="rental_type"
                    value={formData.rental_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Available From</label>
                  <input
                    type="date"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Furnished</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="utilities_included"
                    checked={formData.utilities_included}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Utilities Included</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="pet_friendly"
                    checked={formData.pet_friendly}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Pet Friendly</label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['WiFi', 'AC', 'Parking', 'Security', 'Laundry', 'Kitchen', 'Balcony', 'Elevator', 'Generator'].map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleArrayInputChange('amenities', amenity)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label className="text-sm text-gray-700">{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Business-specific fields */}
          {createType === 'business' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Category</label>
                  <select
                    name="business_category"
                    value={formData.business_category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {businessCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Operating Hours</label>
                  <input
                    type="text"
                    name="operating_hours"
                    value={formData.operating_hours}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Services Offered</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Delivery', 'Custom Orders', 'Bulk Orders', 'Express Service', 'Online Support', 'Consultation', 'Installation', 'Maintenance', 'Training'].map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleArrayInputChange('services', service)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label className="text-sm text-gray-700">{service}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ProductDetailModal = ({ product, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Image Gallery */}
          <div className="relative h-80 bg-gray-100">
            <img
              src={product.images?.[selectedImageIndex] || "/api/placeholder/600/400"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <FaChevronRight />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.is_second_hand 
                        ? 'bg-orange-100 text-orange-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {product.is_second_hand ? 'Used' : 'New'}
                    </span>
                    {product.condition && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        {product.condition}
                      </span>
                    )}
                    {product.verified && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center">
                        <FaCheckCircle className="mr-1" size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-2">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaEye className="mr-1" />
                      {product.views} views
                    </span>
                    <span className="flex items-center">
                      <FaHeart className="mr-1" />
                      {product.likes} likes
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Category</div>
                  <div className="font-semibold text-gray-900">
                    {categories.find(c => c.id === product.category)?.name || 'Other'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Quantity</div>
                  <div className="font-semibold text-gray-900">{product.quantity} available</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-semibold text-gray-900 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" size={14} />
                    {product.location}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Listed</div>
                  <div className="font-semibold text-gray-900 flex items-center">
                    <FaClock className="mr-2 text-gray-400" size={14} />
                    {formatTimeAgo(product.created_at)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seller Info */}
            <div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Seller Information</h3>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <FaUser className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{product.seller?.name}</div>
                    {product.seller?.rating && (
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" size={14} />
                        <span className="font-medium text-gray-700">{product.seller.rating}</span>
                        <span className="text-gray-500 ml-2">({product.seller.total_sales} sales)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center">
                    <FaPhone className="mr-2" />
                    Call Seller
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <FaEnvelope className="mr-2" />
                    Send Message
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Email:</span>
                    <span className="font-medium">{product.seller?.email}</span>
                  </div>
                  {product.seller?.phone && (
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                      <span>Phone:</span>
                      <span className="font-medium">{product.seller?.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                  Buy Now
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-red-50 text-red-600 py-3 px-6 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center">
                    <FaHeart className="mr-2" />
                    Save
                  </button>
                  <button className="bg-gray-50 text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                    <FaFlag className="mr-2" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'products':
        return sortData(filteredProducts, 'product');
      case 'rentals':
        return sortData(filteredRentals, 'rental');
      case 'businesses':
        return sortData(filteredBusinesses, 'business');
      case 'all':
      default:
        return [
          ...sortData(filteredProducts, 'product'),
          ...sortData(filteredRentals, 'rental'),
          ...sortData(filteredBusinesses, 'business')
        ];
    }
  };

  const renderCard = (item) => {
    if (item.rental_rate !== undefined) {
      return <RentalCard key={`rental-${item.id}`} rental={item} />;
    } else if (item.rating !== undefined && item.services) {
      return <BusinessCard key={`business-${item.id}`} business={item} />;
    } else {
      return <ProductCard key={`product-${item.id}`} product={item} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Campus Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover, buy, rent, and connect with your campus community
          </p>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-2xl border border-gray-200 w-fit mb-6">
            {[
              { id: 'all', name: 'All Items', icon: FaShoppingBag, count: products.length + rentals.length + businesses.length },
              { id: 'products', name: 'Buy & Sell', icon: FaTag, count: products.length },
              { id: 'rentals', name: 'Housing & Rentals', icon: FaHome, count: rentals.length },
              { id: 'businesses', name: 'Campus Businesses', icon: FaStore, count: businesses.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <tab.icon className="mr-2" size={16} />
                {tab.name}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, rentals, or businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
                />
              </div>
            </div>
            
            {/* Sort and Filter Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-6 py-3 border border-gray-200 rounded-xl transition-all duration-300 ${
                  showFilters 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white/70 backdrop-blur-sm hover:bg-white'
                }`}
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="mr-2" />
                Create Listing
              </button>
            </div>
          </div>
          
          {/* Category Filter */}
          {(activeTab === 'all' || activeTab === 'products') && (
            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <category.icon className="mr-2" size={14} />
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 sticky top-8 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                {/* Price Range */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Price Range (৳)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>৳{priceRange[0].toLocaleString()}</span>
                      <span>৳{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Condition Filter */}
                {activeTab !== 'businesses' && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Condition
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'all', name: 'All Conditions' },
                        { id: 'new', name: 'New' },
                        { id: 'used', name: 'Used' }
                      ].map((condition) => (
                        <label key={condition.id} className="flex items-center">
                          <input
                            type="radio"
                            name="condition"
                            value={condition.id}
                            checked={conditionFilter === condition.id}
                            onChange={(e) => setConditionFilter(e.target.value)}
                            className="mr-3 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{condition.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Filters for Rentals */}
                {activeTab === 'rentals' && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Property Features
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'furnished', name: 'Furnished' },
                        { id: 'pet_friendly', name: 'Pet Friendly' },
                        { id: 'utilities_included', name: 'Utilities Included' }
                      ].map((feature) => (
                        <label key={feature.id} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{feature.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 10000]);
                    setConditionFilter('all');
                    setSortBy('newest');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : getCurrentData().length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShoppingBag className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getCurrentData().map(renderCard)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateListingModal />}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default Marketplace;