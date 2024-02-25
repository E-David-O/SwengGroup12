# services/user_event_handler.py

import pika
import json
import sys
def emit_video_update(video):
    # 'rabbitmq-server' is the network reference we have to the broker, 
    # thanks to Docker Compose.
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq-server'))
    channel    = connection.channel()
    channel.queue_declare(queue='vid_to_frame', durable=True)

    message = json.dumps({'video':video})
    channel.basic_publish(
        exchange='',
        routing_key='vid_to_frame',
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=pika.DeliveryMode.Persistent
        ))
    print(f" [x] Sent {message}")
    connection.close()