<template>
  <v-container>
    <h2 class="text-h4 text-center my-8">Contact Us</h2>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-list>
            <v-list-item prepend-icon="mdi-map-marker">
              <v-list-item-title>123 Sushi Street, Food City</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-phone">
              <v-list-item-title>(123) 456-7890</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-email">
              <v-list-item-title>contact@sushibar.com</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn icon href="#"><v-icon>mdi-facebook</v-icon></v-btn>
            <v-btn icon href="#"><v-icon>mdi-twitter</v-icon></v-btn>
            <v-btn icon href="#"><v-icon>mdi-instagram</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-list>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Opening Hours</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Monday - Friday: 11am - 10pm</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Saturday - Sunday: 12pm - 11pm</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  //
</script>

<style scoped>
.v-icon {
  color: #ff7f7f;
}
</style>