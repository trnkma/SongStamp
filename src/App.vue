<script setup lang="ts">
import { ref } from 'vue';
import LoadingComponent from './components/LoadingComponent.vue';
import LoginComponent from './components/LoginComponent.vue';
import PlayerComponent from './components/PlayerComponent.vue';
import TimelineComponent from './components/TimelineComponent.vue';
import { AuthService } from './services/AuthService';
import SettingsComponent from './components/SettingsComponent.vue';
import { GameLogicService } from './services/GameLogicService';
import AlbumDetailComponent from './components/AlbumDetailComponent.vue';
const authService = AuthService.getInstance();
const gameLogicService = GameLogicService.getInstance();

const showLogoutPrompt = ref(false);

const logout = () => {
  authService.logout();
}

if (window.location.search) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    authService.authorizeUser(code);
  }
}

const settingsOpen = ref<boolean>(true);

</script>

<template>
  <div class="container">
    <!-- Loading state -->
    <LoadingComponent class="loading-comp" v-if="authService.isLoading.value" :message="'Trying to log in...'" />

    <!-- Logged-in state -->
    <template v-else-if="authService.isLoggedIn.value">
      <button class="btn-logout" @click="showLogoutPrompt = true">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
        </svg>
      </button>
      <div v-if="showLogoutPrompt" class="logout-prompt">
        <p>Do you really want to logout?</p>
        <div class="buttons">
          <button class="btn-no" @click="showLogoutPrompt = false">No</button>
          <div class="spacer"></div>
          <button class="btn-yes" @click="logout()">Yes</button>
        </div>
      </div>
      <SettingsComponent class="settings-comp" v-if="settingsOpen" @done="settingsOpen = false"></SettingsComponent>

      <PlayerComponent class="player-comp" />

      <TimelineComponent class="timeline-comp" />
      <div class="result-wrapper" v-if="gameLogicService.showResult.value && gameLogicService.currentlyPlayingTrack">
        <div class="result">
          <AlbumDetailComponent :track="gameLogicService.currentlyPlayingTrack.value" :timeline-mode="false">
          </AlbumDetailComponent>
          <div class="controls">
            <button @click="gameLogicService.nextRound()">Next Track</button>
          </div>
        </div>
      </div>
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

  .btn-logout {
    z-index: 999999;
    position: absolute;
    top: 0;
    left: 0;
    padding: 2rem 0 0 2rem;
    width: 5rem;
    height: 5rem;
    border: none;
    background-color: transparent;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .logout-prompt {
    width: 90%;
    padding: 2rem;
    z-index: 100000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--col-bg);
    border-radius: 2rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    p {
      text-align: center;
      color: white;
      font-size: 1.8rem;
      margin-bottom: 2rem;
    }

    .buttons {
      width: 100%;
      display: flex;
      align-items: center;

      button {
        text-align: center;
        min-width: 5rem;
        font-size: 1.6rem;
        background-color: transparent;
        border: none;
        color: white;
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }

      .btn-no {
        background-color: var(--col-bg-secondary);
      }

      .btn-yes {
        background-color: var(--col-button-play);
      }
    }
  }

  .result-wrapper {
    z-index: 10000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .result {
      border-radius: 2rem;
      background-color: var(--col-bg);

      @media(min-width: 1024px) {
        width: 40vw;
        max-width: 60rem;
      }

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
  }

  .loading-comp {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
  }

  .settings-comp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 90vw;
    height: 80dvh;
    max-height: 90vh;
    background-color: var(--col-bg);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 2rem;
    // overflow-y: auto;
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
    bottom: 0;
    // transform: translate(-50%);
    width: 100%;

    @media(min-width: 1200px) {
      width: 90%;
      max-width: 160rem;
    }
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
