<template>
  <v-app>
    <Header />
    <v-main>
      <Hero />
      <Menu />
      <Testimonials />
      <Contact />
      <!-- Content will go here -->
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
  import Header from './components/Header.vue'
  import Hero from './components/Hero.vue'
  import Menu from './components/Menu.vue'
  import Testimonials from './components/Testimonials.vue'
  import Contact from './components/Contact.vue'
  import Footer from './components/Footer.vue'
</script>
