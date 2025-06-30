const { useState, useEffect, useRef, useCallback } = React;

const API_BASE_URL = 'http://127.0.0.1:8888';

// Restaurant Location Parameters Configuration
const RESTAURANT_PARAMETERS = [
    {
        id: 'competitors',
        name: 'Competitors Distance',
        icon: 'fa-utensils',
        description: 'Distance from nearest competing restaurants',
        type: 'distance',
        unit: 'meters',
        min: 50,
        max: 2000,
        default: 500,
        defaultWeight: 15
    },
    {
        id: 'foot_traffic',
        name: 'Foot Traffic Density',
        icon: 'fa-walking',
        description: 'Pedestrian traffic intensity in the area',
        type: 'scale',
        unit: 'density',
        min: 1,
        max: 10,
        default: 7,
        defaultWeight: 20
    },
    {
        id: 'public_transport',
        name: 'Public Transport Access',
        icon: 'fa-bus',
        description: 'Proximity to public transportation',
        type: 'distance',
        unit: 'meters',
        min: 100,
        max: 1000,
        default: 300,
        defaultWeight: 12
    },
    {
        id: 'parking',
        name: 'Parking Availability',
        icon: 'fa-parking',
        description: 'Available parking spaces nearby',
        type: 'scale',
        unit: 'availability',
        min: 1,
        max: 10,
        default: 6,
        defaultWeight: 10
    },
    {
        id: 'rent_cost',
        name: 'Rental Cost',
        icon: 'fa-dollar-sign',
        description: 'Commercial rent prices in the area',
        type: 'scale',
        unit: 'cost_level',
        min: 1,
        max: 10,
        default: 5,
        defaultWeight: 18,
        inverted: true // Lower is better
    },
    {
        id: 'population_density',
        name: 'Population Density',
        icon: 'fa-users',
        description: 'Residential population density',
        type: 'scale',
        unit: 'people/km²',
        min: 1,
        max: 10,
        default: 7,
        defaultWeight: 15
    },
    {
        id: 'office_buildings',
        name: 'Office Buildings Proximity',
        icon: 'fa-building',
        description: 'Distance to business districts',
        type: 'distance',
        unit: 'meters',
        min: 100,
        max: 2000,
        default: 800,
        defaultWeight: 8
    },
    {
        id: 'shopping_centers',
        name: 'Shopping Centers',
        icon: 'fa-shopping-cart',
        description: 'Proximity to shopping areas',
        type: 'distance',
        unit: 'meters',
        min: 200,
        max: 1500,
        default: 600,
        defaultWeight: 10
    },
    {
        id: 'safety_level',
        name: 'Safety Level',
        icon: 'fa-shield-alt',
        description: 'Crime rate and safety index',
        type: 'scale',
        unit: 'safety_index',
        min: 1,
        max: 10,
        default: 8,
        defaultWeight: 7
    },
    {
        id: 'visibility',
        name: 'Street Visibility',
        icon: 'fa-eye',
        description: 'How visible the location is from street',
        type: 'scale',
        unit: 'visibility',
        min: 1,
        max: 10,
        default: 8,
        defaultWeight: 5
    }
];

// Header Component
function Header({ onMenuToggle, isAnalyzing }) {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={onMenuToggle}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <i className="fas fa-bars text-gray-600"></i>
                </button>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-white text-lg"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Monasib</h1>
                        <p className="text-sm text-gray-600 arabic-text">مناسب - Restaurant Location Intelligence</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {isAnalyzing && (
                    <div className="flex items-center space-x-2 text-primary">
                        <div className="loading-spinner w-4 h-4"></div>
                        <span className="text-sm font-medium">Analyzing...</span>
                    </div>
                )}
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Online
                </div>
            </div>
        </div>
    );
}

// Parameter Control Component
function ParameterControl({ parameter, isActive, value, weight, onToggle, onValueChange, onWeightChange }) {
    const handleSliderChange = (e) => {
        onValueChange(parameter.id, parseInt(e.target.value));
    };

    const handleWeightChange = (e) => {
        onWeightChange(parameter.id, parseInt(e.target.value));
    };

    return (
        <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${
            isActive ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'
        }`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className={`parameter-icon ${isActive ? 'active' : ''}`}>
                            <i className={`fas ${parameter.icon}`}></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{parameter.name}</h4>
                            <p className="text-sm text-gray-600">{parameter.description}</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => onToggle(parameter.id)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                {isActive && (
                    <div className="space-y-4 pt-3 border-t border-gray-100">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">
                                    {parameter.type === 'distance' ? 'Maximum Distance' : 'Required Level'}
                                </label>
                                <span className="text-sm font-semibold text-primary">
                                    {value} {parameter.unit}
                                </span>
                            </div>
                            <input
                                type="range"
                                min={parameter.min}
                                max={parameter.max}
                                value={value}
                                onChange={handleSliderChange}
                                className="w-full parameter-slider"
                            />
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">{parameter.min}</span>
                                <span className="text-xs text-gray-500">{parameter.max}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Weight</label>
                                <span className="text-sm font-semibold text-secondary">{weight}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={weight}
                                onChange={handleWeightChange}
                                className="w-full parameter-slider"
                            />
                            <div className="weight-bar-container mt-2">
                                <div 
                                    className="weight-bar" 
                                    style={{width: `${(weight / 30) * 100}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Analysis Results Component
function AnalysisResults({ results, onDownload, onClose }) {
    if (!results) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-chart-line text-green-600"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                            <p className="text-sm text-gray-600">Location suitability analysis completed</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <i className="fas fa-times text-gray-400"></i>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <i className="fas fa-trophy text-yellow-500 text-xl"></i>
                                <h4 className="font-semibold text-gray-900">Best Location Found</h4>
                            </div>
                            <p className="text-gray-700">
                                Suitability Score: <span className="font-bold text-green-600">{results.bestScore || '87.5'}%</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Coordinates: {results.bestLocation || '40.7128, -74.0060'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-600">{results.totalLocations || '156'}</div>
                                <div className="text-sm text-gray-600">Locations Analyzed</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600">{results.suitableLocations || '23'}</div>
                                <div className="text-sm text-gray-600">Suitable Locations</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Parameter Weights Used</h4>
                            <div className="space-y-2">
                                {Object.entries(results.weights || {}).map(([param, weight]) => (
                                    <div key={param} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-700 capitalize">{param.replace('_', ' ')}</span>
                                        <span className="text-sm font-semibold text-primary">{weight}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                        Analysis completed at {new Date().toLocaleTimeString()}
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => onDownload('geojson')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <i className="fas fa-download mr-2"></i>
                            Download GeoJSON
                        </button>
                        <button
                            onClick={() => onDownload('shapefile')}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <i className="fas fa-file-archive mr-2"></i>
                            Download Shapefile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main App Component
function App() {
    const [layers, setLayers] = useState([]);
    const [activeLayers, setActiveLayers] = useState({});
    const [parameters, setParameters] = useState({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('parameters'); // 'parameters' or 'layers'
    
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);

    // Initialize parameters
    useEffect(() => {
        const initialParams = {};
        RESTAURANT_PARAMETERS.forEach(param => {
            initialParams[param.id] = {
                active: false,
                value: param.default,
                weight: param.defaultWeight
            };
        });
        setParameters(initialParams);
    }, []);

    // Initialize map with multiple tile layers and real data
    useEffect(() => {
        console.log('Map initialization useEffect triggered');
        console.log('mapRef.current:', mapRef.current);
        console.log('leafletMapRef.current:', leafletMapRef.current);
        
        if (!leafletMapRef.current && mapRef.current) {
            console.log('Initializing Leaflet map...');
            try {
                // Initialize map centered on New York City for demo
                leafletMapRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
                console.log('Map created successfully');
                
                // Base layers
                const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });

                const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
                });

                const cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                });

                // Add default layer
                cartoLayer.addTo(leafletMapRef.current);
                console.log('Base layer added');

                // Layer control
                const baseLayers = {
                    "Street Map": osmLayer,
                    "Satellite": satelliteLayer,
                    "Light Theme": cartoLayer
                };

                L.control.layers(baseLayers).addTo(leafletMapRef.current);
                console.log('Layer control added');

                // Add some sample restaurant data points
                const sampleRestaurants = [
                    { lat: 40.7589, lng: -73.9851, name: "Times Square Restaurant", score: 95 },
                    { lat: 40.7505, lng: -73.9934, name: "Midtown Bistro", score: 87 },
                    { lat: 40.7282, lng: -74.0776, name: "Financial District Cafe", score: 78 },
                    { lat: 40.7614, lng: -73.9776, name: "Central Park Restaurant", score: 92 },
                    { lat: 40.7178, lng: -74.0431, name: "Tribeca Fine Dining", score: 89 }
                ];

                sampleRestaurants.forEach(restaurant => {
                    const marker = L.marker([restaurant.lat, restaurant.lng])
                        .bindPopup(`
                            <div class="p-2">
                                <h4 class="font-semibold">${restaurant.name}</h4>
                                <p class="text-sm text-gray-600">Suitability Score: <span class="font-bold text-green-600">${restaurant.score}%</span></p>
                                <div class="mt-2">
                                    <button class="px-3 py-1 bg-primary text-white text-xs rounded">View Details</button>
                                </div>
                            </div>
                        `);
                    marker.addTo(leafletMapRef.current);
                });
                console.log('Sample markers added');
                
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        }
    }, []);

    // Calculate total weight
    const totalWeight = Object.values(parameters).reduce((sum, param) => 
        param.active ? sum + param.weight : sum, 0
    );

    // Handle parameter toggle
    const handleParameterToggle = (paramId) => {
        setParameters(prev => ({
            ...prev,
            [paramId]: {
                ...prev[paramId],
                active: !prev[paramId].active
            }
        }));
    };

    // Handle parameter value change
    const handleParameterValueChange = (paramId, value) => {
        setParameters(prev => ({
            ...prev,
            [paramId]: {
                ...prev[paramId],
                value: value
            }
        }));
    };

    // Handle parameter weight change
    const handleParameterWeightChange = (paramId, weight) => {
        setParameters(prev => ({
            ...prev,
            [paramId]: {
                ...prev[paramId],
                weight: weight
            }
        }));
    };

    // Handle analysis
    const handleAnalysis = async () => {
        const activeParams = Object.entries(parameters)
            .filter(([_, param]) => param.active)
            .reduce((acc, [id, param]) => {
                acc[id] = {
                    value: param.value,
                    weight: param.weight
                };
                return acc;
            }, {});

        if (Object.keys(activeParams).length === 0) {
            alert('Please select at least one parameter for analysis.');
            return;
        }

        if (totalWeight !== 100) {
            alert(`Total weight must equal 100%. Current total: ${totalWeight}%`);
            return;
        }

        setIsAnalyzing(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    criteria: activeParams,
                    totalWeight: totalWeight
                }),
            });
            
            const result = await response.json();
            
            // Simulate analysis delay for better UX
            setTimeout(() => {
                setAnalysisResults({
                    ...result,
                    weights: Object.fromEntries(
                        Object.entries(activeParams).map(([id, param]) => [id, param.weight])
                    ),
                    bestScore: 87.5,
                    bestLocation: "40.7589, -73.9851",
                    totalLocations: 156,
                    suitableLocations: 23
                });
                setIsAnalyzing(false);
            }, 2000);
            
        } catch (error) {
            console.error("Error during analysis:", error);
            setIsAnalyzing(false);
            alert("Error performing analysis. Please try again.");
        }
    };

    // Handle download
    const handleDownload = (format) => {
        // Simulate download
        const data = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {
                        name: "Best Location",
                        suitability_score: 87.5
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [-73.9851, 40.7589]
                    }
                }
            ]
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monasib_analysis.${format === 'geojson' ? 'geojson' : 'zip'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const activeParametersCount = Object.values(parameters).filter(p => p.active).length;

    return (
        <div className="flex h-screen w-screen bg-gray-50">
            {/* Debug info */}
            <div style={{position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '10px', zIndex: 10000, fontSize: '12px', border: '1px solid #ccc'}}>
                Debug: React Loaded, Map Container: {mapRef.current ? 'Ready' : 'Not Ready'}
            </div>
            
            {/* Mobile menu button */}
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-[1001] p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
                <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-gray-600`}></i>
            </button>

            {/* Sidebar */}
            <div className={`w-96 bg-white shadow-xl flex flex-col transition-all duration-300 z-[1000] ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 fixed md:relative h-full`}>
                
                <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isAnalyzing={isAnalyzing} />
                
                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setCurrentView('parameters')}
                        className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                            currentView === 'parameters'
                                ? 'border-primary text-primary bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <i className="fas fa-sliders-h mr-2"></i>
                        Parameters ({activeParametersCount})
                    </button>
                    <button
                        onClick={() => setCurrentView('layers')}
                        className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                            currentView === 'layers'
                                ? 'border-primary text-primary bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <i className="fas fa-layer-group mr-2"></i>
                        Layers
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {currentView === 'parameters' ? (
                        <div className="p-4 space-y-4">
                            {/* Weight Summary */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Weight Distribution</h3>
                                    <span className={`text-lg font-bold ${
                                        totalWeight === 100 ? 'text-green-600' : totalWeight > 100 ? 'text-red-600' : 'text-orange-600'
                                    }`}>
                                        {totalWeight}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            totalWeight === 100 ? 'bg-green-500' : totalWeight > 100 ? 'bg-red-500' : 'bg-orange-500'
                                        }`}
                                        style={{width: `${Math.min(totalWeight, 100)}%`}}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    {totalWeight === 100 ? 'Perfect! Ready for analysis.' :
                                     totalWeight > 100 ? 'Total exceeds 100%. Please adjust weights.' :
                                     'Add more parameters or increase weights to reach 100%.'}
                                </p>
                            </div>

                            {/* Parameters */}
                            {RESTAURANT_PARAMETERS.map(parameter => (
                                <ParameterControl
                                    key={parameter.id}
                                    parameter={parameter}
                                    isActive={parameters[parameter.id]?.active || false}
                                    value={parameters[parameter.id]?.value || parameter.default}
                                    weight={parameters[parameter.id]?.weight || parameter.defaultWeight}
                                    onToggle={handleParameterToggle}
                                    onValueChange={handleParameterValueChange}
                                    onWeightChange={handleParameterWeightChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="text-center py-8 text-gray-500">
                                <i className="fas fa-layer-group text-4xl mb-4"></i>
                                <p>Layer management coming soon...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analysis Button */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={handleAnalysis}
                        disabled={isAnalyzing || totalWeight !== 100 || activeParametersCount === 0}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                            isAnalyzing || totalWeight !== 100 || activeParametersCount === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                    >
                        {isAnalyzing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="loading-spinner w-4 h-4"></div>
                                <span>Analyzing Locations...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-2">
                                <i className="fas fa-chart-line"></i>
                                <span>Run Location Analysis</span>
                            </div>
                        )}
                    </button>
                    
                    {activeParametersCount > 0 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {activeParametersCount} parameter{activeParametersCount !== 1 ? 's' : ''} selected • {totalWeight}% total weight
                        </p>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
                <div 
                    ref={mapRef} 
                    id="map" 
                    className="w-full h-full"
                    style={{minHeight: '400px', background: '#f0f0f0'}}
                >
                    {/* Fallback content */}
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <i className="fas fa-map text-4xl mb-2"></i>
                            <p>Loading Map...</p>
                        </div>
                    </div>
                </div>
                
                {/* Map Legend */}
                <div className="map-control map-control-bottom-left">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Legend</h4>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>High Suitability</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Medium Suitability</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Low Suitability</span>
                        </div>
                    </div>
                </div>

                {/* Analysis Status */}
                {isAnalyzing && (
                    <div className="map-control map-control-top-right">
                        <div className="flex items-center space-x-2 text-primary">
                            <div className="loading-spinner w-5 h-5"></div>
                            <div>
                                <div className="font-semibold text-sm">Analyzing...</div>
                                <div className="text-xs text-gray-600">Processing {activeParametersCount} parameters</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Analysis Results Modal */}
            <AnalysisResults 
                results={analysisResults}
                onDownload={handleDownload}
                onClose={() => setAnalysisResults(null)}
            />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[999]"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

console.log('App component defined successfully');
console.log('React:', typeof React);
console.log('ReactDOM:', typeof ReactDOM);
console.log('L (Leaflet):', typeof L);

ReactDOM.render(<App />, document.getElementById('root'));
