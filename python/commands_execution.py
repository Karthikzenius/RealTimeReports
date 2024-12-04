import json
import psycopg2
import time
from collections import defaultdict
from server_connection import FreeSWITCHClient
from datetime import datetime

def insert_status_to_postgresql(conn, name, available_status, available_time):
    # Insert status data into PostgreSQL
    with conn.cursor() as cursor:
        insert_query = """
            INSERT INTO agent_status (name, available_status, available_time)
            VALUES (%s, %s, %s);
        """
        cursor.execute(insert_query, (name, available_status, available_time))
    conn.commit()

def update_status_to_postgresql(conn, name, status, time):
    with conn.cursor() as cursor:
        update_query = """
        UPDATE agent_status
        SET logged_status = %s, logged_time = %s
        WHERE name = %s AND available_status = 'Available'
        """
        cursor.execute(update_query, (status, time, name))
    conn.commit()

def get_previous_status(redis_client, name):
    # Fetch previous status and time from Redis
    status_data = redis_client.get(f"agent_status_{name}")
    if status_data:
        return json.loads(status_data)
    return {"status": None, "last_status_change": None}

def set_previous_status(redis_client, name, status, last_status_change):
    # Store current status and time in Redis
    redis_client.set(f"agent_status_{name}", json.dumps({"status": status, "last_status_change": last_status_change}))

def format_timestamp(timestamp):
    # Convert Unix timestamp to a human-readable format
    return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")


def convert_seconds_to_hhmmss(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"

def epoch_to_readable(epoch_time):
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(epoch_time))

def calculate_duration_since_last_status_change(last_status_change_epoch):
    current_time = time.time()
    duration_seconds = current_time - last_status_change_epoch
    return convert_seconds_to_hhmmss(duration_seconds)


def execute_and_process_commands(client, commands, redis_client):
    try:
        currenttimestamp_in_epoc = time.time()
        responses = client.execute_multiple_commands(commands)

        # Parsing the responses
        agent_data = client.parse_response(responses["callcenter_config agent list"])
        tier_data = client.parse_response(responses["callcenter_config tier list"])
        queue_data = client.parse_response(responses["callcenter_config queue list"])

        # Convert to JSON and remove last entries
        agent_data.pop()
        tier_data.pop()
        queue_data.pop()

        agents = [json.loads(json.dumps(agent)) for agent in agent_data]
        tiers = [json.loads(json.dumps(tier)) for tier in tier_data]
        queues = [json.loads(json.dumps(queue)) for queue in queue_data]

        # List to hold the combined data for each queue
        combined_data_list = []

        # Dictionary to hold the combined data for each queue
        combined_data = defaultdict(lambda: {
            "Name": "",
            "Online": 0,
            "InaQueueCall": 0,
            "OnBreak": 0,
            "ACW": 0,
            "LoggedOut": 0,
            "Available": 0,
            "Idle": 0,
            "Waiting": 0,
            "Receiving": 0,
            "Handled": 0,
            "Abandoned": 0,
            "AHT": 0,
            "SL60": 0,
        })

        # Initialize agent count for AHT calculation
        aht_agent_count = 0

        # Process each queue
        for queue in queues:
            queue_name = queue["name"]

            # Check if there are tiers associated with this queue (agents assigned)
            if any(tier["queue"] == queue_name for tier in tiers):
                combined_data[queue_name]["Handled"] = int(queue["calls_answered"])
                combined_data[queue_name]["Abandoned"] = int(queue["calls_abandoned"])
                total_calls = combined_data[queue_name]["Handled"] + combined_data[queue_name]["Abandoned"]
                if total_calls > 0:
                    combined_data[queue_name]["SL60"] = round(combined_data[queue_name]["Handled"] * 100 / total_calls, 2)
                else:
                    combined_data[queue_name]["SL60"] = 0

                # Find agents for the queue from tier data
                queue_tiers = [tier for tier in tiers if tier["queue"] == queue_name]
                for tier in queue_tiers:
                    agent_name = tier["agent"]
                    agent = next((agent for agent in agents if agent["name"] == agent_name), None)
                    if agent:
                        status = agent["status"]
                        state = agent["state"]
                        combined_data[queue_name]["Name"] = queue_name
                        combined_data[queue_name]["Online"] += 1 if status != "Logged Out" else 0
                        combined_data[queue_name]["InaQueueCall"] += 1 if state == "In a queue call" else 0
                        combined_data[queue_name]["OnBreak"] += 1 if status == "On Break" else 0
                        combined_data[queue_name]["ACW"] += 1 if status == "Available (On Demand)" else 0
                        combined_data[queue_name]["LoggedOut"] += 1 if status == "Logged Out" else 0
                        combined_data[queue_name]["Available"] += 1 if status == "Available" and state != "In a queue call" and state != "Receiving" else 0
                        combined_data[queue_name]["Idle"] += 1 if state == "Idle" else 0
                        combined_data[queue_name]["Waiting"] += 1 if state == "Waiting" and status == "Available" else 0
                        combined_data[queue_name]["Receiving"] += 1 if state == "Receiving" else 0

                        # Calculate AHT only if the agent is not in "In a queue call" state
                        if state != "In a queue call":
                            try:
                                last_bridge_start = int(agent["last_bridge_start"])
                                last_bridge_end = int(agent["last_bridge_end"])
                                combined_data[queue_name]["AHT"] += (last_bridge_end - last_bridge_start)
                                aht_agent_count += 1
                            except (ValueError, KeyError):
                                pass

                # Calculate the average AHT for the queue
                if aht_agent_count > 0:
                    average_aht = combined_data[queue_name]["AHT"] / aht_agent_count
                    combined_data[queue_name]["AHT"] = convert_seconds_to_hhmmss(average_aht)

                # Add combined data to the list
                combined_data_list.append(combined_data[queue_name])

                # Reset agent count for the next queue
                aht_agent_count = 0

        # Convert combined data to JSON
        combined_data_json = json.dumps(combined_data_list, indent=2)

        # Store the combined data in Redis
        print("Sending Realtime_Queue_Metrics_data to Redis")
        redis_client.set("Realtime_Queue_Metrics_data", combined_data_json)

        # Print the combined data for each queue
        # print("Successfully inserted this Realtime_Queue_Metrics_data into Redis:", combined_data_json)

        # Calculate agent metrics
        agent_metrics_list = []
        for agent in agents:
            last_bridge_start = int(agent.get("last_bridge_start", 0))
            last_bridge_end = int(agent.get("last_bridge_end", 0))
            last_offered_call = int(agent.get("last_offered_call", 0))
            no_answer_count = int(agent.get("no_answer_count", 0))
            calls_answered = int(agent.get("calls_answered", 0))
            # print(currenttimestamp_in_epoc, last_bridge_start)
            last_status_change_epoch = int(agent.get("last_status_change", 0))
            agent_queues = [tier["queue"] for tier in tiers if tier["agent"] == agent["name"]]
            agent_levels_positions = [(tier["level"], tier["position"]) for tier in tiers if tier["agent"] == agent["name"]]

            # Only add agent metrics if the agent is assigned to at least one queue
            if agent_queues:
                total_calls = no_answer_count + calls_answered
                answer_rate = round(calls_answered / total_calls * 100, 2) if total_calls > 0 else 0
                agent_metrics = {
                    "Name": agent["name"],
                    "Type": agent["type"],
                    "Status": agent["status"],
                    # "Statusduration": calculate_duration_since_last_status_change(last_status_change_epoch) if agent["last_status_change"] > 0 else 0,
                    "Statusduration": calculate_duration_since_last_status_change(last_status_change_epoch) if agent["last_status_change"] != "0" else 0,

                    "Capacity": 1,  # Adjust if capacity information is available
                    "Availability": 1 if agent["status"] == "Available" and agent["state"] != "In a queue call" and agent["state"] != "Receiving" else 0,  # Placeholder for availability metric
                    "contact_state": (
                        "In a queue call" if agent["state"] == "In a queue call" else
                        "Receiving" if agent["state"] == "Receiving" else
                        "Available (On Demand)" if agent["status"] == "Available (On Demand)" else
                        "-"
                    ),
                    # "Contact_state_Duration": (
                    #     calculate_duration_since_last_status_change(last_status_change_epoch)
                    #     if agent["state"] == "In a queue call" or agent["state"] == "Receiving" or agent["status"] == "Available (On Demand)"
                    #     else "-"
                    # ),
                    #"Contact_state_Duration":calculate_duration_since_last_status_change(last_status_change_epoch) if agent["status"]=="Available (On Demand)" else 0,
                    "Contact_state_Duration": (
                        convert_seconds_to_hhmmss(currenttimestamp_in_epoc - last_offered_call) if agent["state"] == "Receiving" else
                        convert_seconds_to_hhmmss(currenttimestamp_in_epoc - last_bridge_start) if agent["state"] == "In a queue call" else
                        calculate_duration_since_last_status_change(last_status_change_epoch) if agent["status"] == "Available (On Demand)" else
                        "-"
                    ),

                    "Queue": ", ".join(agent_queues),
                    "ACW": calculate_duration_since_last_status_change(last_status_change_epoch) if agent["status"] == "Available (On Demand)" else "-",
                    "Agent_non_response": no_answer_count,#agent["no_answer_count"],
                    "Calls_handled": calls_answered,#agent["calls_answered"],
                    #"LCHT": convert_seconds_to_hhmmss(last_bridge_end - last_bridge_start)
                    "LCHT": convert_seconds_to_hhmmss(last_bridge_end - last_bridge_start) if agent["state"] != "In a queue call" else "-",
                    "Level": ", ".join([str(level) for level, position in agent_levels_positions]),
                    "Position": ", ".join([str(position) for level, position in agent_levels_positions]),
                    #"answer_rate" : round(agent["calls_answered"] / (agent["no_answer_count"] + agent["calls_answered"]) * 100, 2)
                    "answer_rate" : answer_rate

                }
                agent_metrics_list.append(agent_metrics)

        # Store agent metrics in Redis
        agent_metrics_json = json.dumps(agent_metrics_list, indent=2)
        print("Sending Realtime_Agent_Metrics_data to Redis")
        redis_client.set('Realtime_Agent_Metrics_data', agent_metrics_json)

        # print("Successfully inserted Realtime_Agent_Metrics_data into Redis:", agent_metrics_json)

        agent_status_list = []
        for agent in agents:
            name = agent["name"]
            status = agent["status"]
            last_status_change = int(agent["last_status_change"]) if "last_status_change" in agent else None

            # Fetch the previous status
            previous_status_info = get_previous_status(redis_client, name)
            previous_status = previous_status_info["status"]
            previous_time = previous_status_info["last_status_change"]

            available_time = None
            available_status = None

            # Check if status has changed from "Logged Out" to "Available"
            if previous_status == "Logged Out" and status == "Available":
                available_time = format_timestamp(last_status_change)
                available_status = status

                # Insert new row into PostgreSQL
                insert_status_to_postgresql(postgres_conn, name, available_status, available_time)

            # Check if status has changed to "Logged Out" from any of the specified statuses
            if previous_status in ["On Break", "Available", "Available (On Demand)"] and status == "Logged Out":
                available_time = format_timestamp(last_status_change)
                available_status = status

                # Update the existing row in PostgreSQL with "Logged Out" status
                update_status_to_postgresql(postgres_conn, name, available_status, available_time)

            # Update Redis with current status and time
            set_previous_status(redis_client, name, status, last_status_change)

            # Append to the list
            agent_status_list.append({
                "name": name,
                "available_status": available_status,
                "available_time": available_time,
            })

        # Convert agent status data to JSON
        agent_status_json = json.dumps(agent_status_list, indent=2)

        # Print and store the agent status data in Redis
        print("Sending Agent_Status_data to Redis", agent_status_json)



    except Exception as e:
        print("Error executing commands:", e)

postgres_conn = psycopg2.connect(
    # pg_host = '10.16.7.113'
    # pg_port = '5432'
    # pg_dbname = 'zconnectdb'
    # pg_user = 'zconnectuser'
    # pg_password = 'Zeniusit@123'
    dbname='zconnectdb',
    user='zconnectuser',
    password='Zeniusit@123',
    host='10.16.7.113',
    port='5432'
)
