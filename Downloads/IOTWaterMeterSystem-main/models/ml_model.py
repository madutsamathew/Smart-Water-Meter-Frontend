from sklearn.tree import DecisionTreeClassifier

# =================================================
# TRAINING DATA
# =================================================

X = [

    # SAFE WATER
    [7.0, 2.0, 25, 300],
    [7.2, 1.5, 24, 250],
    [6.8, 3.0, 26, 350],

    # UNSAFE WATER
    [4.5, 8.0, 35, 1200],
    [9.5, 10.0, 40, 1500],
    [5.0, 7.5, 38, 1100],
]

y = [
    "Safe",
    "Safe",
    "Safe",

    "Unsafe",
    "Unsafe",
    "Unsafe",
]

# =================================================
# MODEL
# =================================================

model = DecisionTreeClassifier()

model.fit(X, y)

# =================================================
# PREDICTION FUNCTION
# =================================================

def predict(features):

    prediction = model.predict(features)

    return prediction[0]