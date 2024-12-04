import time
import threading
import redis
from flask import Flask, jsonify
from server_connection import FreeSWITCHClient
from commands_execution import execute_and_process_commands
from pqsql import execute_cdr_query, execute_queue_query#, execute_login_logout
from pqsql import execute_postgresql_query

app = Flask(__name__)

# FreeSWITCH client configuration
host = "10.16.7.91"
port = 8021
password = "ClueCon"

client = FreeSWITCHClient(host, port, password)
commands = [
    "callcenter_config agent list",
    "callcenter_config tier list",
    "callcenter_config queue list"
]

# Connect to Redis
redis_client = redis.StrictRedis(host='10.16.7.91', port=6379, db=0)


# Main loop to execute commands every 5 minutes
def main_loop():
    while True:
        print("Executing FreeSWITCH commands...")
        execute_and_process_commands(client, commands, redis_client)
        
        # print("Executing PostgreSQL query...")
        # execute_postgresql_query()
        
        print("Waiting for 5 minutes...")
        time.sleep(15)  # Sleep for 5 minutes (300 seconds)

# Start the main loop in a separate thread
loop_thread = threading.Thread(target=main_loop)
loop_thread.daemon = True
loop_thread.start()

@app.route("/agent", methods=["GET"])
def get_postgresql_data():
    records = execute_postgresql_query()
    json_data = jsonify(records)
    return json_data

@app.route("/queue", methods=["GET"])
def get_agent_data():
    records = execute_queue_query()
    json_data = jsonify(records)
    return json_data

# @app.route("/cdr", methods=["GET"])
# def get_ctr_data():
#     records = execute_cdr_query()
#     json_data = jsonify(records)
#     return json_data

utc = pytz.timezone('UTC')
ist = pytz.timezone('Asia/Kolkata')

@app.route("/cdr", methods=["GET"])
def get_ctr_data():
    records = execute_cdr_query()

    for record in records:
        if record['start_stamp'] and isinstance(record['start_stamp'], datetime):

            record['start_stamp'] = record['start_stamp'].replace(tzinfo=utc).astimezone(ist).strftime('%Y-%m-%d %H:%M:%S')

        if record['answer_stamp'] and isinstance(record['answer_stamp'], datetime):
          
            record['answer_stamp'] = record['answer_stamp'].replace(tzinfo=utc).astimezone(ist).strftime('%Y-%m-%d %H:%M:%S')
        
      
        if record['end_stamp'] and isinstance(record['end_stamp'], datetime):
          
            record['end_stamp'] = record['end_stamp'].replace(tzinfo=utc).astimezone(ist).strftime('%Y-%m-%d %H:%M:%S')

  
    json_data = jsonify(records)
    return json_data

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

