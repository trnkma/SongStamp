/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance } from "axios";
import axios from "axios";
import { computed, reactive, ref } from "vue";
import { PlaybackService } from "./PlaybackService";
import type { MyPlaylist, Playlist } from "@/types/SpotifyWebAPI";


const searchUrl = 'https://api.spotify.com/v1/search';
const limit = 50;
let offset = 0;
let searchDelay: string | number | NodeJS.Timeout | null | undefined = null;
let lastSearchedString = '';
let leftOverPlaylists: MyPlaylist[] = [];
const searchLimit = 9;

const playbackService = PlaybackService();

const isLoading = ref(false);

const state = reactive({
    list: ref([] as MyPlaylist[]),
    chosenList: ref([] as MyPlaylist[]),
});

const list = computed(() => state.list);
const chosenList = computed(() => state.chosenList);

const activePlaylist = ref(null as MyPlaylist | null);

const apiClient: AxiosInstance = axios.create({
    baseURL: searchUrl,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('spotify_auth_token')}`,
    },
});

const getPlaylists = async (s: string, accumulatedPlaylists = leftOverPlaylists) => {
    if (!s) {
        state.list = [];
        return;
    }
    isLoading.value = true;
    checkForReset(s);
    if (searchDelay) clearTimeout(searchDelay);
    searchDelay = setTimeout(async () => {
        const response = await apiClient.get(`${searchUrl}?query=${s}&type=playlist&market=ES&offset=${offset}&limit=${limit}`);

        let data = response.data;
        data = {
            playlists: {
                ...data.playlists,
                items: data.playlists.items.filter(
                    (item: any) => item && item.tracks.total >= 100
                )
            }
        };
        data.playlists.items.forEach((playlist: Playlist) => { shortenTitle(playlist) });
        accumulatedPlaylists = [...accumulatedPlaylists, ...data.playlists.items];
        if (accumulatedPlaylists.length < searchLimit) {
            getPlaylists(s, accumulatedPlaylists);
        } else {
            let listpos = state.list.length;
            accumulatedPlaylists.map((playlist: Playlist) => ({ ...playlist, listpos: listpos++ }));
            // accumulatedPlaylists.forEach((playlist: Playlist) => { getTracksOfPlaylist(playlist) });
            state.list = [...state.list, ...accumulatedPlaylists.splice(0, searchLimit)];
            leftOverPlaylists = accumulatedPlaylists;
            isLoading.value = false;
        }
        offset += limit;
    }, 350);
}

const checkForReset = (s: string) => {
    if (s !== lastSearchedString) {
        state.list = [];
        leftOverPlaylists = [];
        offset = 0;
        lastSearchedString = s;
    }
}

const shortenTitle = (playlist: any) => {
    const maxlenght = 30;
    playlist.fullName = playlist.name;
    if (playlist.name.length > maxlenght) {
        playlist.name = playlist.name.substring(0, maxlenght) + '...';
    }
}

const getTracksOfPlaylist = async (playlist: any) => {
    const response = await apiClient.get(playlist.tracks.href);
    const data = await response.data;
    return data.items.map((item: any) => item.track);
}

const orderListByListpos = () => {
    state.list = state.list.sort((a: MyPlaylist, b: MyPlaylist) => a.listpos - b.listpos);
}

const addPlaylist = async (playlist: any) => {
    playlist.songs = await getTracksOfPlaylist(playlist);
    console.log(playlist.songs);
    state.chosenList = [...state.chosenList, playlist];
    state.list = state.list.filter((p: any) => p.id !== playlist.id);
    if (playbackService.state.activeTrack === null) {
        console.log("No active track, setting random song");
        playbackService.setTrackActive(getRandomSong());
    }
}

const getRandomSong = () => {
    const chosenList = getRandomPlaylist();
    const tracks = chosenList.songs;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomIndex];
}

const getRandomPlaylist = () => {
    const randomIndex = Math.floor(Math.random() * state.chosenList.length);
    const randomPlaylist = state.chosenList[randomIndex];
    setPlaylistActive(randomPlaylist);
    console.log(randomPlaylist)
    return randomPlaylist;
}

const setPlaylistActive = (playlist: MyPlaylist) => {
    activePlaylist.value = playlist;
}

const removePlaylist = (playlist: MyPlaylist) => {
    state.chosenList = state.chosenList.filter((p: MyPlaylist) => p.id !== playlist.id);
    state.list = [...state.list, playlist];
    orderListByListpos();
}

const onNextTrackClick = () => {
    playbackService.playTrack(getRandomSong());
}

// const addToQueue = async (trackUri: string) => {

//     apiClient.post(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}`).then((response) => {
//         console.log(response);
//     }).catch((error) => {
//         console.error(error);
//     });
// };


export function TrackService() {
    return {
        list: list,
        chosenList: chosenList,
        activePlaylist: activePlaylist,
        getPlaylists,
        addPlaylist,
        removePlaylist,
        getRandomSong,
        onNextTrackClick,
        isLoading,
    }
}
