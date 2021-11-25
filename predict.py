
import socket, time
import tensorflow as tf
from tf.keras.models import load_model
from tf.keras.preprocessing import image
import numpy as np

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect(('localhost', 6666))
print("started listening")
while True:
    time.sleep(5)
    data = client_socket.recv(512)
    if data.lower() == 'q':
        client_socket.close()
        break

    print("RECEIVED: %s" % data)
    data = input("SEND( TYPE q or Q to Quit):")
    client_socket.send(data)
    if data.lower() == 'q':
        client_socket.close()
        break

print("hi")
sys.stdout.flush()

model = load_model('./best_model.h5')
model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])

from keras.preprocessing.image import ImageDataGenerator
train_datagen = ImageDataGenerator(
    horizontal_flip=True,
    shear_range=0.2,
    zoom_range=0.2,
)

val_datagen = ImageDataGenerator(
    horizontal_flip=True
)

training_set = train_datagen.flow_from_directory(
    '/content/drive/MyDrive/identity/dataset/train',
    target_size=(160, 160),
    batch_size=60,
    class_mode='sparse')

label_map = (training_set.class_indices)

img = image.load_img('/content/drive/MyDrive/identity/featured/Creative/7xc0fKmakc.jpeg', target_size=(160, 160))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)

images = np.vstack([x])
classes = model.predict(images)[0]
sorted_classes = classes.tolist()
sorted_classes.sort()

max_value = sorted_classes[-1]
second_max_value = sorted_classes[-2]
min_value = sorted_classes[0]
second_min_value = sorted_classes[1]

max_index = classes.tolist().index(max_value)
second_max_index = classes.tolist().index(second_max_value)
min_index = classes.tolist().index(min_value)
second_min_index = classes.tolist().index(second_min_value)

max_label = list(label_map.keys())[max_index]
second_max_label = list(label_map.keys())[second_max_index]
second_min_label = list(label_map.keys())[second_min_index]
min_label = list(label_map.keys())[min_index]

max_percentage = classes[max_index]
second_max_percentage = classes[second_max_index]
second_min_percentage = classes[second_min_index]
min_percentage = classes[min_index]

print(max_label, second_max_percentage, second_min_percentage, min_percentage)

sys.stdout.flush()