<template>
    <div class="settings-wrapper">
        <h1 class="title">Settings</h1>
        <div class="overflow-container">
            <h1>Teams</h1>
            <div class="teams-wrapper">
                <div class="team-item" v-for="(team, index) in gameLogicService.teams.value" :key="team.id">
                    <p>Team {{ index + 1 }}</p>
                    <div class="input-wrapper">
                        <input type="text" v-model="team.name" placeholder="Enter team name"
                            @input="updateTeamName(team.id, team.name)" />
                        <button v-if="index != 0" class="btn-remove-team" @click="removeTeam(team.id)">-</button>
                    </div>
                </div>
                <button class="btn-add-team" @click="addTeam()">+</button>
            </div>
            <h1>Playlists</h1>
            <p class="error-message"
                :class="{ showPlaylistInputError: trackService.chosenList.value.length === 0 && showPlaylistError }">At
                least one playlist needs
                to be selected to
                play the game!</p>
            <div class="chosen-playlists">
                <button v-for="(item, index) in trackService.chosenList.value" :key="index"
                    @click="onChosenItemClick(item)">
                    <SearchListItemComponent :image-source="item.images[0]?.url"></SearchListItemComponent>
                </button>
                <button class="add-playlist-button" @click="showSearchPopup = true">+</button>
            </div>
        </div>
        <div class="spacer"></div>
        <div class="settings-controls">
            <div class="spacer"></div>
            <button @click="startGame()">
                <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%"
                    fill="#e8eaed">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
            </button>
        </div>
        <div class="search-comp-wrapper" v-if="showSearchPopup">
            <SearchComponent @close="closeSearchPopup" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SearchComponent from './SearchComponent.vue';
import { TrackService } from '@/services/TrackService';
import type { MyPlaylist } from '@/types/SpotifyWebAPI';
import SearchListItemComponent from './SearchListItemComponent.vue';
import { GameLogicService } from '@/services/GameLogicService';

const gameLogicService = GameLogicService.getInstance();
const trackService = TrackService.getInstance();

const emits = defineEmits(['done']);

const showSearchPopup = ref(false);

const showPlaylistError = ref(false);

const addTeam = () => {
    gameLogicService.addTeam();
};

const removeTeam = (id: number) => {
    gameLogicService.removeTeam(id);
};

const updateTeamName = (id: number, name: string | null) => {
    gameLogicService.updateTeamName(id, name);
};
const closeSearchPopup = () => {
    showSearchPopup.value = false;
};

const onChosenItemClick = (playlist: MyPlaylist) => {
    trackService.removePlaylist(playlist);
};

const startGame = () => {
    if (trackService.chosenList.value.length === 0) {
        showPlaylistError.value = true;
        return;
    }
    gameLogicService.startGame();
    emits('done');
}
</script>

<style lang="scss" scoped>
.settings-wrapper {
    background-color: var(--col-bg);
    display: flex;
    flex-direction: column;
    color: white;
    width: 100%;
    max-width: 50vw;
    height: 100%;
    max-height: 100%;
    padding: 2rem;

    .error-message {
        opacity: 0;
        color: red;
    }

    .showTeamInputError {
        opacity: 1;
    }

    .showPlaylistInputError {
        opacity: 1;
    }

    .title {
        text-align: center;
    }

    .overflow-container {
        // max-height: calc(100% - 4rem);
        overflow-y: auto;
    }

    h1 {
        margin-bottom: 20px;
    }

    .teams-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        button {
            background-color: transparent;
            border: none;
        }

        .btn-add-team {
            width: fit-content;
            font-size: 3rem;
            color: white;
            margin-bottom: 2rem;
        }

        .team-item {
            margin-bottom: 1.5rem;

            .input-wrapper {
                display: flex;
                margin-top: 1rem;

                input {
                    color: white;
                    caret-color: white;
                    outline: none;
                    background-color: transparent;
                    border: none;
                    border-radius: 0;
                    border-bottom: 1px solid white;
                    margin-bottom: 0.1rem;
                    padding: 1rem;
                    font-size: 1.6rem;
                    flex: 1 1 auto;

                    &:focus {
                        border-bottom: 2px solid white;
                        margin-bottom: 0;
                    }
                }

                .btn-remove-team {
                    width: fit-content;
                    font-size: 3rem;
                    color: white;
                    margin-bottom: 0;
                }
            }
        }
    }

    .chosen-playlists {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        button {
            width: 33.333333%;
            max-width: 33.333333%;
            aspect-ratio: 1/1;
            background-color: transparent;
            border: none;
            padding: 0;
            padding-right: 1rem;
            cursor: pointer;

            @media(min-width: 1200px) {
                width: 20%;
                max-width: 20%;
            }
        }

        .add-playlist-button {
            font-size: 3rem;
            color: white;

            @media(min-width: 1200px) {
                &:hover {
                    color: var(--col-play);
                }
            }
        }

    }

    .search-comp-wrapper {
        z-index: 2000;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background-color: var(--col-bg);
        border-radius: 2rem;
        box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
    }

    .settings-controls {
        width: 100%;
        display: flex;
        align-items: center;

        button {
            background-color: transparent;
            border: none;
            color: white;

            width: 5rem;
        }
    }


}
</style>
