<template>
    <div>
        <div class="teams">
            <button v-for="(team) in gameLogicService.teams.value" :key="team.id"
                @click="gameLogicService.setDisplayedTeam(team)" :class="{ active: team.display }">
                <h2>Team: {{ team.name }} ({{ team.timeline.length }})
                </h2>
            </button>

        </div>
        <div class="timeline-wrapper">
            <div class="timeline-items-wrapper">
                <div class="timeline-items">
                    <div v-for="(track, index) in gameLogicService.displayedTeam.value?.timeline" :key="track?.id"
                        class="timeline-item">
                        <div class="guess-area"
                            @click="gameLogicService.makeGuessBefore(track as Track, gameLogicService.playingTeam.value?.timeline[index - 1] as Track)">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#e8eaed">
                                <path
                                    d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                        </div>

                        <AlbumComponent class="album-comp" :album="track?.album" :songName="track?.name"
                            :artist="track?.artists[0].name"></AlbumComponent>
                        <div v-if="index + 1 === gameLogicService.displayedTeam.value?.timeline.length"
                            class="guess-area"
                            @click="gameLogicService.makeGuessAfter(track as Track, gameLogicService.playingTeam.value?.timeline[index + 1] as Track)">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#e8eaed">
                                <path
                                    d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GameLogicService } from '@/services/GameLogicService';
import AlbumComponent from './AlbumComponent.vue';
import type { Track } from '@/types/SpotifyWebAPI';

// import { PlaybackService } from '@/services/PlaybackService';
const gameLogicService = GameLogicService.getInstance();

// const playbackService = PlaybackService();
// let tracks = [];

</script>

<style lang="scss" scoped>
.teams {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    button {
        background-color: transparent;
        border: 1px solid white;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 2rem;
        padding: 1rem;

        h2 {
            color: white;
            padding: 0;
            margin: 0;

        }

        &.active {
            background-color: white;

            h2 {
                color: black;
            }
        }
    }
}

.timeline-wrapper {
    overflow-y: auto;
    width: 100%;

    .timeline-items-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;

        .timeline-items {
            display: flex;
            height: 16rem;
            max-width: 100%;
            // overflow-y: auto;
            padding: 0 auto;

            .timeline-item {
                height: 100%;
                display: flex;
                // position: relative;

                .guess-area {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: 5rem;
                    height: 100%;
                    transition: min-width 0.3s;

                    @media(min-width: 1024px) {
                        min-width: 1rem;

                        &:hover {
                            min-width: 8rem;
                            background-color: rgba(77, 77, 77, 0.466);
                            cursor: pointer;

                            svg {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                display: block;
                            }
                        }

                        svg {
                            display: none;
                        }
                    }

                    &::before {
                        z-index: 10000;
                        position: absolute;
                        left: 0;
                        top: 0;
                        transform: translateX(-100%);
                        display: block;
                        content: '';
                        min-width: 2rem;
                        height: 100%;
                    }

                    &::after {
                        z-index: 10000;
                        position: absolute;
                        right: 0;
                        top: 0;
                        transform: translateX(100%);
                        display: block;
                        content: '';
                        min-width: 2rem;
                        height: 100%;
                    }
                }

                .album-comp {
                    height: 100%;
                    width: 10rem;
                    min-width: 10rem;
                }
            }
        }
    }
}

::-webkit-scrollbar {
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: gray;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: darkgray;
}
</style>