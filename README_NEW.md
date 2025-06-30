# Monasib (مناسب) - Restaurant Location Intelligence

<div align="center">
  <img src="https://img.shields.io/badge/Status-MVP%20Ready-success" alt="Status">
  <img src="https://img.shields.io/badge/Frontend-React%2018-blue" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-FastAPI-green" alt="Backend">
  <img src="https://img.shields.io/badge/GIS-GeoPandas-orange" alt="GIS">
</div>

## 📋 Overview

**Monasib** (Arabic: مناسب, meaning "suitable") is an intelligent GIS-based platform that helps entrepreneurs and investors find the optimal location for opening new restaurants. Using advanced spatial analysis and customizable criteria, Monasib evaluates potential locations based on 10 key parameters that influence restaurant success.

### ✨ Key Features

- **🗺️ Interactive Map Interface** - Explore locations with multiple base layers (Street, Satellite, Light Theme)
- **⚙️ Criteria Management Studio** - Control 10+ restaurant-specific parameters with weights and thresholds
- **📊 Smart Analysis Engine** - GIS-based suitability analysis with scoring algorithms
- **📈 Real-time Results** - Visual analysis results with detailed scoring and statistics
- **📄 Downloadable Reports** - Export results in multiple GIS formats (GeoJSON, Shapefile)
- **📱 Responsive Design** - Modern UI that works on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Backend API   │────│   GIS Database  │
│   React + Maps  │    │   FastAPI       │    │   GeoPackage    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack

**Frontend:**
- ⚛️ React 18 with Hooks
- 🗺️ Leaflet.js for interactive maps
- 🎨 Tailwind CSS for modern styling
- 📱 Responsive design with mobile support
- 🔄 Real-time updates and analysis

**Backend:**
- 🚀 FastAPI (Python) with async support
- 🗺️ GeoPandas for spatial data processing
- 📐 Shapely for geometric operations
- 📊 NumPy for statistical calculations
- 🗄️ GeoPackage for spatial data storage

## 📊 Restaurant Location Parameters

The system analyzes 10 key parameters that influence restaurant success:

| Parameter | Type | Weight | Description |
|-----------|------|---------|-------------|
| 🍽️ **Competitors Distance** | Distance | 15% | Distance from competing restaurants |
| 🚶 **Foot Traffic Density** | Scale | 20% | Pedestrian traffic intensity |
| 🚌 **Public Transport Access** | Distance | 12% | Proximity to public transportation |
| 🅿️ **Parking Availability** | Scale | 10% | Available parking spaces |
| 💰 **Rental Cost** | Scale | 18% | Commercial rent prices (inverted) |
| 👥 **Population Density** | Scale | 15% | Residential population density |
| 🏢 **Office Buildings** | Distance | 8% | Proximity to business districts |
| 🛒 **Shopping Centers** | Distance | 10% | Proximity to shopping areas |
| 🛡️ **Safety Level** | Scale | 7% | Crime rate and safety index |
| 👁️ **Street Visibility** | Scale | 5% | Location visibility from street |

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ 
- Modern web browser

### Installation & Running

1. **Clone or navigate to the project directory**
   ```bash
   cd Monasib
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the application**
   ```bash
   # Option 1: Using Python directly
   python -m uvicorn main:app --reload --port 8888
   
   # Option 2: Using the batch file (Windows)
   start_server.bat
   ```

4. **Access the application**
   Open your browser and go to: `http://localhost:8888`

That's it! The application will automatically:
- Create sample GIS data for New York City
- Start the FastAPI backend
- Serve the React frontend
- Initialize the interactive map with sample locations

## 🎯 How to Use

### 1. **Open Monasib**
- Navigate to `http://localhost:8888`
- The application loads with an interactive map showing NYC sample data
- Sample restaurants and potential locations are displayed as markers

### 2. **Configure Analysis Parameters**
- Click the **Parameters** tab in the sidebar
- You'll see 10 restaurant location parameters
- For each parameter you want to use:
  - **Toggle it ON** using the switch
  - **Set the value** using the slider (distance in meters or scale 1-10)
  - **Adjust the weight** (importance percentage)

### 3. **Set Parameter Weights**
- The total weight must equal **100%**
- The system shows real-time weight distribution
- Green indicator = ready for analysis
- Red/Orange = adjust weights to reach 100%

### 4. **Run Analysis**
- Click **"Run Location Analysis"** when weights total 100%
- The system analyzes 200 potential locations
- Progress indicator shows analysis status

### 5. **Review Results**
- Analysis results popup shows:
  - **Best location** with coordinates and score
  - **Statistics**: total locations analyzed, suitable locations found
  - **Top 10 locations** with detailed scores
  - **Parameter weights** used in analysis

### 6. **Download Results**
- **Download GeoJSON**: For web mapping applications
- **Download Shapefile**: For GIS software (ArcGIS, QGIS)
- Results include location coordinates and suitability scores

## 💡 Example Analysis Workflow

1. **Enable key parameters:**
   - Competitors Distance: 500m, Weight: 20%  
   - Foot Traffic: Level 7, Weight: 25%
   - Public Transport: 300m, Weight: 15%
   - Rent Cost: Level 5, Weight: 25%
   - Population Density: Level 6, Weight: 15%

2. **Run analysis** - System processes 200 locations

3. **Results show:**
   - Best location: 87.5% suitability score
   - 23 suitable locations found (>60% score)
   - Detailed breakdown by parameter

## 🗺️ Map Features

- **Multiple base layers**: Street, Satellite, Light theme
- **Interactive markers**: Click for location details
- **Layer control**: Switch between different map styles
- **Zoom and pan**: Explore the NYC area
- **Responsive design**: Works on desktop and mobile

## 📊 Sample Data Included

The application comes with realistic sample data:
- **20 existing restaurants** with ratings and cuisine types
- **50 potential locations** in commercial zones
- **200+ analysis points** across NYC
- **8 GIS layers**: Transport stops, shopping areas, office buildings, etc.

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application interface |
| `/analysis` | POST | Perform location suitability analysis |
| `/report` | POST | Generate detailed analysis report |
| `/layers` | GET | List available GIS layers |
| `/layers/{name}` | GET | Get specific layer data as GeoJSON |
| `/parameters` | GET | Get analysis parameters configuration |

## 🧪 Testing the API

Test the analysis endpoint directly:

```bash
curl -X POST "http://localhost:8888/analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "criteria": {
      "competitors": {"value": 500, "weight": 50},
      "foot_traffic": {"value": 7, "weight": 50}
    },
    "totalWeight": 100
  }'
```

## 🔮 What's Implemented vs Original Vision

### ✅ **Fully Implemented**
- ✅ Modern React interface with Tailwind CSS
- ✅ Interactive Leaflet.js map with multiple base layers
- ✅ Complete 10-parameter criteria management studio
- ✅ Parameter on/off toggles, value sliders, weight controls
- ✅ Real-time weight distribution (must total 100%)
- ✅ Advanced GIS analysis engine with scoring algorithms
- ✅ Results visualization with detailed statistics
- ✅ Download functionality (GeoJSON, Shapefile)
- ✅ Responsive design for mobile and desktop
- ✅ Sample data with realistic NYC locations
- ✅ FastAPI backend with comprehensive endpoints

### 🚧 **Ready for Enhancement**
- 🔄 Real GIS data integration (currently uses sample data)
- 🔄 AI-generated reports (structure ready, needs AI service)
- 🔄 PostgreSQL + PostGIS (currently uses GeoPackage for simplicity)
- 🔄 50+ parameters (architecture supports expansion)

## 🚀 Next Steps for Production

1. **Data Integration**: Connect to real GIS data sources
2. **Database Migration**: Move from GeoPackage to PostgreSQL + PostGIS  
3. **AI Reports**: Integrate with AI services for automated report generation
4. **Authentication**: Add user accounts and saved analyses
5. **Deployment**: Set up production hosting and CI/CD

## 📞 Support

- The application runs entirely locally for development
- All dependencies are included in requirements.txt
- Sample data is generated automatically on first run
- Modern browsers supported (Chrome, Firefox, Safari, Edge)

---

<div align="center">
  <strong>🎉 Your modern restaurant location intelligence platform is ready!</strong><br>
  <em>Start by running the server and opening http://localhost:8888</em>
</div>
