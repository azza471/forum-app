describe("Forum App E2E Test - The Ultimate Journey", () => {
  const timestamp = Date.now();
  const newUser = {
    name: "Leon Duta",
    email: `leon.${timestamp}@gmail.com`,
    password: "password123",
  };

  const threadData = {
    title: `Thread E2E ${timestamp}`,
    category: "testing",
    body: "Konten thread utama.",
    comment: "Ini komentar otomatis dari Cypress!",
  };

  it("should allow user to register, login, create thread, and post a comment", () => {
    // --- 1. REGISTER ---
    cy.visit("/register");
    cy.get('[data-testid="name-input"]').type(newUser.name);
    cy.get('[data-testid="email-input"]').type(newUser.email);
    cy.get('[data-testid="password-input"]').type(newUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/login");

    // --- 2. LOGIN ---
    cy.get('[data-testid="email-input"]').type(newUser.email);
    cy.get('[data-testid="password-input"]').type(newUser.password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");

    // --- 3. BUAT THREAD ---
    cy.get('[data-testid="create-thread-btn"]').click();
    cy.get("input#title").type(threadData.title);
    cy.get("input#category").type(threadData.category);
    cy.get("textarea#body").type(threadData.body);
    cy.get('button[type="submit"]').click();

    // Verifikasi thread muncul di Home
    cy.contains(threadData.title).should("be.visible");

    // --- 4. MASUK KE DETAIL & KOMENTAR ---
    // Klik judul thread untuk masuk ke halaman detail
    cy.contains(threadData.title).click();

    // Pastikan URL berubah ke halaman detail (misal: /thread/thread-123)
    cy.url().should("include", "/thread/");

    // Isi textarea komentar (Pastikan di ThreadDetailPage ada textarea)
    // Jika kamu belum pasang ID, kamu bisa pakai tag textarea langsung
    cy.get("textarea").type(threadData.comment);

    // Klik tombol kirim komentar
    cy.get('button[type="submit"]').click();

    // Verifikasi komentar muncul di layar
    cy.contains(threadData.comment).should("be.visible");
  });
});
