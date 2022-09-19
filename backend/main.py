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

# SALES BACKEND


# given a word, find it's non plural version that's in the ingredients set
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


# given an ingredient, find the ingredient keys in the sales json
def findOriginalName(name):
    # ex: tomatoes soup ==> TOMATO and SOUP in sales json
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


# given a saleStory (a string of the sale item), extract the sale savings price
# only works for items that show the actual savings (some items just drop in price without displaying the discount)
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


def getIngredients():  # create an ingredients set from ingredients.txt which is a list of all ingredients
    ingredients = set()
    with open('backend/ingredients.txt', 'r') as f:
        allIngredients = f.readlines()
        for ingredient in allIngredients:
            ingredients.add(ingredient[:-1])

    return ingredients


def getFlyers():  # find links to flyers from local grocery stores via selenium and flipp.com. dump the flyer links to flyers.json
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


def getSales():  # find all the valid ingredient sales in the flyers from flyers.json and dump them in sales.json
    driver = webdriver.Chrome(ChromeDriverManager().install())
    with open('backend/flyers.json') as json_in:
        flyers = json.load(json_in)
    with open('backend/sales.json', 'w') as out:
        out.write('')
    sales = {}

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

                # if there are words in this on sale item that are in the ingredient.json
                if (len(foundIngredients) > 0):
                    # open the sale in another tab (flipp doesn't allow me to extract the sale details unless the sale has been clicked on)
                    driver.execute_script(
                        "window.open('" + url + saleURL + "')")
                    WebDriverWait(driver, 10).until(
                        EC.number_of_windows_to_be(2))

                    # switch to that tab
                    driver.switch_to.window(driver.window_handles[1])

                    # extract the store name, item name, price, savings, and url
                    # Example:
                    # "CEREAL": [
                    # {
                    #     "store": "Metro",
                    #     "item": "GERBER CEREAL",
                    #     "price": "9.0",
                    #     "savings": "1.99",
                    #     "url": "exampleUrl"
                    # },
                    # {
                    #     "store": "Walmart",
                    #     "item": "KELLOGG'S FAMILY CEREAL",
                    #     "price": "4.77",
                    #     "savings": "1.99",
                    #     "url": "exampleUrl"
                    # },
                    # ]
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
                        time.sleep(0.2)  # give time in between each sale
                    except:
                        print('Bad link')

                    # close tab and go back to orignal flyer tab
                    driver.close()
                    driver.switch_to.window(driver.window_handles[0])

    with open('backend/sales.json', 'a') as out:
        json.dump(sales, out)

    driver.quit()


def getRecipes():  # gets recipes. takes sales from sales.json and makes an API call to spoonacular to get recipes

    with open('backend/sales.json', 'r') as json_in:
        savings = json.load(json_in)

    with open('backend/apikeys.txt', 'r') as api_in:
        api_key = api_in.read()

    savingLink = ""
    for saving in savings:
        if (saving != ''):
            savingLink += saving + ",+"

    savingLink = savingLink[:-2]

    r = requests.get('https://api.spoonacular.com/recipes/findByIngredients?apiKey=' + api_key + '&ingredients=' +
                     savingLink + '&number=100')

    recipes_json = r.json()

    processRecipes(recipes_json)


def roundAmount(amount):  # round amount to 2 decimal places
    return str(round(float(amount), 2))


def getRecipeLink(recipeName, recipeID):  # gets the recipe link
    return (recipeName.replace(' ', '-') + '-' + str(recipeID))


# missing and used ingredients returned from spoonacular have a load of data that isn't needed. this function only returns relevant data
def processMissingOrUsedIngredient(ingredients):

    ingredient_json = []
    for ingredient in ingredients:
        ingredient_json.append({"amount": roundAmount(ingredient["amount"]), "unit": ingredient["unitShort"],
                                "name": ingredient["name"], "original": findOriginalName(ingredient["name"]), "image": ingredient["image"]})
    return ingredient_json


# process raw recipe data and dump all the recipes into recipes.json
def processRecipes(recipes):
    new_recipes = []
    for recipe in recipes:
        new_recipes.append({
            "title": recipe["title"], "link": getRecipeLink(recipe["title"], recipe["id"]),
            "image": recipe["image"], "missedIngredients": processMissingOrUsedIngredient(recipe["missedIngredients"]), "usedIngredients": processMissingOrUsedIngredient(recipe["usedIngredients"])})

    with open('backend/recipes.json', 'w') as recipes_json:
        json.dump(new_recipes, recipes_json)


if (__name__ == '__main__'):
    url = "https://flipp.com"
    urlWithPostal = "https://flipp.com/en-ca/en-ca/flyers/groceries?postal_code="
    options = Options()
    options.headless = True

    ingredients = getIngredients()

    getFlyers()
    getSales()
    getRecipes()
