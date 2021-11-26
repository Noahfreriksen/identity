import sys
import socket, time
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import Model

# client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# client_socket.connect(('localhost', 6666))
# while True:
#     time.sleep(5)
#     data = client_socket.recv(512)
#     if data.lower() == 'q':
#         client_socket.close()
#         break

#     print("RECEIVED: %s" % data)
#     data = input("SEND( TYPE q or Q to Quit):")
#     client_socket.send(data)
#     if data.lower() == 'q':
#         client_socket.close()
#         break

from tensorflow.keras.models import load_model
base_model = load_model('./facenet_keras.h5')

base_model.layers.pop()
for layer in base_model.layers:
  layer.trainable = True

x = base_model.output
x = Dense(32)(x)
output = Dense(10, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=output)
model.load_weights("./best_model.h5")

from tensorflow.keras.preprocessing.image import ImageDataGenerator
train_datagen = ImageDataGenerator(
    horizontal_flip=True,
    shear_range=0.2,
    zoom_range=0.2,
)

val_datagen = ImageDataGenerator(
    horizontal_flip=True
)

training_set = train_datagen.flow_from_directory(
    './dataset/train',
    target_size=(160, 160),
    batch_size=60,
    class_mode='sparse')

label_map = (training_set.class_indices)

img = image.load_img('./image/image.jpeg', target_size=(160, 160))
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

import pusher
import json
pusher_client = pusher.Pusher(app_id=u'1302859', key=u'eece33e6915f81081df4', secret=u'688f6801f9a3f7501e99', cluster=u'eu')

labels = [max_label, second_max_label, second_min_label, min_label]

percentages = [str(max_percentage), str(second_max_percentage), str(second_min_percentage), str(min_percentage)]

pusher_client.trigger(u'private-channel', u'client-labels', {'labels': labels})
pusher_client.trigger(u'private-channel', u'client-percentages', {'percentages': percentages})

sys.stdout.flush()