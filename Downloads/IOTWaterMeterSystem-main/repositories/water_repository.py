from firebase_admin import db


def save_water_data(
    data,
    user_id=None,
    is_guest=False
):
    if is_guest:
        ref = db.reference("guest_data")
    else:
        ref = db.reference(f"users/{user_id}/water_data")

    ref.push(data)

    # Shared history (app reads this path)
    db.reference("water_data").push(data)

    # Live feed — same shape as ESP32 (/waterQuality/latest)
    db.reference("waterQuality/latest").set({
        "ph": data["ph"],
        "turbidity_ntu": data["turbidity"],
        "tds_ppm": data["tds"],
        "temperature_c": data["temperature"],
        "status": data["status"],
        "timestamp": data["timestamp"],
    })