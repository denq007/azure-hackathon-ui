<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container navbar-collapse" id="navbarNav" style="justify-content: flex-start;">
      <a class="navbar-brand" href="#">
        <img src="https://www.telekom.de/resources/images/974660/telekom-logo.svg" alt="" width="30" height="24">
      </a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/chatgpt">ChatGpt</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class="container mt-3">

    <div id="nav mb-3">


    </div>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  all: none;
}
</style>
