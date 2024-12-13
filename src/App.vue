<script setup lang="ts">
import LoadingComponent from './components/LoadingComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import PlayerComponent from './components/PlayerComponent.vue';
import SearchComponent from './components/SearchComponent.vue';
import TimelineComponent from './components/TimelineComponent.vue';
import { AuthService } from './services/AuthService';
const authService = AuthService();

if (localStorage.getItem('refresh_token')) {
  authService.getRefreshToken();
} else {
  if (window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      authService.getAccessToken(code);
    }
  }
}
</script>

<template>
  <div class="container">
    <!-- Loading state -->
    <LoadingComponent class="loading-comp" v-if="authService.state.isLoading" message="Trying to log in..." />

    <!-- Logged-in state -->
    <template v-else-if="authService.state.isLoggedIn">
      <!-- <app-search />
      <app-menu /> -->
      <SearchComponent class="search-comp" />
      <PlayerComponent class="player-comp" />
      <TimelineComponent class="timeline-comp" />
      <!-- <app-snackbar /> -->
    </template>

    <!-- Logged-out state -->
    <LoginComponent v-else />
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-height: 100%;

  .loading-comp {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
  }

  .search-comp {
    background-color: var(--col-bg);
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    width: 100%;
    height: auto;


    @media(min-width: 1024px) {
      width: 60%;
    }
  }

  .player-comp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35vh;
    height: 35vh;

    // @media(min-width: 1024px) {
    //   width: 60%;
    // }
  }

  .timeline-comp {
    background-color: red;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    width: 90%;
    height: 15vh;

    // @media(min-width: 1024px) {
    //   width: 60%;
    // }
  }

  .snackbar-comp {
    height: 5rem;
    position: absolute;
    bottom: -5rem;
    left: 50%;
    transform: translateX(-50%);
  }

}
</style>
