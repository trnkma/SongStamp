<template>
    <div class="search-wrapper" v-click-outside="handleClickOutside" @click="showList = true">
        <div class="close-wrapper">
            <CloseButtonComponent @click="emit('close')"></CloseButtonComponent>
        </div>
        <div class="input-wrapper">
            <input ref="searchInput" type="text" v-model="inputValue" placeholder="Search playlists..."
                @input="onInputChange(($event.target as HTMLInputElement).value)" />
            <button v-if="inputValue" @click="clearInput()">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#e8eaed">
                    <path
                        d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            </button>
        </div>

        <LoadingComponent class="loading-comp" v-if="trackService.isLoading.value" />

        <div class="list-wrapper" :class="{ getHeight: trackService.list.value.length !== 0 }">
            <button class="list-item" v-for="(item, index) in trackService.list.value" :key="index"
                @click="onItemClick(item)">
                <SearchListItemComponent :image-source="item.images[0]?.url" :name="item.name">
                </SearchListItemComponent>
                <!-- <div class="tooltip">{{ item.fullName }}</div> -->
            </button>
            <div v-if="inputValue && trackService.list.value.length > 0 && !trackService.isLoading.value"
                class="more-items-wrapper">
                <button @click="loadMore()">Load more</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { TrackService } from '@/services/TrackService';
import { ref, defineEmits } from 'vue';
import SearchListItemComponent from './SearchListItemComponent.vue';
import vClickOutside from '../directives/ClickOutsideDirective';
import type { MyPlaylist } from '@/types/SpotifyWebAPI';
import LoadingComponent from './LoadingComponent.vue';
import CloseButtonComponent from './shared/CloseButtonComponent.vue';


const inputValue = ref('');
const showList = ref(false);
const trackService = TrackService.getInstance();

const emit = defineEmits(['close']);


const handleClickOutside = () => {
    showList.value = false;
};

const onInputChange = (s: string) => {
    trackService.getPlaylists(s);
};

const onItemClick = (playlist: MyPlaylist) => {
    trackService.addPlaylist(playlist);
    emit('close');
};

const loadMore = () => {
    trackService.getPlaylists(inputValue.value);
}

const clearInput = () => {
    inputValue.value = '';
    trackService.resetPlaylists();
}

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

    .loading-comp {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.514);
    }

    .close-wrapper {
        display: flex;
        align-items: center;

        button {
            background-color: transparent;
            border: none;
            display: flex;
            align-items: center;
            padding: 0;
            margin: 1rem 1rem 1rem auto;
        }
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        position: relative;

        input {
            margin: 0 1.5rem 1.5rem 1.5rem;
            border: 2px solid transparent;
            border-radius: 2rem;
            width: calc(100% - 3rem);
            padding: 1rem;
            background-color: var(--col-bg-secondary);
            color: white;
            font-size: 2rem;

            &:focus {
                outline: none;
                border: 2px solid white;
            }
        }

        button {
            background-color: transparent;
            border: none;
            display: flex;
            align-items: center;
            padding: 0;
            margin: 0;
            position: absolute;
            right: 2.5rem;
            top: 1.2rem;
        }

    }

    .list-wrapper {
        padding: 1.5rem 0 0 1.5rem;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;



        &.hidden {
            display: none;
        }

        >.list-item {
            padding: 0 1.5rem 1.5rem 0;
            position: relative;
            width: fit-content;
            flex-grow: 1;
            width: 33.333333%;
            max-width: 33.333333%;
            display: flex;
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

        .more-items-wrapper {
            width: 100%;
            display: flex;
            justify-content: center;

            button {
                background-color: #1ED760;
                border-radius: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                color: white;
                border: none;
                padding: 1rem;
                margin: 1.5rem;
                margin-top: 0;
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