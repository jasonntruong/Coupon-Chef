app = Flask(__name__)


# @app.route('/', methods=['GET'])
# def home_page():
#     data_set = {'Page': 'Home',
#                 'Message': 'Succesfully loaded the homepage', 'Timestamp': time.time()}
#     json_dump = json.dumps(data_set)

#     return json_dump


# @app.route('/request/', methods=['GET'])
# def request_page():
#     user_query = str(request.args.get('user'))  # /request/?user=USERNAME
#     data_set = {'Page': 'Home',
#                 'Message': f'Succesfully got the request for {user_query}', 'Timestamp': time.time()}
#     json_dump = json.dumps(data_set)

#     return json_dump