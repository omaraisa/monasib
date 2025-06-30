import os
import json
import random
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import geopandas as gpd
from shapely.geometry import Polygon, Point
import numpy as np


# Define the request body models
class CriteriaPayload(BaseModel):
    criteria: Dict[str, Any]
    totalWeight: Optional[int] = 100

class ReportRequest(BaseModel):
    analysisResults: Dict[str, Any]


# Restaurant location analysis parameters
RESTAURANT_PARAMETERS = {
    'competitors': {
        'name': 'Competitors Distance',
        'type': 'distance',
        'weight_factor': 0.15,
        'optimal_range': (300, 800)  # meters
    },
    'foot_traffic': {
        'name': 'Foot Traffic Density', 
        'type': 'scale',
        'weight_factor': 0.20,
        'optimal_range': (6, 10)
    },
    'public_transport': {
        'name': 'Public Transport Access',
        'type': 'distance', 
        'weight_factor': 0.12,
        'optimal_range': (100, 400)  # meters
    },
    'parking': {
        'name': 'Parking Availability',
        'type': 'scale',
        'weight_factor': 0.10,
        'optimal_range': (5, 10)
    },
    'rent_cost': {
        'name': 'Rental Cost',
        'type': 'scale',
        'weight_factor': 0.18,
        'optimal_range': (1, 6),  # Lower is better
        'inverted': True
    },
    'population_density': {
        'name': 'Population Density',
        'type': 'scale',
        'weight_factor': 0.15,
        'optimal_range': (6, 10)
    },
    'office_buildings': {
        'name': 'Office Buildings Proximity',
        'type': 'distance',
        'weight_factor': 0.08,
        'optimal_range': (200, 1000)  # meters
    },
    'shopping_centers': {
        'name': 'Shopping Centers',
        'type': 'distance', 
        'weight_factor': 0.10,
        'optimal_range': (300, 800)  # meters
    },
    'safety_level': {
        'name': 'Safety Level',
        'type': 'scale',
        'weight_factor': 0.07,
        'optimal_range': (7, 10)
    },
    'visibility': {
        'name': 'Street Visibility',
        'type': 'scale',
        'weight_factor': 0.05,
        'optimal_range': (6, 10)
    }
}


def generate_sample_locations(center_lat=40.7128, center_lng=-74.0060, count=150):
    """Generate sample restaurant location candidates around NYC"""
    locations = []
    for i in range(count):
        # Generate random points within ~5km radius of center
        lat_offset = random.uniform(-0.045, 0.045)  # ~5km latitude
        lng_offset = random.uniform(-0.06, 0.06)    # ~5km longitude
        
        lat = center_lat + lat_offset
        lng = center_lng + lng_offset
        
        # Generate random parameter values for each location
        location_data = {
            'id': i + 1,
            'latitude': lat,
            'longitude': lng,
            'address': f"Sample Location {i + 1}",
            'parameters': {}
        }
        
        # Generate realistic parameter values
        for param_id, param_config in RESTAURANT_PARAMETERS.items():
            if param_config['type'] == 'distance':
                # Distance values in meters
                value = random.randint(50, 2000)
            else:
                # Scale values 1-10
                value = random.randint(1, 10)
            
            location_data['parameters'][param_id] = value
        
        locations.append(location_data)
    
    return locations


def calculate_suitability_score(location, criteria):
    """Calculate suitability score for a location based on criteria"""
    total_score = 0
    total_weight = 0
    
    for param_id, param_criteria in criteria.items():
        if param_id not in RESTAURANT_PARAMETERS:
            continue
            
        param_config = RESTAURANT_PARAMETERS[param_id]
        location_value = location['parameters'].get(param_id, 0)
        user_weight = param_criteria['weight']
        user_threshold = param_criteria['value']
        
        # Calculate score for this parameter (0-100)
        if param_config['type'] == 'distance':
            # For distance: closer to user threshold is better
            if location_value <= user_threshold:
                param_score = 100 - (location_value / user_threshold * 50)
            else:
                param_score = max(0, 50 - ((location_value - user_threshold) / user_threshold * 50))
        else:
            # For scale: match user's required level
            if 'inverted' in param_config and param_config['inverted']:
                # Lower is better (like rent cost)
                param_score = max(0, 100 - (location_value / 10 * 100))
            else:
                # Higher is better
                if location_value >= user_threshold:
                    param_score = 100
                else:
                    param_score = (location_value / user_threshold) * 100
        
        # Weight the score
        weighted_score = param_score * (user_weight / 100)
        total_score += weighted_score
        total_weight += user_weight
    
    # Normalize to 100% scale
    if total_weight > 0:
        return min(100, (total_score / total_weight) * 100)
    return 0


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if not os.path.exists(DB_FILE):
        print(f"Creating database file: {DB_FILE}")

        # Generate NYC sample data
        sample_locations = generate_sample_locations()
        
        # Create restaurants layer (sample existing restaurants)
        restaurants_data = []
        for i in range(20):
            loc = random.choice(sample_locations)
            restaurants_data.append({
                'id': i + 1,
                'name': f'Restaurant {i + 1}',
                'geometry': Point(loc['longitude'], loc['latitude']),
                'cuisine': random.choice(['Italian', 'Chinese', 'Mexican', 'American', 'Japanese']),
                'rating': round(random.uniform(3.5, 4.8), 1)
            })
        
        restaurants_gdf = gpd.GeoDataFrame(restaurants_data, crs="EPSG:4326")
        restaurants_gdf.to_file(DB_FILE, layer='restaurants', driver="GPKG")
        print("Created restaurants layer with NYC sample data.")

        # Create potential locations layer
        potential_data = []
        for loc in sample_locations[:50]:  # First 50 as potential locations
            potential_data.append({
                'id': loc['id'],
                'name': f"Location {loc['id']}",
                'geometry': Point(loc['longitude'], loc['latitude']),
                'address': loc['address'],
                'zone_type': random.choice(['Commercial', 'Mixed-Use', 'Retail'])
            })
        
        potential_gdf = gpd.GeoDataFrame(potential_data, crs="EPSG:4326")
        potential_gdf.to_file(DB_FILE, layer='potential_locations', driver="GPKG")
        print("Created potential_locations layer.")

        # Create other sample layers
        layer_configs = [
            ('transport_stops', 'Public Transport', 'fa-bus'),
            ('shopping_areas', 'Shopping Centers', 'fa-shopping-cart'),
            ('office_buildings', 'Office Buildings', 'fa-building'),
            ('parking_lots', 'Parking Areas', 'fa-parking'),
            ('high_traffic_areas', 'High Traffic Zones', 'fa-walking'),
            ('commercial_zones', 'Commercial Zones', 'fa-store'),
            ('residential_areas', 'Residential Areas', 'fa-home'),
            ('safety_zones', 'Safety Zones', 'fa-shield-alt')
        ]
        
        for layer_name, display_name, icon in layer_configs:
            layer_data = []
            for i in range(random.randint(15, 30)):
                loc = random.choice(sample_locations)
                layer_data.append({
                    'id': i + 1,
                    'name': f'{display_name} {i + 1}',
                    'geometry': Point(loc['longitude'], loc['latitude']),
                    'category': display_name,
                    'importance': random.randint(1, 10)
                })
            
            layer_gdf = gpd.GeoDataFrame(layer_data, crs="EPSG:4326")
            layer_gdf.to_file(DB_FILE, layer=layer_name, driver="GPKG")
        
        print("Created sample layers with NYC data.")

    yield
    # Shutdown


app = FastAPI(lifespan=lifespan, title="Monasib API", version="1.0.0")
DB_FILE = "gis_data.gpkg"

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "message": "Monasib Restaurant Location Intelligence API", 
        "version": "1.0.0",
        "frontend_url": "http://127.0.0.1:8888/app",
        "api_docs": "http://127.0.0.1:8888/docs"
    }


@app.post("/analysis")
def perform_analysis(payload: CriteriaPayload):
    """
    Performs restaurant location suitability analysis based on user criteria
    """
    try:
        criteria = payload.criteria
        
        if not criteria:
            raise HTTPException(status_code=400, detail="No criteria provided")
        
        # Generate sample locations for analysis
        sample_locations = generate_sample_locations(count=200)
        
        # Calculate suitability scores
        scored_locations = []
        for location in sample_locations:
            score = calculate_suitability_score(location, criteria)
            if score > 0:  # Only include locations with some suitability
                scored_locations.append({
                    **location,
                    'suitability_score': round(score, 2)
                })
        
        # Sort by suitability score
        scored_locations.sort(key=lambda x: x['suitability_score'], reverse=True)
        
        # Get statistics
        suitable_locations = [loc for loc in scored_locations if loc['suitability_score'] >= 60]
        best_location = scored_locations[0] if scored_locations else None
        
        # Prepare results
        analysis_results = {
            "status": "success",
            "message": "GIS analysis completed successfully",
            "criteria_used": criteria,
            "total_locations_analyzed": len(sample_locations),
            "suitable_locations_found": len(suitable_locations),
            "best_location": {
                "coordinates": f"{best_location['latitude']:.6f}, {best_location['longitude']:.6f}",
                "suitability_score": best_location['suitability_score'],
                "address": best_location['address']
            } if best_location else None,
            "top_10_locations": scored_locations[:10],
            "analysis_summary": {
                "average_score": round(np.mean([loc['suitability_score'] for loc in scored_locations]), 2) if scored_locations else 0,
                "median_score": round(np.median([loc['suitability_score'] for loc in scored_locations]), 2) if scored_locations else 0,
                "parameters_count": len(criteria),
                "total_weight": sum(param['weight'] for param in criteria.values())
            }
        }
        
        return analysis_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


@app.post("/report")
def generate_report(request: ReportRequest):
    """
    Generate an AI-style report from analysis results
    """
    try:
        results = request.analysisResults
        
        # Generate a comprehensive report
        report = {
            "report_id": f"RPT_{random.randint(100000, 999999)}",
            "generated_at": "2025-06-30T12:00:00Z",
            "title": "Restaurant Location Suitability Analysis Report",
            "executive_summary": f"""
            Based on the comprehensive GIS analysis of {results.get('total_locations_analyzed', 0)} potential locations 
            using {results.get('analysis_summary', {}).get('parameters_count', 0)} weighted criteria, 
            we identified {results.get('suitable_locations_found', 0)} locations with high suitability scores.
            
            The optimal location has a suitability score of {results.get('best_location', {}).get('suitability_score', 0)}% 
            and is located at {results.get('best_location', {}).get('coordinates', 'N/A')}.
            """,
            "key_findings": [
                f"Average suitability score: {results.get('analysis_summary', {}).get('average_score', 0)}%",
                f"Median suitability score: {results.get('analysis_summary', {}).get('median_score', 0)}%",
                f"{results.get('suitable_locations_found', 0)} locations meet the minimum suitability threshold",
                "Top locations show strong alignment with specified criteria"
            ],
            "recommendations": [
                "Focus on the top 3-5 locations for detailed site inspection",
                "Consider seasonal variations in foot traffic patterns",
                "Verify actual rental costs and negotiate terms",
                "Conduct customer demographic analysis for top locations"
            ],
            "methodology": {
                "analysis_type": "Multi-criteria GIS suitability analysis",
                "weighting_method": "User-defined weighted criteria",
                "scoring_scale": "0-100% suitability index",
                "data_sources": "Simulated urban location data"
            },
            "download_formats": ["PDF", "Excel", "GeoJSON", "Shapefile"]
        }
        
        return {"report": report, "status": "generated"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")


@app.get("/layers")
def get_available_layers():
    """
    Returns list of available GIS layers
    """
    try:
        # Check which layers exist in the database
        available_layers = []
        layer_info = [
            ("restaurants", "Existing Restaurants", "fa-utensils"),
            ("potential_locations", "Potential Locations", "fa-map-pin"),
            ("transport_stops", "Public Transport", "fa-bus"),
            ("shopping_areas", "Shopping Centers", "fa-shopping-cart"),
            ("office_buildings", "Office Buildings", "fa-building"),
            ("parking_lots", "Parking Areas", "fa-parking"),
            ("high_traffic_areas", "High Traffic Zones", "fa-walking"),
            ("commercial_zones", "Commercial Zones", "fa-store"),
            ("residential_areas", "Residential Areas", "fa-home"),
            ("safety_zones", "Safety Zones", "fa-shield-alt")
        ]
        
        for layer_name, display_name, icon in layer_info:
            try:
                gdf = gpd.read_file(DB_FILE, layer=layer_name)
                available_layers.append({
                    "id": layer_name,
                    "name": display_name,
                    "icon": icon,
                    "feature_count": len(gdf),
                    "geometry_type": str(gdf.geometry.geom_type.iloc[0]) if len(gdf) > 0 else "Unknown"
                })
            except:
                pass  # Layer doesn't exist or can't be read
                
        return {"layers": available_layers}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching layers: {str(e)}")


@app.get("/layers/{layer_name}")
def get_layer(layer_name: str):
    """
    Returns a specified layer from the GeoPackage as GeoJSON
    """
    try:
        gdf = gpd.read_file(DB_FILE, layer=layer_name)
        
        # Convert to GeoJSON
        geojson_data = json.loads(gdf.to_json())
        
        return geojson_data
        
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Layer '{layer_name}' not found: {str(e)}")


@app.get("/parameters")
def get_parameters():
    """
    Returns available analysis parameters configuration
    """
    return {"parameters": RESTAURANT_PARAMETERS}


# Mount the frontend static files first
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

# Add frontend serving routes
@app.get("/app")
def serve_app():
    """Serve the main frontend application"""
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "index.html")
    return FileResponse(frontend_path)

# Serve individual files with correct paths
@app.get("/app.js")
def serve_app_js():
    """Serve the JavaScript file"""
    js_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "app.js")
    return FileResponse(js_path, media_type="application/javascript")

@app.get("/style.css")
def serve_style_css():
    """Serve the CSS file"""
    css_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "style.css")
    return FileResponse(css_path, media_type="text/css")
