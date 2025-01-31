<template>
    <div class="overlay" @click="close($event)">
        <div class="album-wrapper" @click="onClick($event)">
            <img :src="props.track?.album?.images[0].url" alt="album-image">
            <h1>{{ formattedReleaseDate }}</h1>
            <div v-if="!timelineMode" class="info">
                <h3>{{ track?.name }}</h3>
                <h3>{{ track?.artists[0].name }}</h3>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Track } from '@/types/SpotifyWebAPI';
import { computed } from 'vue';

interface Props {
    track: Track | null;
    timelineMode: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['close']);

const formattedReleaseDate = computed(() => {
    if (props.track?.album) {
        const [year] = props.track?.album?.release_date.split('-');
        return `${year}`;
    } else return null;
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

        @media(min-width: 1200px) {
            width: 40vw;
            max-width: 60rem;
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