describe("Accounts Page Test", () => {
    beforeEach(() => {
        cy.visit("/accounts/index");

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Users(.*?)/ }, { fixture: 'get_users.json' }).as('users');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Users(.*?)\/actions/ }, { fixture: 'get_useractions.json' }).as('useractions');

        //cy.wait(['@users', '@useractions']);
    });

    it("check if recipes are shown", () => {
        cy.get('tr.MuiTableRow-root.MuiTableRow-hover').find("td").eq(0).should("have.text", "Recipe Finder admin");
    });
});
