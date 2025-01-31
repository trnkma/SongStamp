<template>
    <div>
        <div class="album-wrapper" @click="openDetails($event)">
            <img :src="props.track?.album?.images[0].url" alt="album-image">
            <h1>{{ formattedReleaseDate }}</h1>
        </div>
        <AlbumDetailComponent v-if="showDetails" class="album-detail" :track="props.track" :timeline-mode="false"
            @close="showDetails = false">
        </AlbumDetailComponent>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import AlbumDetailComponent from './AlbumDetailComponent.vue';
import type { Track } from '@/types/SpotifyWebAPI';
interface Props {
    track: Track | null;
}

const showDetails = ref(false);

const openDetails = (event: MouseEvent) => {
    event?.stopPropagation();
    showDetails.value = true;
}
const props = defineProps<Props>();
const formattedReleaseDate = computed(() => {
    if (props.track?.album) {
        const [year] = props.track.album.release_date.split('-');
        return `${year}`;
    } else return null;
});
</script>

<style lang="scss" scoped>
.album-detail {
    z-index: 10000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh
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

    @media(min-width: 1200px) {
        &.hover {
            cursor: pointer;
        }
    }
}
</style>