# Coupon-Chef

Demo video: https://youtu.be/umf6_c1A7Xs

## Problems:
I learned one thing while living alone in Ottawa for 4 months, UberEats is dangerously convenient. Ordering UberEats everyday took a toll on my wallet so I needed a solution to start cooking more and save money.

## Solution:
Create an app that takes all the groceries on sale in my area and recommends me recipes to cook using those on sale ingredients. This way I not only save by not ordering UberEats, but I also save on everything I cook. A bonus is that I get exposure to new recipes and become a better chef.

## How it was made:
### Back End:
Python + Flask + Selenium + Spoonacular API program that:
Scrapes flipp.com for local grocery store sales in my area. Stores them into a flyers JSON. [Example here using TMU's address, not mine :D](https://github.com/jasonntruong/Coupon-Chef/blob/master/backend/flyers.json)
Filters the sales from the flyers that are actual ingredients and stores them into a sales JSON. [Example here](https://github.com/jasonntruong/Coupon-Chef/blob/master/backend/sales.json)
Throw the sales JSON into Spoonacular API to get a list of recipes that consist of on sale ingredients. [Example here](https://github.com/jasonntruong/Coupon-Chef/blob/master/backend/recipes.json)
Use Flask to make an API that return the sales and recipes JSON when the respective API calls are made

### Front End:
React Native + TypeScript app that simply displays the recipes from my custom API
