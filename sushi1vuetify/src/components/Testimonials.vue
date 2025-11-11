<template>
  <v-container>
    <h2 class="text-h4 text-center my-8">What Our Customers Say</h2>
    <v-row>
      <v-col
        v-for="testimonial in testimonials"
        :key="testimonial.name"
        cols="12"
        md="4"
      >
        <v-card class="mx-auto text-center" max-width="400">
          <v-avatar size="100" class="my-4">
            <img :src="testimonial.avatar" alt="Avatar">
          </v-avatar>
          <v-card-title class="justify-center">{{ testimonial.name }}</v-card-title>
          <v-card-text>
            <v-rating
              v-model="testimonial.rating"
              readonly
              color="yellow-darken-3"
              half-increments
            ></v-rating>
            <p class="mt-4">{{ testimonial.review }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const testimonials = ref([
  { name: 'Alice Johnson', rating: 5, review: 'The best sushi I have ever had! The fish was so fresh and the service was excellent. Highly recommend!', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Bob Williams', rating: 4.5, review: 'A great place for a date night. The atmosphere is cozy and the sushi is delicious. The Dragon Roll is a must-try!', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Charlie Brown', rating: 5, review: 'I am a regular here and I am never disappointed. The staff is friendly and the quality of the food is consistently amazing.', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
]);
</script>

<style scoped>
.v-card {
  padding: 16px;
}
</style>