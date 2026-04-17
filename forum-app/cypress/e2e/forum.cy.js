describe("Forum App E2E Test - The Ultimate Journey", () => {
  const timestamp = Date.now();
  const newUser = {
    name: "Test Forum",
    email: `test.${timestamp}@gmail.com`,
    password: "password123",
  };

  const threadData = {
    title: `Thread E2E ${timestamp}`,
    category: "testing",
    body: "Konten thread utama.",
    comment: "Ini komentar otomatis dari Cypress!",
  };

  /**
   * Skenario Pengujian:
   * 1. Alur Registrasi: Memastikan pengguna baru dapat mendaftar dengan data valid.
   * 2. Alur Login: Memastikan kredensial yang baru didaftarkan dapat digunakan untuk masuk.
   * 3. Alur Thread: Memastikan pengguna yang telah login dapat membuat thread baru.
   * 4. Alur Komentar: Memastikan pengguna dapat memberikan respon/komentar pada thread yang ada.
   */
  it("should allow user to register, login, create thread, and post a comment", () => {
    // --- 1. SKENARIO REGISTRASI ---
    // Mengunjungi halaman registrasi dan mengisi formulir pendaftaran
    cy.visit("/register");
    cy.get('[data-testid="name-input"]').type(newUser.name);
    cy.get('[data-testid="email-input"]').type(newUser.email);
    cy.get('[data-testid="password-input"]').type(newUser.password);
    cy.get('button[type="submit"]').click();

    // Memastikan sistem mengarahkan user ke halaman login setelah registrasi berhasil
    cy.url({ timeout: 10000 }).should("include", "/login");

    // --- 2. SKENARIO LOGIN ---
    // Menggunakan akun yang baru dibuat untuk masuk ke aplikasi
    cy.get('[data-testid="email-input"]').type(newUser.email);
    cy.get('[data-testid="password-input"]').type(newUser.password);
    cy.get('button[type="submit"]').click();

    // Verifikasi: Berhasil masuk ke halaman beranda (Root URL)
    cy.url({ timeout: 10000 }).should("eq", Cypress.config().baseUrl + "/");

    // --- 3. SKENARIO PEMBUATAN THREAD ---
    // Menekan tombol buat thread dan mengisi konten thread baru
    cy.get('[data-testid="create-thread-btn"]').click();
    cy.get("input#title").type(threadData.title);
    cy.get("input#category").type(threadData.category);
    cy.get("textarea#body").type(threadData.body);
    cy.get('button[type="submit"]').click();

    // Verifikasi: Thread yang baru dibuat harus muncul di daftar beranda
    cy.contains(threadData.title).should("be.visible");

    // --- 4. SKENARIO INTERAKSI KOMENTAR ---
    // Navigasi ke halaman detail thread dengan mengklik judul thread
    cy.contains(threadData.title).click();

    // Memastikan navigasi berhasil ke halaman detail thread
    cy.url().should("include", "/thread/");

    // Mengirimkan komentar baru pada thread tersebut
    cy.get("textarea").type(threadData.comment);
    cy.get('button[type="submit"]').click();

    // Verifikasi Akhir: Memastikan komentar berhasil tersimpan dan tampil
    cy.contains(threadData.comment).should("be.visible");
  });
});
