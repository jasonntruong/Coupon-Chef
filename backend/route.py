from flask import *

app = Flask(__name__)

# SETUP ONLINE APP ROUTING


@app.route('/', methods=['GET'])
def home_page():
    data_set = {'Page': 'Home',
                'Message': 'Succesfully loaded'}
    json_dump = json.dumps(data_set)

    return json_dump


@app.route('/request/', methods=['GET'])
def request_page():
    req = str(request.args.get('request'))
    apiKey = str(request.args.get('apiKey'))
    if (apiKey != api_key):
        data_set = {'Message': 'Incorrect API key'}
        json_dump = json.dumps(data_set)
    else:
        if req == "recipes":
            json_dump = json.dumps(recipes)
        elif req == "sales":
            json_dump = json.dumps(sales)

    return json_dump


if (__name__ == '__main__'):
    with open('backend/apikeys.txt', 'r') as api_in:
        api_key = api_in.read()

    with open('backend/recipes.json', 'r') as recipes_in:
        recipes = json.load(recipes_in)

    with open('backend/sales.json', 'r') as sales_in:
        sales = json.load(sales_in)

    app.run(port=2323)
