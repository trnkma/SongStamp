<template>
    <div class="album-wrapper">
        <img :src="props.album.images[0].url" alt="album-image">
        <!-- <h1>Artist: {{ props.album.artists[0].name }}</h1> -->
        <h1>{{ formattedReleaseDate }}</h1>
        <div class="info">
            <h3>{{ songName }}</h3>
            <h3>{{ artist }}</h3>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';


interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    album: any;
    songName?: string;
    artist?: string;
}

const props = defineProps<Props>();
const formattedReleaseDate = computed(() => {
    const [year] = props.album.release_date.split('-');
    return `${year}`;
    // return `${day}.${month}.${year}`;
});
</script>

<style lang="scss" scoped>
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