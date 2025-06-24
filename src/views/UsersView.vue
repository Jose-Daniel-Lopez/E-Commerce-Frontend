<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([])

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

<template>
  <div>
    <h2>User List</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
    </ul>
  </div>
</template>
