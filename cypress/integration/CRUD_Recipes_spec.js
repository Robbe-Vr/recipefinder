describe("Recipes CRUD Page Test", () => {
    beforeEach(() => {
        cy.visit("/Recipes/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Ingredients(.*?)/ }, { fixture: 'get_ingredients.json' }).as('ingredients');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/IngredientCategories(.*?)/ }, { fixture: 'get_ingredientcategories.json' }).as('ingredientcategories');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/UnitTypes(.*?)/ }, { fixture: 'get_unittypes.json' }).as('unittypes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes(.*?)/ }, { fixture: 'get_recipes.json' }).as('recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/RecipeCategories(.*?)/ }, { fixture: 'get_recipecategories.json' }).as('recipecategories');

        //cy.wait(['@ingredients', '@ingredientcategories', '@unittypes', '@recipes', '@recipecategories']);
    });

    it("check if recipes are shown", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').find("td").eq(3).should("have.text", "Pancakes");
    });
});
