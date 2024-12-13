<template>
    <div class="search-wrapper" v-click-outside="handleClickOutside" @click="showList = true">
        <input ref="searchInput" type="text" v-model="value"
            @input="onInputChange(($event.target as HTMLInputElement).value)" />

        <div class="chosen-playlists" v-if="trackService.chosenList.value.length > 0">
            <button v-for="(item, index) in trackService.chosenList.value" :key="index"
                @click="onChosenItemClick(item)">
                <SearchListItemComponent :image-source="item.images[0]?.url"></SearchListItemComponent>
            </button>
        </div>

        <!-- <app-loading v-if="isLoading" /> -->

        <div class="list-wrapper" v-if="showList"
            :class="{ hidden: !showList, getHeight: trackService.list.value.length !== 0 }">
            <button v-for="(item, index) in trackService.list.value" :key="index" @click="onItemClick(item)">
                <SearchListItemComponent :image-source="item.images[0]?.url"></SearchListItemComponent>
                <!-- <div class="tooltip">{{ item.fullName }}</div> -->
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrackService } from '@/services/TrackService';
import { ref } from 'vue';
import SearchListItemComponent from './SearchListItemComponent.vue';
import vClickOutside from '../directives/ClickOutsideDirective';


const value = ref('');
const showList = ref(false);
const trackService = TrackService();



const handleClickOutside = () => {
    showList.value = false;
};

const onInputChange = (s: string) => {
    trackService.getPlaylists(s);
};

const onItemClick = (playlist: any) => {
    console.log(playlist);
    trackService.addPlaylist(playlist);
};
const onChosenItemClick = (playlist: any) => {
    trackService.removePlaylist(playlist);
};
</script>

<style lang="scss" scoped>
.search-wrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: var(--base-gap);
    border-radius: 0 0 20px 20px;
    box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
    max-height: 100%;
    height: 100%;
    width: 100%;


    button {
        padding: 0 1.5rem 1.5rem 0;
    }

    input {
        margin: 1.5rem 1.5rem 0 1.5rem;
        border: 2px solid transparent;
        border-radius: 2rem;
        width: calc(100% - 3rem);
        // height: 4rem;
        padding: 1rem;
        background-color: var(--col-bg-secondary);
        color: white;
        font-size: 20px;

        &:focus {
            outline: none;
            border: 2px solid white;
        }
    }

    .chosen-playlists {
        box-sizing: border-box;
        z-index: 1000;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
        width: 100%;
        height: 10rem;
        display: flex;
        flex-wrap: wrap;
        padding: 1.5rem 0 0 1.5rem;

        button {
            height: 100%;
            aspect-ratio: 1/1;
            background-color: transparent;
            border: none;
        }

    }

    .list-wrapper {
        padding: 1.5rem 0 0 1.5rem;
        max-height: 60vh;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;

        // &.getHeight {
        //     max-height: 60vh;
        // }

        &.hidden {
            display: none;
        }

        button {
            position: relative;
            width: fit-content;
            display: block;
            flex-grow: 1;
            width: 33.333333%;
            max-width: 33.333333%;
            display: flex;
            align-items: flex-start;
            background-color: transparent;
            border: none;

            .tooltip {
                display: none;
                position: absolute;
                background-color: var(--col-bg-secondary);
                color: white;
                padding: 0.5rem;
                border-radius: 0.5rem;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000;
            }

            &:hover .tooltip {
                display: block;
            }
        }
    }
}

::-webkit-scrollbar {
    display: block;
    width: 0px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: var(--col-button-play);
    border-right: none;
    border-left: none;
    height: 50px;
}

::-webkit-scrollbar-track-piece:end {
    background: transparent;
    margin-bottom: 30px;
}

::-webkit-scrollbar-track-piece:start {
    background: transparent;
    margin-top: 10px;
}
</style>