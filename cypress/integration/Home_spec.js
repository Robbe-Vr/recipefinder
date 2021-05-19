describe("Home Page Test", () => {
    it("visit home", () => {
      cy.visit("/");
    });
  
    it("clicks kitchen", () => {
      cy.contains("Your Kitchen").click();
      //cy.get("a").contains("Chat").click();
      cy.location("pathname").should("include", "/kitchen/index");
    });

    it("clicks recipes", () => {
        cy.contains("Recipe Book").click();
        //cy.get("a").contains("Chat").click();
        cy.location("pathname").should("include", "/recipebook/index");
      });
  
    it("check if correct chat page", () => {
      cy.get("h1").should("have.text", "Hello");
    });
  });
  