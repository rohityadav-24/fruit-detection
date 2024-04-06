from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import numpy as np
import os
from io import BytesIO
import tensorflow as tf

app = Flask(__name__)

model_path = os.path.join(os.path.dirname(__file__), 'model/model.h5')
MODEL = tf.keras.models.load_model(model_path)

# Function to predict image
def predict_image(img):
    img = tf.image.resize(img, (150, 150))
    img_array = np.expand_dims(img, axis=0)
    predictions = MODEL.predict(img_array)
    return np.argmax(predictions)

@app.route('/')
def home():
    return 'Hello, this is detection API!'

@app.route("/detect", methods=["POST"])
def detect():
    if 'file' not in request.files:
        return jsonify({'type': 'error', 'message': 'Image is required.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'type': 'error', 'message': 'Please select file.'}), 400

    if file:
        image = tf.image.decode_image(file.read(), channels=3)
        prediction = predict_image(image)
        
        if prediction == 0:
            result = True
        elif prediction == 3:
            result = False
        else:
            result = 'na'

        return jsonify({
            'type': 'success',
            'message': 'Image detected',
            'result': result
        }), 200

if __name__ == '__main__':
    app.run()