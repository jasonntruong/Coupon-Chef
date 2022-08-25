from flask import *

import time
import json
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

app = Flask(__name__)


@app.route('/', methods=['GET'])
def home_page():
    data_set = {'Page': 'Home',
                'Message': 'Succesfully loaded the homepage', 'Timestamp': time.time()}
    json_dump = json.dumps(data_set)

    return json_dump


@app.route('/request/', methods=['GET'])
def request_page():
    req = str(request.args.get('request'))
    apiKey = str(request.args.get('apiKey'))
    if (apiKey != api_key):
        data_set = {'Message': f'Incorrect API key', 'Timestamp': time.time()}
        json_dump = json.dumps(data_set)
    else:
        if req == "recipes":
            json_dump = json.dumps(recipes)
        elif req == "sales":
            json_dump = json.dumps(sales)

    return json_dump


def getIngredients():
    ingredients = set()
    with open('backend/ingredients.txt', 'r') as f:
        allIngredients = f.readlines()
        for ingredient in allIngredients:
            ingredients.add(ingredient[:-1])

    return ingredients


def findOriginalName(name):
    with open('backend/sales.json', 'r') as f:
        sales = json.load(f)
    name = name.upper()
    allWords = name.split(' ') + name.split(',')
    nonPlurals = removePlural(allWords)
    foundWords = []
    for word in nonPlurals:
        if (word in sales and word not in foundWords):
            foundWords.append(word)
    return foundWords


def findSaleSavings(saleStory):
    allowed = ".0123456789"
    savingStr = ""
    priceArr = str(saleStory).split('$')

    if (len(priceArr) > 1):
        priceStr = priceArr[1]
    else:
        priceStr = priceArr[0]

    for c in priceStr:
        if (c not in allowed):
            break
        savingStr += c
    return savingStr


def getFlyers():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    flyersToGet = ['Metro', 'Loblaws', 'Walmart', 'Farm Boy',
                   'Sobeys', 'FreshCo', 'Food Basics', 'Fortino\'s']
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

        if (flyerName in flyersToGet and flyerName not in flyers):
            flyers[flyerName] = flyerLink

    with open('backend/flyers.json', 'w') as out:
        json.dump(flyers, out)

    driver.quit()


def removePlural(words):
    nonPlurals = []
    for word in words:
        if word in ingredients:
            nonPlurals.append(word)
        elif word[:-1] in ingredients:
            nonPlurals.append(word[:-1])
        elif word + 'S' in ingredients:
            nonPlurals.append(word)
        elif word[:-2] in ingredients:
            nonPlurals.append(word[:-2])
        elif word + 'ES' in ingredients:
            nonPlurals.append(word)

    return nonPlurals


def getSales():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    with open('backend/flyers.json') as json_in:
        flyers = json.load(json_in)
    with open('backend/sales.json', 'w') as out:
        out.write('')
    sales = {}
    # sales: {
    #   itemName : {
    #     store: string,
    #     item: string,
    #     price: string,
    #     savings: string,
    #     url: string
    #   }
    # }
    for flyerName in flyers:
        driver.get(url + flyers[flyerName])
        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "download-app-banner-arrow")))
        driver.find_element(By.CLASS_NAME, 'download-app-banner-arrow').click()
        allSales = driver.find_elements(By.CLASS_NAME, "item-container")

        for sale in allSales:
            saleURL = sale.get_attribute('href')
            if (saleURL):
                foundIngredients = []
                saleName = (sale.get_attribute('aria-label')).upper()

                saleWords = saleName.split(' ')

                foundIngredients = removePlural(saleWords)

                if (len(foundIngredients) > 0):
                    driver.execute_script(
                        "window.open('" + url + saleURL + "')")
                    WebDriverWait(driver, 10).until(
                        EC.number_of_windows_to_be(2))

                    driver.switch_to.window(driver.window_handles[1])
                    try:
                        WebDriverWait(driver, 10).until(
                            EC.visibility_of_element_located((By.TAG_NAME, "flipp-price")))
                        salePrice = str(driver.find_element(
                            By.TAG_NAME, "flipp-price").get_attribute("value"))
                        saleSavings = "None"
                        try:
                            saleSavings = driver.find_element(
                                By.CLASS_NAME, "sale-story").get_attribute('innerHTML')
                        except:
                            print('No savings displayed')

                        for i in foundIngredients:
                            if (i in sales):
                                sales[i].append({
                                    "store": flyerName, "item": saleName, "price": findSaleSavings(salePrice), "savings": findSaleSavings(saleSavings), "url": saleURL})
                            else:
                                sales[i] = [{
                                    "store": flyerName, "item": saleName, "price": findSaleSavings(salePrice), "savings": findSaleSavings(saleSavings), "url": saleURL}]
                        time.sleep(0.2)
                    except:
                        print('Bad link')
                    driver.close()
                    driver.switch_to.window(driver.window_handles[0])
                # input()

    with open('backend/sales.json', 'a') as out:
        json.dump(sales, out)

    driver.quit()


def processMissingOrUsedIngredient(ingredients):
    ingredient_json = []
    for ingredient in ingredients:
        ingredient_json.append({"amount": ingredient["amount"], "unit": ingredient["unitShort"],
                                "name": ingredient["name"], "original": findOriginalName(ingredient["name"]), "image": ingredient["image"]})
    return ingredient_json


def getRecipeLink(recipeName, recipeID):
    return (recipeName.replace(' ', '-') + '-' + str(recipeID))


def processRecipes(recipes):
    new_recipes = []
    for recipe in recipes:
        new_recipes.append({
            "title": recipe["title"], "link": getRecipeLink(recipe["title"], recipe["id"]), "image": recipe["image"], "missedIngredients": processMissingOrUsedIngredient(recipe["missedIngredients"]), "usedIngredients": processMissingOrUsedIngredient(recipe["usedIngredients"])})

    with open('backend/recipes.json', 'w') as recipes_json:
        json.dump(new_recipes, recipes_json)


def getRecipes():
    with open('backend/sales.json', 'r') as json_in:
        savings = json.load(json_in)

    savingLink = ""
    for saving in savings:
        if (saving != ''):
            savingLink += saving + ",+"

    savingLink = savingLink[:-2]

    r = requests.get('https://api.spoonacular.com/recipes/findByIngredients?apiKey=' + api_key + '&ingredients=' +
                     savingLink + '&number=100')

    recipes_json = r.json()
    processRecipes(recipes_json)


if (__name__ == '__main__'):
    start_route = True
    with open('backend/apikeys.txt', 'r') as api_in:
        api_key = api_in.read()

    with open('backend/recipes.json', 'r') as recipes_in:
        recipes = json.load(recipes_in)

    with open('backend/sales.json', 'r') as sales_in:
        sales = json.load(sales_in)

    if (start_route):
        app.run(port=2323)

    POSTALCODE = ""
    url = "https://flipp.com"
    urlWithPostal = "https://flipp.com/en-ca/en-ca/flyers/groceries?postal_code=" + POSTALCODE
    options = Options()
    options.headless = True

    ingredients = getIngredients()

    # getFlyers()
    # getSales()
    # getRecipes()
