<template>
    <div class="overlay" @click="gameLogicService.displaySongDetails.value = false">
        <div class="album-wrapper" @click="test($event)">
            <img :src="props.songDetails.album.images[0].url" alt="album-image">
            <!-- <h1>Artist: {{ props.album.artists[0].name }}</h1> -->
            <h1>{{ formattedReleaseDate }}</h1>
            <div class="info">
                <h3>{{ songDetails.songName }}</h3>
                <h3>{{ songDetails.artist }}</h3>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GameLogicService } from '@/services/GameLogicService';
import { computed } from 'vue';


interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    songDetails: any;
}
const gameLogicService = GameLogicService.getInstance();
const props = defineProps<Props>();
const formattedReleaseDate = computed(() => {
    const [year] = props.songDetails.album.release_date.split('-');
    return `${year}`;
    // return `${day}.${month}.${year}`;
});
const test = (event: MouseEvent) => {
    event?.stopPropagation()
}

</script>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;

    .album-wrapper {
        padding: 2rem;
        border-radius: 2rem;
        background-color: var(--col-bg);
        width: 50rem;

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
}
</style>