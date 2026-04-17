Cypress.Commands.add("login", () => {
  cy.visit("/login");
  cy.get('input[name="email"]').type("mail2@gmail.com");
  cy.get('input[name="password"]').type("12345678");
  cy.get('button[type="submit"]').click();

  // Pastikan sudah berhasil login sebelum lanjut
  cy.contains("Logout").should("be.visible");
});
