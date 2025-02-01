<template>
    <div class="container">
        <div class="headline">
            <h1>Songstamp</h1>
            <p>The song ordering game</p>
        </div>
        <div class="spacer"></div>
        <button @click="login">Connect to Spotify</button>
        <div class="text">
            <p>To play this game, a connection to a Spotify premium account is needed!</p>
        </div>
        <div class="spacer"></div>
    </div>
</template>

<script lang="ts" setup>
import { AuthService } from '@/services/AuthService';

const authService = AuthService.getInstance();

const login = () => {
    authService.login();
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    flex-direction: column;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: var(--big-gap);

}

.headline {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 20vh;

    h1 {
        font-size: 5rem;
        color: white;
        margin-bottom: var(--base-gap);
    }

    p {
        font-size: 1.5rem;
        color: white;
    }
}

.text p {
    text-align: center;
    color: white;
    font-size: 1.2rem;
    margin: 1rem;
    background-color: transparent;
}

button {
    font-weight: var(--font-weight-bolder);
    font-size: 2.2rem;
    color: white;
    background-color: #1ED760;
    width: 100%;
    height: 6rem;
    border-radius: 3rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    max-width: 35rem;

    @media(min-width: 1200px) {
        &.hover {
            cursor: pointer;
            background-color: var(--hover-col-button-play);
        }
    }
}
</style>