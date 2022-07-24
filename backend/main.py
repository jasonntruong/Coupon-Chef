from flask import *

import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains

# app = Flask(__name__)

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

if (__name__ == '__main__'):
    # app.run(port=2323)

    options = Options()
    options.headless = True
    driver = webdriver.Chrome(ChromeDriverManager().install())
    driver.get("https://flipp.com/en-ca/en-ca/flyers/groceries")

    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.TAG_NAME, "flipp-flyer-listing-item")))

    driver.maximize_window()
    featured = driver.find_element_by_xpath(
        '/html/body/div[2]/flipp-listing-page/flipp-page/div/main/flipp-listing-page-content/div/div[1]/h1').click()
    actions = ActionChains(driver)
    actions.send_keys(' ')
    actions.perform()
    time.sleep(2)

    allFlyers = driver.find_elements_by_class_name(
        'premium-flyer-container') + driver.find_elements_by_class_name(
        'flyer-container')
    for flyer in allFlyers:
        print(str(flyer.get_attribute('innerHTML')).split(
            'flyer-name">')[1].split('<')[0], ':')
        print(flyer.get_attribute('href'), '\n')

    driver.quit()
