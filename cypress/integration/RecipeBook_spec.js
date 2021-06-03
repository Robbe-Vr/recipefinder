describe("Recipebook Page Test", () => {
    beforeEach(() => {
        cy.visit("/recipebook/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes\/(.*?)/ }, { fixture: 'get_recipebyid.json' }).as('recipe');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes$/ }, { fixture: 'get_recipes.json' }).as('recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes\/preparable\/(.*?)/ }, { fixture: 'get_recipes.json' }).as('prep-recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/RecipeCategories(.*?)/ }, { fixture: 'get_recipecategories.json' }).as('recipecategories');

        //cy.wait(['@recipes', '@recipecategories']);
    });

    it("check if recipes are listed", () => {
        cy.get('h3').should('have.text', 'Preparable Recipe Book');
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').find("td").eq(1).should("have.text", "Pancakes");
    });

    it("change to show all recipes", () => {
        cy.get('h3').should('have.text', 'Preparable Recipe Book');
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").eq(1).should("have.text", "Pancakes");

        cy.get('main').contains('Recipes You Can Prepare').click();

        cy.get('h3').should('have.text', 'Full Recipe Book');
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").eq(1).should("have.text", "Pancakes");
    });

    it("view details for recipe", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(0).click();

        cy.location("pathname").should("include", "/recipebook/details");

        cy.get('h2').should('have.text', 'Pancakes Details');
    });

    it("view tutorial for recipe", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").last().find('button').eq(0).click();

        cy.location("pathname").should("include", "/recipebook/details");

        cy.get('main').contains('View Tutorial').click();

        cy.location("pathname").should("include", "/recipebook/tutorial");

        cy.get('h2').should('have.text', 'Pancakes Tutorial');
    });

    it("filter resulting recipes", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').find("td").eq(1).should("have.text", "Pancakes");


    });
});
