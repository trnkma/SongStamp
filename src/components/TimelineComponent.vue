<template>
    <div class="timeline-wrapper">
        <div class="teams">
            <button v-for="(team) in gameLogicService.teams.value" :key="team.id"
                @click="gameLogicService.setDisplayedTeam(team)" :class="{ active: team.display }">
                <h2>Team: {{ team.name }} ({{ team.timeline.length }})
                </h2>
            </button>

        </div>

        <div class="timeline-items">
            <div v-for="(track, index) in gameLogicService.displayedTeam.value?.timeline" :key="track?.id"
                class="timeline-item">
                <div class="guess-field" :class="{ disabled: !gameLogicService.displayedTeam.value?.isActive }">
                    <div class="before"
                        @click="gameLogicService.makeGuessBefore(track as Track, gameLogicService.playingTeam.value?.timeline[index - 1] as Track)">
                    </div>
                    <div class="after"
                        @click="gameLogicService.makeGuessAfter(track as Track, gameLogicService.playingTeam.value?.timeline[index + 1] as Track)">
                    </div>
                </div>
                <AlbumComponent class="album-comp" :album="track?.album" :songName="track?.name"
                    :artist="track?.artists[0].name"></AlbumComponent>
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
.timeline-wrapper {

    .teams {
        display: flex;
        align-items: center;

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

    .timeline-items {
        display: flex;
        justify-content: center;

        .timeline-item {
            width: 10vw;
            margin: 0 0.5rem 0 0.5rem;
            display: flex;
            position: relative;

            .album-comp {
                height: 100%;
            }

            .guess-field {
                z-index: 1000;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                display: flex;

                &.disabled {
                    pointer-events: none;
                }

                .before {
                    content: '';
                    height: 100%;
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &:hover {
                        background-color: var(--col-bg);
                        filter: opacity(0.5);
                    }
                }

                .after {
                    content: '>';
                    height: 100%;
                    width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;

                    &:hover {
                        background-color: var(--col-bg);
                        filter: opacity(0.5);
                    }
                }
            }
        }
    }
}
</style>