<template>
    <div class="controls">
        <div class="playlist-background"
            :class="{ inactive: !playbackService.hasTrack, rotate: playbackService.isPlaying.value }">
            <img v-if="trackService.activePlaylist.value !== null"
                :src="trackService.activePlaylist.value?.images[0].url" alt="playlist-image"
                :class="{ rotate: playbackService.isPlaying.value }">
            <button class="play" :class="{ inactive: !playbackService.hasTrack.value }" @click="onPlayButtonClick">
                <IconPlay class="icon icon-play" v-if="!playbackService.isPlaying.value" />
                <IconPause class="icon icon-pause" v-if="playbackService.isPlaying.value" />
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PlaybackService } from '@/services/PlaybackService';
import IconPause from './icons/IconPause.vue';
import IconPlay from './icons/IconPlay.vue';
import { TrackService } from '@/services/TrackService';


// Access the playback service (singleton)
const playbackService = PlaybackService.getInstance();
const trackService = TrackService.getInstance();
// Method for toggling play
const onPlayButtonClick = () => {
    playbackService.onPlayButtonClick();
};


</script>

<style lang="scss" scoped>
.controls {
    display: flex;
    width: 100%;
    height: 100%;

    .playlist-background {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        border-radius: 10%;
        overflow: hidden;
        padding: 0;
        margin: 0;

        &:hover {
            button {
                display: flex;
            }
        }

        img {
            border-radius: 50%;
            width: 68%;
            z-index: 900;
            aspect-ratio: 1/1;

            &.rotate {
                animation: rotation 6s infinite linear;
            }
        }

        &.inactive {
            filter: brightness(0.5);
            pointer-events: none;
        }

        button {
            display: none;
            z-index: 10000;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.308);
            width: 12rem;
            height: 12rem;
            border-radius: 50%;
            overflow: hidden;
            border: none;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;

            &.inactive {
                filter: brightness(0.5);
                pointer-events: none;
            }

            &.rotate {
                animation: rotation 6s infinite linear;
            }

            img {
                width: 125%;
                height: 120%;
                object-fit: cover;
            }

            svg {
                width: 200%;
            }

            &:hover {
                cursor: pointer;
                background-color: rgba(0, 0, 0, 0.678);
            }
        }

        .play {
            background-color: var(--col-button-play);
        }

        .next-song {
            left: 100%;
        }

    }

    .roller {
        color: white !important;
        transform: translateX(-0.3rem);
    }

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
}
</style>