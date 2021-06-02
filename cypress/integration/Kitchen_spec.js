describe("Kitchen Page Test", () => {
    beforeEach(() => {
        cy.visit("/kitchen/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Kitchens(.*?)/ }, { fixture: 'get_kitchen.json' }).as('kitchen');

        //cy.wait('@kitchen');
    });

    it("check if kitchen contains items", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(0).find("td").eq(1).should("have.text", "Apple");

        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').eq(1).find("td").eq(1).should("have.text", "Banana");
    });
});
