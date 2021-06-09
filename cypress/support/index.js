import './commands'

beforeEach(() => {
    const ls_key = "recipefinder_account";

    cy.fixture(`connected_account_admin`).then((data) => {
        localStorage.setItem(ls_key, JSON.stringify(data));
        console.log('local account set.');

        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Authorize\/Validate(.*?)/ }, { fixture: 'validate_token.json' }).as('validate');
        cy.intercept({ method: 'POST', url: /(.*?)\/api\/Authorize\/Refresh(.*?)/ }, { fixture: 'get_user_by_access_token.json' }).as('refresh');
        cy.intercept({ method: 'GET', url: /(.*?)\/api\/Authorize\/Me(.*?)/ }, { fixture: 'get_user_by_access_token.json' }).as('userbytoken');
        cy.intercept({ method: 'GET', url: /(.*?)\/\/api\/authorize\/login\?ReturnUrl=https:\/\/localhost:3000\/returnAuthorization/ }, (req) => {
            req.reply(404);
        }).as('login');
        
        cy.visit('/home/index');

        cy.wait('@validate');

        cy.wait(300);
    });
});