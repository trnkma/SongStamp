import { ref, watch } from "vue";
import { AuthService } from "./AuthService";
import type { SpotifyPlayer, WebPlaybackPlayer, WebPlaybackState } from "@/types/SpotifyWebSDK";
import type { Track } from "@/types/SpotifyWebAPI";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { onSpotifyWebPlaybackSDKReady: () => void; Spotify: any; } } //no idea how this object actually looks like

export class PlaybackService {
    private apiClient;
    private authService = AuthService.getInstance();
    private static instance: PlaybackService;

    private player: SpotifyPlayer | null = null;
    private deviceID: string | null = null;
    isPlaying = ref(false);
    private repeatSet = false;

    private constructor() {
        this.apiClient = axios.create({
            baseURL: "https://api.spotify.com/v1",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.authService.access_token.value}`,
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


    public togglePlay(): void {
        this.player?.togglePlay();
    }

    public playTrack(track: Track | null): void {
        console.log(this.deviceID)
        if (!track) return;
        console.log(track);
        this.apiClient?.put("/me/player/play", { uris: [track.uri] }).then(() => { });
    }

    init() {
        const existingScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
        watch(this.authService.access_token, (newToken) => {
            console.log("sensed change in the token ~");
            this.apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
            this.createPlayer(newToken);
        });
        if (existingScript) {
            console.warn("Spotify script is already loaded.");
            this.createPlayer(this.authService.access_token.value);
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
            this.createPlayer(this.authService.access_token.value);
        };
    }

    private createPlayer(token: string): void {
        this.player = new window.Spotify.Player({
            name: "Vue Spotify Player",
            getOAuthToken: (cb: (token: string) => void) => cb(token),
            volume: 0.5,
        });
        if (!this.player) return;

        this.player.addListener("initialization_error", ({ message }: { message: string }) =>
            console.error("Initialization Error:", message)
        );
        this.player.addListener("authentication_error", ({ message }: { message: string }) =>
            console.error("Authentication Error:", message)
        );
        this.player.addListener("account_error", ({ message }: { message: string }) =>
            console.error("Account Error:", message)
        );
        this.player.addListener("playback_error", ({ message }: { message: string }) =>
            console.error("Playback Error:", message)
        );

        this.player.addListener("player_state_changed", (stateData: WebPlaybackState | null) => {
            this.isPlaying.value = !stateData?.paused;

            console.log(stateData)
            if (!this.repeatSet && !stateData?.paused && !stateData?.loading) {
                this.apiClient?.put("/me/player/repeat?state=track").then(() => {
                    this.repeatSet = true;
                });
            }
            if (stateData?.paused && stateData?.position === 0 && stateData?.track_window.next_tracks.length === 0) {

            }
        });

        this.player.addListener("ready", (result: WebPlaybackPlayer) => {
            this.deviceID = result.device_id;
            console.log("Ready with Device ID:", this.deviceID);
            this.activateDevice(result.device_id);
        });

        this.player.addListener("not_ready", (result: WebPlaybackPlayer) => {
            console.warn("Device went offline:", result.device_id);
        });

        this.player.connect();
    }

    private async reconnect(): Promise<void> {
        await this.authService.getRefreshToken();
    }

    private async activateDevice(deviceId: string): Promise<void> {
        try {
            await this.apiClient?.put("/me/player", { device_ids: [deviceId] });
            console.info("Device activated");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 401) {
                console.warn("Device not found. Reconnecting...");
                this.reconnect();
            }
            console.error("Error activating device:", error);
            this.reconnect();
        }
    }
}
