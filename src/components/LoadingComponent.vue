<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
    message: String,
});
</script>

<template>
    <div class="loading-wrapper">
        <div class="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <p>{{ message }}</p>
    </div>
</template>

<style lang="scss" scoped>
.loading-wrapper {
    background-color: var(--col-bg);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
        color: white;
        margin-top: var(--base-gap);
    }

    .lds-facebook {
        /* change color here */
        color: white;
    }

    .lds-facebook,
    .lds-facebook div {
        box-sizing: border-box;
    }

    .lds-facebook {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }

    .lds-facebook div {
        display: inline-block;
        position: absolute;
        left: 8px;
        width: 16px;
        background: currentColor;
        animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
    }

    .lds-facebook div:nth-child(1) {
        left: 8px;
        animation-delay: -0.24s;
    }

    .lds-facebook div:nth-child(2) {
        left: 32px;
        animation-delay: -0.12s;
    }

    .lds-facebook div:nth-child(3) {
        left: 56px;
        animation-delay: 0s;
    }

    @keyframes lds-facebook {
        0% {
            top: 8px;
            height: 64px;
        }

        50%,
        100% {
            top: 24px;
            height: 32px;
        }
    }
}
</style>