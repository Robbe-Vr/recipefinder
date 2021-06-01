describe("Recipebook Page Test", () => {
    beforeEach(() => {
        cy.visit("/recipebook/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes(.*?)/ }, { fixture: 'get_recipes.json' }).as('recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/RecipeCategories(.*?)/ }, { fixture: 'get_recipecategories.json' }).as('recipecategories');

        //cy.wait(['@recipes', '@recipecategories']);
    });

    it("check if recipes are shown", () => {
        cy.get("tbody").first().get('tr').eq(0).get('td').eq(1).should("have.text", "FruitMix");
    });
});
