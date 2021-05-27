describe("Home Page Test", () => {
    it("visit home", () => {
        cy.visit("/");
    });

    it("check if correct home page", () => {
        cy.get("h1").should("have.text", "Hello Recipe Finder admin!");
    });
  
    it("clicks kitchen", () => {
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Kitchens(.*?)/ }, { fixture: 'get_kitchen.json' }).as('kitchen');
        
        cy.contains("Your Kitchen").click();
        
        cy.wait('@kitchen');

        cy.location("pathname").should("include", "/kitchen/index");
    });

    it("back to home", () => {
        cy.visit("/home/index");
    });

    it("clicks recipes", () => {
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Recipes(.*?)/ }, { fixture: 'get_recipes.json' }).as('recipes');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/RecipeCategories(.*?)/ }, { fixture: 'get_recipecategories.json' }).as('recipecategories');

        cy.contains("Recipe Book").click();

        cy.wait(['@recipes', '@recipecategories']);

        cy.location("pathname").should("include", "/recipebook/index");
    });
});
