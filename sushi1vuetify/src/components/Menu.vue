<template>
  <v-container>
    <h2 class="text-h4 text-center my-8">Our Menu</h2>
    <v-row>
      <v-col
        v-for="item in menuItems"
        :key="item.name"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mx-auto" max-width="400">
          <v-img
            class="align-end text-white"
            height="200"
            :src="item.image"
            cover
          >
          </v-img>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle class="pt-4">
            {{ item.price }}
          </v-card-subtitle>
          <v-card-text>
            <div>{{ item.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const menuItems = ref([
  { name: 'California Roll', price: '$10.99', description: 'Crab, avocado, cucumber.', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754' },
  { name: 'Spicy Tuna Roll', price: '$12.99', description: 'Tuna, spicy mayo, cucumber.', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351' },
  { name: 'Dragon Roll', price: '$14.99', description: 'Eel, crab, avocado.', image: 'https://images.unsplash.com/photo-1611142037-522597c61125' },
  { name: 'Salmon Nigiri', price: '$8.99', description: 'Fresh salmon over rice.', image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be' },
  { name: 'Tuna Nigiri', price: '$9.99', description: 'Fresh tuna over rice.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c' },
  { name: 'Rainbow Roll', price: '$15.99', description: 'Assorted fish over a California roll.', image: 'https://images.unsplash.com/photo-1607301405390-727481f2b5c3' },
  { name: 'Philadelphia Roll', price: '$11.99', description: 'Salmon, cream cheese, avocado.', image: 'https://images.unsplash.com/photo-1625943555419-83a931157345' },
  { name: 'Avocado Roll', price: '$7.99', description: 'Avocado, rice, seaweed.', image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d' },
  { name: 'Eel Roll', price: '$13.99', description: 'Grilled eel, cucumber, eel sauce.', image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d' },
]);
</script>

<style scoped>
.v-card-title {
  color: #ff7f7f;
}
</style>