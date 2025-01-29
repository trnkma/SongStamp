<template>
    <div>
        <div class="album-wrapper" @click="openDetails($event)">
            <img :src="props.album?.images[0].url" alt="album-image">
            <!-- <h1>Artist: {{ props.album.artists[0].name }}</h1> -->
            <h1>{{ formattedReleaseDate }}</h1>
        </div>
        <AlbumDetailComponent v-if="showDetails" class="album-detail" :song-details="props"
            @close="showDetails = false">
        </AlbumDetailComponent>
    </div>
</template>

<script lang="ts" setup>
import { type SongDetails } from '@/services/GameLogicService';
import { computed, ref } from 'vue';
import AlbumDetailComponent from './AlbumDetailComponent.vue';
// const gameLogicService = GameLogicService.getInstance();

const showDetails = ref(false);

const openDetails = (event: MouseEvent) => {
    event?.stopPropagation();
    // gameLogicService.showSongDetails(props);
    showDetails.value = true;
}
const props = defineProps<SongDetails>();
const formattedReleaseDate = computed(() => {
    if (props.album) {
        const [year] = props.album?.release_date.split('-');
        return `${year}`;
    } else return null;
    // return `${day}.${month}.${year}`;
});
</script>

<style lang="scss" scoped>
.album-detail {
    z-index: 10000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
}

.album-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 2rem;

    img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
    }

    h1 {
        text-align: center;
    }

    // .info {
    //     background-color: rgba(0, 0, 0, 0.555);
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     opacity: 0;
    // }

    // &:hover {
    //     .info {
    //         opacity: 1;
    //     }
    // }
}
</style>