from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Import fungsi perhitungan dari engine.py
from engine import (
    calculate_pph21, 
    calculate_pph23, 
    calculate_pph42, 
    calculate_pph22, 
    calculate_pph15, 
    calculate_ppn
)

app = FastAPI()

# --- KONFIGURASI CORS ---
# Agar Frontend (React) di port 5173 bisa mengakses Backend ini
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Tax Expert System API is Running!"}

# --- ENDPOINTS PERHITUNGAN PAJAK ---

@app.post("/api/pph21")
def api_pph21(data: dict):
    result = calculate_pph21(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/api/pph23")
def api_pph23(data: dict):
    result = calculate_pph23(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/api/pph42")
def api_pph42(data: dict):
    result = calculate_pph42(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/api/pph22")
def api_pph22(data: dict):
    result = calculate_pph22(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/api/pph15")
def api_pph15(data: dict):
    result = calculate_pph15(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/api/ppn")
def api_ppn(data: dict):
    result = calculate_ppn(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result