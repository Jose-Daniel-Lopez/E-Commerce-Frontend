<template>
  <div>
    <h2>User List</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/users')
    // Si usas Spring Data REST, los usuarios están en response.data._embedded.users
    users.value = response.data._embedded ? response.data._embedded.users : response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})
</script>
