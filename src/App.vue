<script setup lang="ts">
import { ref } from 'vue';
import LoadingComponent from './components/LoadingComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import PlayerComponent from './components/PlayerComponent.vue';
import TimelineComponent from './components/TimelineComponent.vue';
import { AuthService } from './services/AuthService';
import AlbumComponent from './components/AlbumComponent.vue';
import AlbumDetailComponent from './components/AlbumDetailComponent.vue';
import SettingsComponent from './components/SettingsComponent.vue';
import { GameLogicService } from './services/GameLogicService';
const authService = AuthService();
const gameLogicService = GameLogicService.getInstance();

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


const settingsOpen = ref<boolean>(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentAlbum = ref<any | null>(null);


</script>

<template>
  <div class="container">
    <!-- Loading state -->
    <LoadingComponent class="loading-comp" v-if="authService.state.isLoading" message="Trying to log in..." />

    <!-- Logged-in state -->
    <template v-else-if="authService.state.isLoggedIn">
      <SettingsComponent class="settings-comp" v-if="settingsOpen" @done="settingsOpen = false"></SettingsComponent>
      <!-- <SearchComponent class="search-comp" /> -->
      <PlayerComponent class="player-comp" />
      <AlbumComponent class="album-comp" v-if="currentAlbum" :album="currentAlbum"></AlbumComponent>

      <!-- <button @click="showAlbum()">getDate</button> -->
      <TimelineComponent class="timeline-comp" />
      <div class="result" v-if="gameLogicService.showResult.value && gameLogicService.currentlyPlayingTrack">
        <AlbumComponent :album="gameLogicService.currentlyPlayingTrack.value?.album"
          :song-name="gameLogicService.currentlyPlayingTrack.value?.name"
          :artist="gameLogicService.currentlyPlayingTrack.value?.artists[0].name"></AlbumComponent>
        <!-- <img :src="gameLogicService.currentlyPlayingTrack.value?.album.images[0].url" alt="album-image"> -->
        <div class="controls">
          <button @click="gameLogicService.nextRound()">Next Track</button>
        </div>
      </div>
      <AlbumDetailComponent :songDetails="gameLogicService.songDetails.value" class="album-detail"
        v-if="gameLogicService.displaySongDetails.value">
      </AlbumDetailComponent>
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

  .result {
    padding: 2rem;
    border-radius: 2rem;
    background-color: var(--col-bg);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50rem;

    .controls {
      width: 100%;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 1rem;

      button {
        background-color: transparent;
        border: none;
        color: white;
        font-size: 1.8rem;

        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }

  .loading-comp {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
  }

  // button {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  // }

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

  .settings-comp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 60vw;
    height: fit-content;
    max-height: 65vh;
    background-color: var(--col-bg);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 2rem;
    // overflow-y: auto;

    &::after {
      content: '';
      width: 2rem;
      height: 2rem;
      background-color: red;
    }
  }

  .player-comp {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40vh;
    height: 40vh;

    // @media(min-width: 1024px) {
    //   width: 60%;
    // }
  }

  .album-comp {
    position: absolute;
    top: 50%;
    left: 80%;
    transform: translate(-50%, -50%);
    width: 35vh;
    height: 35vh;
  }


  .timeline-comp {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%);
    width: 90%;
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
