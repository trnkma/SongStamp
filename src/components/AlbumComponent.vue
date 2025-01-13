<template>
    <div class="album-wrapper" @click="openDetails($event)">
        <img :src="props.album.images[0].url" alt="album-image">
        <!-- <h1>Artist: {{ props.album.artists[0].name }}</h1> -->
        <h1>{{ formattedReleaseDate }}</h1>
    </div>
</template>

<script lang="ts" setup>
import { GameLogicService } from '@/services/GameLogicService';
import { computed } from 'vue';
const gameLogicService = GameLogicService.getInstance();
interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    album: any;
    songName?: string;
    artist?: string;
}
const openDetails = (event: MouseEvent) => {
    event?.stopPropagation();
    gameLogicService.showSongDetails(props);
}
const props = defineProps<Props>();
const formattedReleaseDate = computed(() => {
    const [year] = props.album.release_date.split('-');
    return `${year}`;
    // return `${day}.${month}.${year}`;
});
</script>

<style lang="scss" scoped>
.ablum-detail {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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