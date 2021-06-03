describe("Kitchen Page Test", () => {
    beforeEach(() => {
        cy.visit("/kitchen/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Kitchens(.*?)/ }, { fixture: 'get_kitchen.json' }).as('kitchen');

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Ingredients/ }, { fixture: 'get_ingredients.json' }).as('ingredients');

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Ingredients\/whattobuyrecipes\/(.*?)/ }, { fixture: 'get_whattobuyrecipes.json' }).as('whattobuy-recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Ingredients\/whattobuyingredients\/(.*?)/ }, { fixture: 'get_whattobuyingredients.json' }).as('whattobuy-ingredients');

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/RecipeCategories/ }, { fixture: 'get_recipecategories.json' }).as('recipecategories');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/IngredientCategories/ }, { fixture: 'get_ingredientcategories.json' }).as('ingredientcategories');

        //cy.wait('@kitchen');
    });

    it("check if kitchen contains items", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").eq(1).should("have.text", "Apple");

        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(1).find("td").eq(1).should("have.text", "Banana");
    });

    it("update ui shows up when clicking edit button", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(0).click();

        cy.get('div.MuiDialogTitle-root').find('h2').should('have.text', 'Edit Apple');
    });

    it("update ui change input fields to update ingredient in kitchen", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(0).click();

        cy.get('div.MuiDialogContent-root').find('input').eq(0).focus().type("{selectall}").type("3").should('have.value', '3');
        cy.get('div.MuiDialogContent-root').find('.MuiSelect-select').eq(0).click();
        cy.get('div.MuiPaper-root.MuiMenu-paper').find('ul').contains('li', 'Kg').focus().click({ force: true });
    });

    it("remove ui shows up when clicking remove button", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(1).click();

        cy.get('div.MuiDialogTitle-root').find('h2').should('have.text', 'Remove Apple');
    });

    it("add ingredients page loads when clicking add ingredients button", () => {
        cy.contains('Add Ingredients').click();

        cy.location("pathname").should("include", "/kitchen/add");

        cy.get('h3').should('have.text', 'Select an ingredient');
    });

    it("add ingredients page select and add an ingredient with amount to kitchen", () => {
        cy.contains('Add Ingredients').click();

        cy.location("pathname").should("include", "/kitchen/add");

        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).focus().click({ force: true });

        cy.get('.MuiGrid-root.MuiGrid-container > .MuiGrid-root,MuiGrid-container.MuiGrid-item.MuiGrid-direction-xs-column.MuiGrid-grid-xs-6').eq(1).find('h5').should('have.text', 'Apple');
        cy.get('.MuiGrid-root.MuiGrid-container > .MuiGrid-root,MuiGrid-container.MuiGrid-item.MuiGrid-direction-xs-column.MuiGrid-grid-xs-6').eq(1).find('input').eq(0).should('have.value', '1');
    });

    it("add ingredients page filter resulting ingredients", () => {
        cy.contains('Add Ingredients').click();

        cy.location("pathname").should("include", "/kitchen/add");

        
    });

    it("what to buy page loads when clicking what to buy button", () => {
        cy.contains('What to Buy').click();

        cy.location("pathname").should("include", "/kitchen/whattobuy");

        cy.get('h3').should('have.text', 'What to Buy');
    });

    it("what to buy page change to show missing ingredients", () => {
        cy.contains('What to Buy').click();

        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").eq(1).should("have.text", "Pancakes");

        cy.location("pathname").should("include", "/kitchen/whattobuy");

        cy.get('main').contains('Recipes').click();

        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").eq(1).should("have.text", "Milk");
    });

    it("what to buy page filter resulting recipes/ingredients", () => {
        cy.contains('What to Buy').click();

        cy.location("pathname").should("include", "/kitchen/whattobuy");

        
    });
});
