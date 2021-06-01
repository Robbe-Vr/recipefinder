describe("IngredientCategories CRUD Page Test", () => {
    beforeEach(() => {
        cy.visit("/IngredientCategories/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Ingredients(.*?)/ }, { fixture: 'get_ingredients.json' }).as('ingredients');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/IngredientCategories(.*?)/ }, { fixture: 'get_ingredientcategories.json' }).as('ingredientcategories');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/UnitTypes(.*?)/ }, { fixture: 'get_unittypes.json' }).as('unittypes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes(.*?)/ }, { fixture: 'get_recipes.json' }).as('recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/RecipeCategories(.*?)/ }, { fixture: 'get_recipecategories.json' }).as('recipecategories');

        //cy.wait(['@ingredients', '@ingredientcategories', '@unittypes', '@recipes', '@recipecategories']);
    });

    it("check if ingredient categories are shown", () => {
        cy.get("tbody").first().get('tr').eq(0).get('td').eq(1).should("have.text", "Fruits");
    });
});
