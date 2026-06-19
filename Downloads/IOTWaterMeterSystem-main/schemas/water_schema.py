from pydantic import BaseModel

class SensorData(BaseModel):

    ph: float

    turbidity: float

    temperature: float

    tds: float

    user_id: str | None = None

    is_guest: bool = False