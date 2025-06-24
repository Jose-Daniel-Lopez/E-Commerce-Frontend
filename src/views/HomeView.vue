<template>
  <div class="home">
    <div class="hero">
      <h1>Bienvenido a E-Commerce</h1>
      <p>Gestiona tu tienda online de manera fácil y eficiente</p>
      <router-link to="/users" class="btn-primary"> Ver Usuarios </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// At this point, no additional script logic is needed.
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
}

.hero {
  text-align: center;
  max-width: 600px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--color-text);
  opacity: 0.8;
}

.btn-primary {
  display: inline-block;
  background-color: #42b883;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(66, 184, 131, 0.3);
}

.btn-primary:hover {
  background-color: #369870;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(66, 184, 131, 0.4);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .btn-primary {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
