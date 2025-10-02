<template>
  <div class="contact-page">
    <header class="page-header">
      <h1>Contact Us</h1>
      <p>Have a question or feedback? We'd love to hear from you.</p>
    </header>

    <div class="contact-content">
      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Your Name</label>
          <input type="text" id="name" placeholder="John Doe" required>
        </div>
        <div class="form-group">
          <label for="email">Your Email</label>
          <input type="email" id="email" placeholder="john.doe@example.com" required>
        </div>
        <div class="form-group">
          <label for="message">Your Message</label>
          <textarea id="message" rows="6" placeholder="Let us know how we can help..." required></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>

      <!-- <div class="contact-info">
        <h3>Other Ways to Reach Us</h3>
        <p>For direct inquiries, you can also reach us via email.</p>
        <a href="mailto:support@kontenkit.com" class="email-link">support@kontenkit.com</a>
      </div> -->
    </div>
  </div>
</template>

<script setup>
function handleSubmit() {
  // Untuk saat ini, kita hanya menampilkan alert.
  // Fungsionalitas pengiriman email memerlukan backend atau layanan pihak ketiga.
  alert('Thank you for your message!');
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}
.contact-content {
  max-width: 700px;
  margin: 0 auto;
}
.contact-form {
  background: var(--card-background);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 30px var(--shadow-color);
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
input, textarea {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}
button {
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  padding: 14px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}
.contact-info {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background-color: var(--background-light);
  border-radius: 8px;
}
.email-link {
  color: var(--primary-color);
  font-weight: 500;
  text-decoration: none;
}
</style>