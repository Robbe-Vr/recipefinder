describe("Login Test", () => {
    it("first visit", () => {
      cy.visit("/home/index");
    });
  
    it("check if correct home page", () => {
      cy.get("h1").should("have.text", "Hello");
    });
});