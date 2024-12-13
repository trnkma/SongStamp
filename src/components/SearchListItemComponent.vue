<template>
    <div class="list-item">
        <div class="list-item__cover">
            <img :src="props.imageSource" alt="cover" />
            <div class="description">{{ props.fullName }}</div>
        </div>
        <!-- <div class="list-item__info">
            <p>{{ props.name }}</p>
        </div> -->
    </div>
</template>


<script lang="ts" setup>
interface Props {
    name?: string;
    fullName?: string;
    description?: string;
    imageSource: string;
}

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.list-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .list-item__cover {
        position: relative;
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 10%;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: relative;
            z-index: -1;
        }

        .description {
            z-index: 1000;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s;
        }

        &:hover .description {
            opacity: 1;
            cursor: pointer;
        }
    }

    .list-item__info {
        width: 100%;
        padding: 1rem;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;

        p {
            width: 100%;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            // overflow: hidden;
        }
    }
}
</style>