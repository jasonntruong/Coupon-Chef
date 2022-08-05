from flask import *

import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys


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

def findSaleSavings(saleStory):
    for c in saleStory[6:]:
        print(c)


def getFlyers():
    driver.get(urlWithPostal)

    WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.TAG_NAME, "flipp-flyer-listing-item")))

    driver.maximize_window()
    featured = driver.find_element(By.XPATH,
                                   '/html/body/div[2]/flipp-listing-page/flipp-page/div/main/flipp-listing-page-content/div/div[1]/h1')
    featured.click()
    actions = ActionChains(driver)
    actions.send_keys('                      ')
    actions.perform()
    time.sleep(1)

    allFlyers = driver.find_elements(By.CLASS_NAME,
                                     'premium-flyer-container') + driver.find_elements(By.CLASS_NAME,
                                                                                       'flyer-container')

    flyers = {}
    for flyer in allFlyers:
        flyerName = str(flyer.get_attribute('innerHTML')).split(
            'flyer-name">')[1].split('<')[0]
        flyerLink = str(flyer.get_attribute('href'))

        if (flyerName not in flyers):
            flyers[flyerName] = flyerLink

    with open('backend/flyers.json', 'w') as out:
        json.dump(flyers, out)


def getSales():
    with open('backend/flyers.json') as json_in:
        flyers = json.load(json_in)
    sales = {}
    # sales: {
    #   itemName : {
    #     store: string,
    #     original: float,
    #     price: float
    #   }
    # }
    for flyerName in flyers:
        driver.get(url + flyers[flyerName])
        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "download-app-banner-arrow")))
        driver.find_element(By.CLASS_NAME, 'download-app-banner-arrow').click()
        print('loaded')
        allSales = driver.find_elements(By.CLASS_NAME, "item-container")

        for sale in allSales:
            saleName = sale.get_attribute('aria-label')
            # driver.find_element(By.TAG_NAME,
            #                     'body').send_keys(Keys.COMMAND + 't')
            driver.execute_script(
                "window.open('" + url + sale.get_attribute('href') + "')")
            WebDriverWait(driver, 20).until(
                EC.visibility_of_element_located((By.XPATH, "/html/body/div[2]/flipp-flyer-page/flipp-page/div/main/div/div[2]/div[1]/flipp-flyerview/canvas/div/a[3]")))
            print('found')
            salePrice = driver.find_element(
                By.XPATH, "/html/body/flipp-dialog/div/flipp-toast-container/div/flipp-item-dialog/div/h1[1]/span/div/div/flipp-price").get_attribute("value")
            findSaleSavings(
                str(driver.find_element(By.CLASS_NAME, "sale-story").get_attribute('innerHTML')))
            print(str(driver.find_element(By.CLASS_NAME,
                  "sale-story").get_attribute('innerHTML')))
            print(salePrice)

            # sales[saleName] = {"store": flyerName, "price": float(salePrice), "savings":}
            print(sales)
            input()

        input()


if (__name__ == '__main__'):
    # app.run(port=2323)
    POSTALCODE = ""
    url = "https://flipp.com"
    urlWithPostal = "https://flipp.com/en-ca/en-ca/flyers/groceries?postal_code=" + POSTALCODE
    options = Options()
    options.headless = True
    driver = webdriver.Chrome(ChromeDriverManager().install())
    print("SAVE &5251"[6:])
    # getFlyers()
    getSales()
    driver.quit()
