import os
import tensorflow as tf
import numpy as np
from keras.preprocessing import image
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/mood", methods=["POST"])

def img():
    # Load the pre-trained model
    cnn = tf.keras.models.load_model('model.h5')

    # Get the JSON data from the request
    data = request.get_json()
    image_data = data['file']
    image_filename = data['filename']
    # Save the image to the server
    image_path = os.path.join('uploads', image_filename)
    with open(image_path, 'wb') as f:
        f.write(image_data)

    # Preprocess the image
    test_image = image.load_img(image_path, target_size=(64, 64))
    test_image = image.img_to_array(test_image)
    test_image = np.expand_dims(test_image, axis=0)

    # Predict the mood
    result = cnn.predict(test_image)
    m = result[0].max()
    
    # Class labels
    train = {'angry' : 0, 'fear' : 1, 'happy' : 2, 'neutral' : 3, 'sad' : 4, 'surprise' : 5}

    # Map probabilities to class labels
    key_list = list(train.keys())
    val_list = list(train.values())
    ind = np.where(result[0] == m)
    position = ind[0][0]  # corrected index extraction
    ans = key_list[position]

    # Print the result
    print(ans)

    # Remove the image file from the server
    # os.remove(image_path)

    # Return the response
    res = {'mood': ans}
    return jsonify(res)

if __name__ == "__main__":
    app.run(port=5000)
