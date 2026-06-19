from datetime import datetime

from models.ml_model import predict

from repositories.water_repository import (
    save_water_data
)

# =================================================
# PROCESS WATER DATA
# =================================================

def process_water_data(data):

    # =================================================
    # ML FEATURES
    # =================================================

    features = [[
        data.ph,
        data.turbidity,
        data.temperature,
        data.tds
    ]]

    ml_prediction = predict(features)

    # =================================================
    # RULE-BASED VALIDATION
    # =================================================

    safe = True

    # ================= pH =================
    if data.ph < 6 or data.ph > 10:
        safe = False

    # ================= TURBIDITY =================
    if data.turbidity > 4.5:
        safe = False

    # ================= TEMPERATURE =================
    if data.temperature > 35:
        safe = False

    # ================= TDS =================
    if data.tds > 500:
        safe = False

    # =================================================
    # FINAL STATUS
    # =================================================

    status = (
        "Safe"
        if safe and ml_prediction == "Safe"
        else "Unsafe"
    )

    # =================================================
    # RECORD
    # =================================================

    record = {

        "ph": data.ph,

        "turbidity": data.turbidity,

        "temperature": data.temperature,

        "tds": data.tds,

        "status": status,

        "timestamp":
            datetime.now().isoformat()
    }

    # =================================================
    # SAVE TO FIREBASE
    # =================================================

    save_water_data(
        record,
        data.user_id,
        data.is_guest
    )

    return record