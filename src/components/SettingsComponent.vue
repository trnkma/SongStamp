<template>
    <div class="settings-wrapper">
        <h1>Teams</h1>
        <div class="teams-wrapper">
            <div class="team-item" v-for="(team, index) in gameLogicService.teams.value" :key="team.id">
                <p>Team {{ index + 1 }}</p>
                <input type="text" v-model="team.name" placeholder="Enter team name"
                    @input="updateTeamName(team.id, team.name)" />
                <button @click="removeTeam(team.id)">-</button>
            </div>
            <button @click="addTeam()">+</button>
        </div>
        <h1>Playlists</h1>
        <div class="chosen-playlists">
            <button v-for="(item, index) in trackService.chosenList.value" :key="index"
                @click="onChosenItemClick(item)">
                <SearchListItemComponent :image-source="item.images[0]?.url"></SearchListItemComponent>
            </button>
            <button class="add-playlist-button" @click="showSearchPopup = true">+</button>
        </div>
        <div class="search-comp-wrapper" v-if="showSearchPopup">
            <SearchComponent @close="closeSearchPopup" />
        </div>
        <div class="settings-controls">
            <div class="spacer"></div>
            <button @click="startGame()">Accept</button>
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

const addTeam = () => {
    gameLogicService.addTeam();
};

const removeTeam = (id: number) => {
    gameLogicService.removeTeam(id);
};

const updateTeamName = (id: number, name: string | null) => {
    gameLogicService.updateTeamName(id, name);
    // const team = teams.value.find((t) => t.id === id);
    // if (team) {
    //     team.name = name;
    // }
};
const closeSearchPopup = () => {
    showSearchPopup.value = false;
};

const onChosenItemClick = (playlist: MyPlaylist) => {
    trackService.removePlaylist(playlist);
};

const startGame = () => {
    if (trackService.chosenList.value.length === 0) return
    gameLogicService.startGame();
    emits('done');
}
</script>

<style lang="scss" scoped>
.settings-wrapper {
    width: 100%;
    height: 100%;
    padding: 2rem;
    // position: relative;

    h1 {
        margin-bottom: 20px;
    }

    button {
        margin-bottom: 20px;
    }

    .teams-wrapper {
        display: flex;
        flex-wrap: wrap;

        .team-item {
            margin-bottom: 10px;

            input {
                padding: 8px;
                font-size: 16px;
                width: 200px;
            }
        }
    }

    .search-comp {
        background-color: var(--col-bg);
        width: 100%;
        height: auto;


        @media(min-width: 1024px) {
            width: 60%;
        }
    }

    .chosen-playlists {
        box-sizing: border-box;
        width: 100%;
        height: 10rem;
        display: flex;
        flex-wrap: wrap;

        button {
            height: 100%;
            aspect-ratio: 1/1;
            background-color: transparent;
            border: none;
            padding: 0;
            padding-right: 1rem;
            cursor: pointer;
        }

        .add-playlist-button {
            font-size: 3rem;
            color: white;

            &:hover {
                color: var(--col-play);
            }
        }

    }

    .search-comp-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40vw;
        height: 80vh;
        background-color: var(--col-bg);
        border-radius: 2rem;
        box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
    }

    .settings-controls {
        width: 100%;
        height: 3rem;
        display: flex;
        align-items: center;

        .spacer {
            flex: 1 1 auto;
        }
    }

}
</style>
