<template>
    <div class="overlay" @click="close($event)">
        <div class="album-wrapper" @click="onClick($event)">
            <img :src="props.songDetails.album?.images[0].url" alt="album-image">
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
import { type SongDetails } from '@/services/GameLogicService';
import { computed } from 'vue';

interface Props {
    songDetails: SongDetails;
}
const props = defineProps<Props>();

const emit = defineEmits(['close']);

const formattedReleaseDate = computed(() => {
    if (props.songDetails.album) {
        const [year] = props.songDetails.album?.release_date.split('-');
        return `${year}`;
    } else return null;
    // return `${day}.${month}.${year}`;
});
const onClick = (event: MouseEvent) => {
    event?.stopPropagation()
}

const close = (event: MouseEvent) => {
    event?.stopPropagation();
    emit('close');
}

</script>

<style lang="scss" scoped>
.overlay {
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
        width: 90vw;

        @media(min-width: 1024px) {
            width: 40vw;
        }

        img {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
        }

        h1 {
            text-align: center;
        }
    }
}
</style>