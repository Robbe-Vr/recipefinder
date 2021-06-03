describe("Custom Recipes Page Test", () => {
    beforeEach(() => {
        cy.visit("/recipebook/custom/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes\/(.*?)/ }, { fixture: 'get_recipebyid.json' }).as('recipe');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes\/bycook\/(.*?)/ }, { fixture: 'get_recipes.json' }).as('cook-recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/RecipeCategories(.*?)/ }, { fixture: 'get_recipecategories.json' }).as('recipecategories');

        //cy.wait(['@recipes', '@recipecategories']);
    });

    it("check if recipes are listed", () => {
        cy.get('h3').should('have.text', 'Custom Recipe Book');
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').find("td").eq(1).should("have.text", "Pancakes");
    });

    it("filter resulting recipes", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').find("td").eq(1).should("have.text", "Pancakes");


    });

    it("create custom recipe page loads when clicking create custom recipe button", () => {
        cy.get('main').contains('Add Custom Recipe').click();

        cy.location("pathname").should("include", "/recipebook/custom/create");

        cy.get('main').find('h2').should('have.text', 'Create Custom Recipe');
    });

    it("create custom recipe page fill out input fields to create custom recipe", () => {
        cy.get('main').contains('Add Custom Recipe').click();

        cy.location("pathname").should("include", "/recipebook/custom/create");

        cy.get('main').find('input').eq(0).clear().type('TestRecipe').should('have.value', 'TestRecipe');
        cy.get('main').find('input').eq(1).clear().type('A test recipe').should('have.value', 'A test recipe');
        cy.get('main').find('input').eq(2).clear().type('http://img-url.com').should('have.value', 'http://img-url.com');
        cy.get('main').find('input').eq(0).clear().type('https://youtu.be/?watch=tutorial-video').should('have.value', 'https://youtu.be/?watch=tutorial-video');
    });

    it("view details for custom recipe", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(0).click();

        cy.location("pathname").should("include", "/recipebook/details");

        cy.get('main').find('h2').should('have.text', 'Pancakes Details');
    });

    it("edit page loads when clicking edit button on listed custom recipe", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(1).click();

        cy.location("pathname").should("include", "/recipebook/custom/edit");

        cy.get('main').find('h2').should('have.text', 'Edit Recipe:Pancakes');
    });

    it("remove ui shows up when clicking remove button on listed custom recipe", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(2).click();

        cy.get('div.MuiDialogTitle-root').find('h2').should('have.text', 'Remove item Pancakes');
    });
});
