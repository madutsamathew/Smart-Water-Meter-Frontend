from fastapi import APIRouter
from schemas.water_schema import SensorData
from services.water_service import process_water_data

router = APIRouter()

@router.post("/predict")
def predict_water(data: SensorData):
    result = process_water_data(data)
    return {
        "status": result["status"],
        "data": result
    }