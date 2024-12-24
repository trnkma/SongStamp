<template>
    <div class="search-wrapper" v-click-outside="handleClickOutside" @click="showList = true">
        <input ref="searchInput" type="text" v-model="value"
            @input="onInputChange(($event.target as HTMLInputElement).value)" />



        <!-- <app-loading v-if="isLoading" /> -->

        <div class="list-wrapper" :class="{ getHeight: trackService.list.value.length !== 0 }">
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
import { ref, defineEmits } from 'vue';
import SearchListItemComponent from './SearchListItemComponent.vue';
import vClickOutside from '../directives/ClickOutsideDirective';


const value = ref('');
const showList = ref(false);
const trackService = TrackService.getInstance();

const emit = defineEmits(['close']);


const handleClickOutside = () => {
    showList.value = false;
};

const onInputChange = (s: string) => {
    trackService.getPlaylists(s);
};

const onItemClick = (playlist: any) => {
    console.log(playlist);
    trackService.addPlaylist(playlist);
    emit('close');
};

</script>

<style lang="scss" scoped>
.search-wrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: var(--base-gap);
    max-height: 100%;
    height: 100%;
    width: 100%;


    button {
        padding: 0 1.5rem 1.5rem 0;
    }

    input {
        margin: 1.5rem 1.5rem 1.5rem 1.5rem;
        border: 2px solid transparent;
        border-radius: 2rem;
        width: calc(100% - 3rem);
        // height: 4rem;
        padding: 1rem;
        background-color: var(--col-bg-secondary);
        color: white;
        font-size: 2rem;

        &:focus {
            outline: none;
            border: 2px solid white;
        }
    }

    .list-wrapper {
        padding: 1.5rem 0 0 1.5rem;
        // height: calc(100% - 4.7rem);
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
            aspect-ratio: 1/1;
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