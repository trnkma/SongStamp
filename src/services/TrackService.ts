/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance } from "axios";
import axios from "axios";
import { computed, reactive, ref } from "vue";
import type { Track, MyPlaylist, Playlist } from "@/types/SpotifyWebAPI";

export class TrackService {
    // private playbackService: PlaybackService;
    private static instance: TrackService;
    private apiClient: AxiosInstance;
    private searchUrl = "https://api.spotify.com/v1/search";
    private limit = 50;
    private offset = 0;
    private searchDelay: number | null | undefined = null;
    private lastSearchedString = "";
    private leftOverPlaylists: MyPlaylist[] = [];
    private searchLimit = 18;

    public isLoading = ref(false);
    public activePlaylist = ref<MyPlaylist | null>(null);

    private state = reactive({
        list: ref<MyPlaylist[]>([]),
        chosenList: ref<MyPlaylist[]>([]),
        activeTrack: ref<Track | null>(null)
    });
    public activeTrack = ref<Track | null>(null);

    private constructor() {
        // this.playbackService = PlaybackService.getInstance();
        this.apiClient = axios.create({
            baseURL: this.searchUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("spotify_auth_token")}`,
            },
        });
    }

    public static getInstance(): TrackService {
        if (!TrackService.instance) {
            TrackService.instance = new TrackService();
        }
        return TrackService.instance;
    }

    public get list() {
        return computed(() => this.state.list);
    }

    public get chosenList() {
        return computed(() => this.state.chosenList);
    }

    public async getPlaylists(s: string, accumulatedPlaylists = this.leftOverPlaylists): Promise<void> {
        if (!s) {
            this.state.list = [];
            return;
        }
        this.isLoading.value = true;
        this.checkForReset(s);
        if (this.searchDelay) clearTimeout(this.searchDelay);
        this.searchDelay = setTimeout(async () => {
            const response = await this.apiClient.get(
                `${this.searchUrl}?query=${s}&type=playlist&market=ES&offset=${this.offset}&limit=${this.limit}`
            );

            let data = response.data;
            data = {
                playlists: {
                    ...data.playlists,
                    items: data.playlists.items.filter(
                        (item: any) => item && item.tracks.total >= 100
                    ),
                },
            };

            data.playlists.items.forEach((playlist: Playlist) => {
                this.shortenTitle(playlist as MyPlaylist);
            });

            accumulatedPlaylists = [...accumulatedPlaylists, ...data.playlists.items];

            console.log(accumulatedPlaylists)

            if (accumulatedPlaylists.length < this.searchLimit) {
                await this.getPlaylists(s, accumulatedPlaylists);
            } else {
                let listpos = this.state.list.length;
                accumulatedPlaylists.map((playlist: Playlist) => ({ ...playlist, listpos: listpos++ }));

                this.state.list = [
                    ...this.state.list,
                    ...accumulatedPlaylists.splice(0, this.searchLimit),
                ];
                this.leftOverPlaylists = accumulatedPlaylists;
                this.isLoading.value = false;
            }
            this.offset += this.limit;
        }, 350);
    }

    private checkForReset(s: string): void {
        if (s !== this.lastSearchedString) {
            this.state.list = [];
            this.leftOverPlaylists = [];
            this.offset = 0;
            this.lastSearchedString = s;
        }
    }

    private shortenTitle(playlist: MyPlaylist): void {
        const maxLength = 30;
        playlist.fullName = playlist.name;
        if (playlist.name.length > maxLength) {
            playlist.name = playlist.name.substring(0, maxLength) + "...";
        }
    }

    private async getTracksOfPlaylist(playlist: Playlist): Promise<any[]> {
        const response = await this.apiClient.get(playlist.tracks.href);
        const data = await response.data;
        return data.items.map((item: any) => item.track);
    }

    public async addPlaylist(playlist: any): Promise<void> {
        playlist.songs = await this.getTracksOfPlaylist(playlist);
        this.state.chosenList = [...this.state.chosenList, playlist];
        this.state.list = this.state.list.filter(
            (p: Playlist) => p.id !== playlist.id
        );
        // if (this.activeTrack.value === null) {
        //     console.log("No active track, setting random song");
        //     this.activeTrack.value = this.getRandomSong();
        // }
    }

    public removePlaylist(playlist: MyPlaylist): void {
        this.state.chosenList = this.state.chosenList.filter(
            (p: MyPlaylist) => p.id !== playlist.id
        );
        this.state.list = [...this.state.list, playlist];
        this.orderListByListpos();
    }

    private orderListByListpos(): void {
        this.state.list = this.state.list.sort(
            (a: MyPlaylist, b: MyPlaylist) => a.listpos - b.listpos
        );
    }

    public getRandomSong(): Track | null {
        if (this.state.chosenList?.length === 0) return null;
        const chosenList = this.getRandomPlaylist();
        // const tracks = chosenList.songs;
        const [song] = chosenList.songs.splice(Math.floor(Math.random() * chosenList.songs.length), 1);
        // const randomIndex = Math.floor(Math.random() * tracks.length);
        // this.activeTrack.value = tracks[randomIndex];
        return song;
    }

    public getNexSong(): Track | null {
        if (this.state.chosenList?.length === 0) return null;
        const chosenList = this.getRandomPlaylist();
        // const tracks = chosenList.songs;
        const [song] = chosenList.songs.splice(Math.floor(Math.random() * chosenList.songs.length), 1);
        // const randomIndex = Math.floor(Math.random() * tracks.length);
        // this.activeTrack.value = tracks[randomIndex];
        this.activeTrack.value = song;
        return song;
    }

    public setRandomSong() {
        this.activeTrack.value = this.getRandomSong();
    }

    private getRandomPlaylist(): MyPlaylist {
        const randomIndex = Math.floor(Math.random() * this.state.chosenList.length);
        const randomPlaylist = this.state.chosenList[randomIndex];
        this.setPlaylistActive(randomPlaylist);
        return randomPlaylist;
    }

    private setPlaylistActive(playlist: MyPlaylist): void {
        this.activePlaylist.value = playlist;
    }

    public getCurrentAlbum() {
        console.log(this.activeTrack.value?.album)
        return this.activeTrack.value?.album;
    }
}
