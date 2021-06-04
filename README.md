## RecipeFinder React

### Introduction
RecipeFinder is een mobiele javascript app met een C# API die je helpt met het bepalen wat je kan eten. Door aan te geven welke producten en ingrediënten er in je keuken liggen, zal de app recepten voorleggen zodat je minder lang hoeft te denken over wat je wilt eten en meteen kan beginnen met koken. Ik maak deze app op aanvraag van vrienden die deze app zouden willen gebruiken.

"RecipeFinder React" is the front end react web application from the RecipeFinder application. RecipeFinder is a web application wehich can help you choose what to eat. By telling hte app about the ingredients and products you have laying around in your kitchen, the app can provide recipes to cook so you don't need to think much longer about what to eat and start cooking immediately.

The other part of the RecipeFinder application is the [RecipeFinderWebApi](https://git.fhict.nl/I437402/recipefinderwebapi).

<!-- blank line -->
## Documentation

### Context
A context diagram showing the different components in the app.
The RecipeFinder app has a front-end application which can connect to an API for its persisting data, which the api again stores and retreives the data in a database.
![Context Diagram](/documentation/images/context.png "Context Diagram"){: .shadow}

<!-- blank line -->
### Architecture
Architecture diagram for the back-end of our application. Showing 
![Architecture Diagram](/documentation/images/architecture.png "Architecture Diagram"){: .shadow}

<!-- blank line -->
### Database Design
A diagram representing the base design of our database. The most important tables for the core of the application are the only tables included.
![Database Design Diagram](/documentation/images/database-design.png "Database Design Diagram"){: .shadow}

<!-- blank line -->
## Testing

### Front-End Cypress integration test testplan
All planned cypress integration tests are listed below:
<details>
    <summary markdown="span">Home Page</summary>

    -	Page loads with 2 buttons and welcoming text
    -	Kitchen button redirects user to the kitchen page /kitchen/index
    -	RecipeBook button redirects user to the recipebook page /recipebook/index

</details>
<details>
    <summary markdown="span">Drawer</summary>

    -	Each button in the drawer redirects to the corresponding page

</details>
<details>
    <summary markdown="span">Kitchen Page</summary>

    -	page loads with ingredients listed
    -	update ui shows up with defaults values set as the current state of the ingredient in the kitchen when clicking edit button on listed ingredient
    -	update ui change input fields to update ingredient in kitchen
    -	remove ui shows up when clicking remove button on listed ingredient
    -	add ingredients page loads
    -	add ingredients page can select ingredient
    -	add ingredients page can add ingredient with amount to kitchen
    -	add ingredients page filter the results
    -	what to buy page loads
    -	what to buy page filter results
    -	what to buy page create/add to grocerylist from missing items for recipe
    -	what to buy page change to show missing ingredients
    -	what to buy page create/add to grocerylist from missing item

</details>
<details>
    <summary markdown="span">RecipeBook Page</summary>

    -	page loads with recipes listed
    -	change to show all recipes
    -	view details for recipe
    -	view tutorial for recipe
    -	filter results

</details>
<details>
    <summary markdown="span">Custom RecipeBook Page</summary>

    -	page loads with custom recipes listed
    -	filter the results
    -	create custom recipe page loads with empty inputs when clicking create button
    -	create custom recipe page fill out input fields to create custom recipe
    -	details custom recipe page loads when clicking details page
    -	edit custom recipe page loads with default values set as current state of the recipe when clicking edit button
    -	edit custom recipe page change input fields to edit custom recipe
    -	remove recipe ui shows up as warning when clicking remove button

</details>
<details>
    <summary markdown="span">CRUD Pages</summary>

    -	page loads with corresponding items listed
    -	create page loads with empty inputs when clicking create button
    -	create page fill out input fields to create item
    -	edit page loads with default values set as current state of the item when clicking edit button
    -	edit page change input fields to edit item
    -	remove ui shows up as warning when clicking remove button

</details>
<details>
    <summary markdown="span">Accounts Page</summary>

    -	page loads with users listed
    -	details user page loads when clicking details button on listed user
    -	edit page loads with default values set as current state of the user when clicking edit button on listed user
    -	edit page change input fields to edit user
    -	remove ui shows up as warning when removing/banning a user

</details>

### Back-End Unit Test testplan
Since our back-end is an api, we can test responses from the endpoint and the CRUD functionality before the ORM.
We currently only have tests for the CRUD functionality