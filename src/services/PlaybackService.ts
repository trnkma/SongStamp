import axios, { type AxiosInstance } from "axios";
import { ref, reactive, computed } from "vue";
import { AuthService } from "./AuthService";
import type { SpotifyPlayer, WebPlaybackPlayer, WebPlaybackState, WebPlaybackTrack } from "@/types/SpotifyWebSDK";
import type { Track } from "@/types/SpotifyWebAPI";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { onSpotifyWebPlaybackSDKReady: () => void; Spotify: any; } } //no idea how this object actually looks like

export class PlaybackService {
    private apiClient: AxiosInstance;
    private authService = AuthService();
    private static instance: PlaybackService;

    private _state = reactive({
        player: null as SpotifyPlayer | null,
        deviceID: null as string | null,
        isLoadingPlayer: ref(true),
        isPlaying: ref(false),
        activeTrack: ref(null as WebPlaybackTrack | null),
        position: ref(undefined as number | undefined),
        playerState: ref(null),
        repeatSet: false,
    });

    private constructor() {
        this.apiClient = axios.create({
            baseURL: "https://api.spotify.com/v1",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("spotify_auth_token")}`,
            },
        });
        this.init();
    }

    public static getInstance(): PlaybackService {
        if (!PlaybackService.instance) {
            PlaybackService.instance = new PlaybackService();
        }
        return PlaybackService.instance;
    }

    public get isLoadingPlayer() {
        return computed(() => this._state.isLoadingPlayer);
    }

    public get isPlaying() {
        return computed(() => this._state.isPlaying);
    }

    // public get hasTrack() {
    //     return computed(() => !!this.trackService.activeTrack);
    // }

    public get state() {
        return this._state;
    }

    public togglePlay(): void {
        this._state.player?.togglePlay();
    }

    public playTrack(track: Track | null): void {
        if (!track) return;
        console.log(track);
        this.apiClient.put("/me/player/play", { uris: [track.uri] }).then(() => {
            // this.apiClient.put('/me/player/repeat?state=track');
        });
    }

    private init(): void {
        const existingScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
        if (existingScript) {
            console.warn("Spotify script is already loaded.");
            this.createPlayer(localStorage.getItem("spotify_auth_token")!);
            return;
        }
        const spotifyScript = document.createElement("script");
        spotifyScript.src = "https://sdk.scdn.co/spotify-player.js";
        spotifyScript.async = true;
        document.body.appendChild(spotifyScript);

        spotifyScript.onload = () => {
            console.info("Spotify SDK loaded");
        };

        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = localStorage.getItem("spotify_auth_token");
            if (token) {
                this.createPlayer(token)
            };
        };
    }

    private createPlayer(token: string): void {
        this._state.player = new window.Spotify.Player({
            name: "Vue Spotify Player",
            getOAuthToken: (cb: (token: string) => void) => cb(token),
            volume: 0.5,
        });

        if (!this._state.player) return;

        this._state.player.addListener("initialization_error", ({ message }: { message: string }) =>
            console.error("Initialization Error:", message)
        );
        this._state.player.addListener("authentication_error", ({ message }: { message: string }) =>
            console.error("Authentication Error:", message)
        );
        this._state.player.addListener("account_error", ({ message }: { message: string }) =>
            console.error("Account Error:", message)
        );
        this._state.player.addListener("playback_error", ({ message }: { message: string }) =>
            console.error("Playback Error:", message)
        );

        this._state.player.addListener("player_state_changed", (stateData: WebPlaybackState | null) => {
            this.setPlayingStatus(!stateData?.paused);
            this._state.position = stateData?.position;
            if (!this._state.repeatSet && !stateData?.paused && !stateData?.loading) {
                this.apiClient.put("/me/player/repeat?state=track").then(() => {
                    this._state.repeatSet = true;
                });
            }
            if (stateData?.paused && stateData?.position === 0 && stateData?.track_window.next_tracks.length === 0) {
                this._state.activeTrack = null;
                console.log(this._state.activeTrack);
            }
        });

        this._state.player.addListener("ready", (result: WebPlaybackPlayer) => {
            this._state.deviceID = result.device_id;
            console.log("Ready with Device ID:", result.device_id);
            this.activateDevice(result.device_id);
        });

        this._state.player.addListener("not_ready", (result: WebPlaybackPlayer) => {
            console.warn("Device went offline:", result.device_id);
        });

        this._state.player.connect();
    }

    private async reconnect(): Promise<void> {

        const tokenResponse = await this.authService.requestNewToken();
        localStorage.setItem("spotify_auth_token", tokenResponse.access_token);
        localStorage.setItem("refresh_token", tokenResponse.refresh_token);

        this.activateDevice(this._state.deviceID!);
    }

    private async activateDevice(deviceId: string): Promise<void> {
        try {
            await this.apiClient.put("/me/player", { device_ids: [deviceId] });
            console.info("Device activated");
            this._state.isLoadingPlayer = false;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.warn("Device not found. Reconnecting...");
                this.reconnect();
            }
            console.error("Error activating device:", error);
        }
    }

    private setPlayingStatus(status: boolean): void {
        this._state.isPlaying = status;
    }

}
