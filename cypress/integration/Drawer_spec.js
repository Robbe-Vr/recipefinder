describe("Drawer Test", () => {
    beforeEach(() => {
        cy.wait(5000);

        cy.visit('/home/index');
    });

    it("visit home", () => {
        cy.get('a').contains("Home").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/home/index");
    });

    it("visit kitchen", () => {
        cy.get('a').contains("Your Kitchen").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/kitchen/index");
    });

    it("visit recipebook", () => {
        cy.get('a').contains("Recipe Book").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/recipebook/index");
    });

    it("visit grocerylist", () => {
        cy.get('a').contains("Grocery Lists").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/grocerylists/index");
    });

    it("visit custom recipes", () => {
        cy.get('a').contains("Your Recipes").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/recipebook/custom/index");
    });

    it("visit ingredients CRUD", () => {
        cy.get('a').contains("Ingredients").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/Ingredients/index");
    });

    it("visit ingredient categories CRUD", () => {
        cy.get('a').contains("Ingredient Categories").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/IngredientCategories/index");
    });

    it("visit unittypes CRUD", () => {
        cy.get('a').contains("Unit Types").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/UnitTypes/index");
    });

    it("visit recipes CRUD", () => {
        cy.get('ul').contains("ul", "Creator").find('a').contains("Recipes").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/Recipes/index");
    });

    it("visit recipe categories CRUD", () => {
        cy.get('a').contains("Recipe Categories").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/RecipeCategories/index");
    });

    it("visit accounts management", () => {
        cy.get('a').contains("Accounts").click();
        cy.wait(100);

        cy.location("pathname").should("include", "/accounts/index");
    });
});
