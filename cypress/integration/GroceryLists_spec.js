describe("Grocery Lists Page Test", () => {
    beforeEach(() => {
        cy.visit("/grocerylists/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/GroceryLists(.*?)/ }, { fixture: 'get_grocerylists.json' }).as('grocerylists');

        //cy.wait('@grocerylists');
    });

    it("check if grocerylists are shown", () => {
        cy.get("tbody").first().get('tr').eq(0).get('td').eq(1).should("have.text", "Default");
    });
});
