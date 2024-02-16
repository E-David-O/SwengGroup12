# services/user_event_handler.py

import pika
import json

def emit_video_update(video):
    # 'rabbitmq-server' is the network reference we have to the broker, 
    # thanks to Docker Compose.
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq-server'))
    channel    = connection.channel()

    exchange_name = 'video_updates'
    routing_key   = 'video.scale.update'

    # This will create the exchange if it doesn't already exist.
    channel.exchange_declare(exchange=exchange_name, exchange_type='topic', durable=True)

    new_data = {'video' : video}

    channel.basic_publish(exchange=exchange_name,
                          routing_key=routing_key,
                          body=json.dumps(new_data),
                          # Delivery mode 2 makes the broker save the message to disk.
                          # This will ensure that the message be restored on reboot even  
                          # if RabbitMQ crashes before having forwarded the message.
                          properties=pika.BasicProperties(
                            delivery_mode = 2,
                        ))

    print("%r sent to exchange %r with data: %r" % (routing_key, exchange_name, video.name))
    connection.close()