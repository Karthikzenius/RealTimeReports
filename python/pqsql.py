import psycopg2
from collections import defaultdict
from commands_execution import convert_seconds_to_hhmmss
from datetime import datetime
import pytz
# PostgreSQL connection configuration
# pg_host = '10.16.7.95'
# pg_port = '5432'
# pg_dbname = 'freeswitchcore'
# pg_user = 'dbuser'
# pg_password = 'Zeniusit@123'

pg_host = '10.16.7.113'
pg_port = '5432'
pg_dbname = 'zconnectdb'
pg_user = 'zconnectuser'
pg_password = 'Zeniusit@123'


def execute_queue_query():
    try:
        # Connect to PostgreSQL database
        connection = psycopg2.connect(
            host=pg_host,
            port=pg_port,
            dbname=pg_dbname,
            user=pg_user,
            password=pg_password
        )
        cursor = connection.cursor()
        
        # Execute the query to get call data from the last 24 hours
        cursor.execute("""
            SELECT cc_queue, cc_agent, answer_stamp, billsec, direction
            FROM cdr
            WHERE start_stamp >= NOW() - INTERVAL '24 hours' AND cc_agent IS NOT NULL
        """)
        
        # Fetch all rows from the executed query
        rows = cursor.fetchall()
        
        # Initialize defaultdict to track counts, total billsec, and agents
        counts = defaultdict(lambda: {
            "answered_inbound": 0, 
            "noanswer_inbound": 0, 
            "total_billsec_inbound": 0,
            "inbound": 0,
            "agents": set()
        })
        
        # Process rows to count occurrences, sum billsec, and collect agents
        for row in rows:
            cc_queue, cc_agent, answer_stamp, billsec, direction = row
            if direction == "inbound":
                if answer_stamp is None:
                    counts[cc_queue]["noanswer_inbound"] += 1
                else:
                    counts[cc_queue]["answered_inbound"] += 1
                    counts[cc_queue]["total_billsec_inbound"] += (billsec if billsec is not None else 0)
                counts[cc_queue]["inbound"] += 1
            elif direction == "outbound" and answer_stamp is None:
                counts[cc_queue]["noanswer_inbound"] += 1
            
            counts[cc_queue]["agents"].add(cc_agent)
        
        # Format the result as a list of dictionaries
        response = [
            {
                "queue": cc_queue, 
                "answered_inbound": counts[cc_queue]["answered_inbound"], 
                "noanswer_inbound": counts[cc_queue]["noanswer_inbound"],
                "aht_inbound": convert_seconds_to_hhmmss(round(counts[cc_queue]["total_billsec_inbound"] / counts[cc_queue]["answered_inbound"] if counts[cc_queue]["answered_inbound"] > 0 else 0, 2)),                
                "occupancy_inbound": round(
                    (counts[cc_queue]["answered_inbound"] / (counts[cc_queue]["answered_inbound"] + counts[cc_queue]["noanswer_inbound"]) * 100)
                    if (counts[cc_queue]["answered_inbound"] + counts[cc_queue]["noanswer_inbound"]) > 0 
                    else 0,
                    2
                ),
                "inbound": counts[cc_queue]["answered_inbound"] + counts[cc_queue]["noanswer_inbound"],#counts[cc_queue]["inbound"],
                "agents": list(counts[cc_queue]["agents"])  # Convert set to list
            }
            for cc_queue in counts
        ]
        
        # Close the cursor and connection
        cursor.close()
        connection.close()
        
        return response
    except Exception as e:
        return {"error": f"Error executing PostgreSQL query: {e}"}


def execute_postgresql_query():
    try:
        # Connect to PostgreSQL database
        connection = psycopg2.connect(
            host=pg_host,
            port=pg_port,
            dbname=pg_dbname,
            user=pg_user,
            password=pg_password
        )
        cursor = connection.cursor()
        
        # Execute the query to get call data from the last 24 hours
        # cursor.execute("""
        #     SELECT destination_number, answer_stamp, billsec, cc_queue, direction
        #     FROM cdr
        #     WHERE start_stamp >= NOW() - INTERVAL '24 hours'
        # """)
        cursor.execute("""
            SELECT cc_agent, answer_stamp, billsec, direction,cc_queue
            FROM cdr
            WHERE start_stamp >= NOW() - INTERVAL '24 hours' AND cc_agent IS NOT NULL
        """)
        
        # Fetch all rows from the executed query
        rows = cursor.fetchall()
        
        # Initialize defaultdict to track counts, total billsec, and queues
        counts = defaultdict(lambda: {
            "answered_inbound": 0, 
            "noanswer_inbound": 0, 
            "total_billsec_inbound": 0,
            "inbound": 0,
            "queues": set()
        })
        
        #Process rows to count occurrences, sum billsec, and collect queues
        for row in rows:
            cc_agent, answer_stamp, billsec, direction, cc_queue = row
            if direction == "inbound":
                if answer_stamp is None:
                    counts[cc_agent]["noanswer_inbound"] += 1
                else:
                    counts[cc_agent]["answered_inbound"] += 1
                    counts[cc_agent]["total_billsec_inbound"] += (billsec if billsec is not None else 0)
                counts[cc_agent]["inbound"] += 1
            elif direction == "outbound" and answer_stamp is None:
                counts[cc_agent]["noanswer_inbound"] += 1
            
            counts[cc_agent]["queues"].add(cc_queue)
        
        # Format the result as a list of dictionaries
        response = [
            {
                "agent": cc_agent, 
                "answered_inbound": counts[cc_agent]["answered_inbound"], 
                "noanswer_inbound": counts[cc_agent]["noanswer_inbound"],
                "aht_inbound": convert_seconds_to_hhmmss(round(counts[cc_agent]["total_billsec_inbound"] / counts[cc_agent]["answered_inbound"] if counts[cc_agent]["answered_inbound"] > 0 else 0, 2)),
                "occupancy_inbound": round(
                    (counts[cc_agent]["answered_inbound"] / (counts[cc_agent]["answered_inbound"] + counts[cc_agent]["noanswer_inbound"]) * 100)
                    if (counts[cc_agent]["answered_inbound"] + counts[cc_agent]["noanswer_inbound"]) > 0 
                    else 0,
                    2
                ),
                "inbound": counts[cc_agent]["answered_inbound"] + counts[cc_agent]["noanswer_inbound"], #counts[cc_agent]["inbound"],
                "queues": list(counts[cc_agent]["queues"])
            }
            for cc_agent in counts
        ]
        
        
        # Close the cursor and connection
        cursor.close()
        connection.close()
        
        return response
    except Exception as e:
        return {"error": f"Error executing PostgreSQL query: {e}"}
    

def execute_cdr_query():
    try:
        # Connect to PostgreSQL database
        connection = psycopg2.connect(
            host=pg_host,
            port=pg_port,
            dbname=pg_dbname,
            user=pg_user,
            password=pg_password
        )
        cursor = connection.cursor()
        
        # Execute the query to get data from the ctr table
        # cursor.execute("""SELECT id,caller_id_number,destination_number,start_stamp,answer_stamp,end_stamp,
        #                duration,billsec,direction,uuid,sip_call_id FROM cdr ORDER BY start_stamp DESC""")
        cursor.execute("""SELECT caller_id_number, destination_number,
                       start_stamp AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' AS start_stamp,
                       answer_stamp AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' AS answer_stamp,
                       end_stamp AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' AS end_stamp,
                       duration, billsec, direction, uuid, sip_call_id, cc_agent, cc_queue FROM cdr ORDER BY end_stamp DESC""")
        
        # Fetch all rows from the executed query
        rows = cursor.fetchall()
        
        # # Get column names from the cursor description
        columns = [desc[0] for desc in cursor.description]
        
        # # Convert rows to a list of dictionaries
        result = [dict(zip(columns, row)) for row in rows]
        #result = []       
        # Close the cursor and connection
        cursor.close()
        connection.close()
        
        return result
    except Exception as e:
        return {"error": f"Error executing PostgreSQL query: {e}"}
    











