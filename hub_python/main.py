from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="SupplyAdda.com Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VendorProfile(BaseModel):
    id: str
    companyName: str
    services: List[str]
    description: str

class SearchQuery(BaseModel):
    query: str
    filters: Optional[dict] = None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "hub_python"}

@app.post("/api/search")
def perform_advanced_search(search_query: SearchQuery):
    # In the future, this endpoint could perform fuzzy text matching
    # or semantic search using vectors.
    # Currently it just mocks a response for frontend UI.
    
    mock_vendors = [
        {
            "id": "1",
            "companyName": "TechCorp",
            "services": ["Software Development", "Cloud Hosting"],
            "description": "Leading solutions provider."
        },
        {
            "id": "2",
            "companyName": "DesignWorks",
            "services": ["UI/UX", "Graphic Design"],
            "description": "Creative design agency."
        }
    ]
    
    # Simple mock filtering based on query
    if search_query.query:
        query_lower = search_query.query.lower()
        mock_vendors = [
            v for v in mock_vendors 
            if query_lower in v["companyName"].lower() or 
               any(query_lower in s.lower() for s in v["services"])
        ]
        
    return {"results": mock_vendors}
