<template>
  <div class="patient-detail">
    <h1>Patient Detail</h1>
    <p>Patient ID: {{ $route.params.id }}</p>
  </div>
</template>

<style scoped>
.patient-detail {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: calc(60px + 2rem);
}

h1 {
  margin-bottom: 1rem;
  color: #333;
}
</style>