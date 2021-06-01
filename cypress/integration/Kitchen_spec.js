describe("Kitchen Page Test", () => {
    beforeEach(() => {
        cy.visit("/kitchen/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Kitchens(.*?)/ }, { fixture: 'get_kitchen.json' }).as('kitchen');

        //cy.wait('@kitchen');
    });

    it("check if kitchen contains items", () => {
        cy.get("tbody").first().get('tr').eq(0).get('td').eq(1).should("have.text", "Apple");

        cy.get("tbody").first().get('tr').eq(1).get('td').eq(1).should("have.text", "Banana");
    });
});
