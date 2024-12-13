/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WebPlaybackPlayer } from '@/interfaces/Spotify';
import axios, { type AxiosInstance } from 'axios';
import { ref, reactive, computed, type Ref } from 'vue';
import { SnackbarService } from './SnackBarService';
import { AuthService } from './AuthService';
import type { Track } from '@/types/SpotifyWebAPI';

export interface PlaybackService {
    isLoadingPlayer: Readonly<Ref<boolean>>;
    isPlaying: Readonly<Ref<boolean>>;
    togglePlay: () => void;
    hasTrack: Readonly<Ref<boolean>>;
    state: any;
    playTrack: (track: Track) => void;
    onPlayButtonClick: () => void;
    setTrackActive: (track: any) => void;
}

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

// Singleton State
let instance: PlaybackService | null = null;

export function PlaybackService(): PlaybackService {
    if (instance) {
        return instance;
    }

    const authService = AuthService();
    const snackbarService = SnackbarService();

    const state = reactive({
        player: null as any,
        deviceID: null as string | null,
        isLoadingPlayer: ref(true),
        isPlaying: ref(false),
        activeTrack: ref(null as any),
        position: ref(null as number | null),
        playerState: ref(null),
        repeatSet: false,
    });

    console.log(state.player);

    const isLoadingPlayer = computed(() => state.isLoadingPlayer);
    const isPlaying = computed(() => state.isPlaying);
    const hasTrack = computed(() => state.activeTrack ? true : false);

    const apiClient: AxiosInstance = axios.create({
        baseURL: 'https://api.spotify.com/v1',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('spotify_auth_token')}`,
        },
    });

    const init = () => {
        const existingScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
        if (existingScript) {
            console.warn('Spotify script is already loaded.');              //fixing hot reaload issue
            createPlayer(localStorage.getItem('spotify_auth_token')!);
            return;
        }
        const spotifyScript = document.createElement('script');
        spotifyScript.src = 'https://sdk.scdn.co/spotify-player.js';
        spotifyScript.async = true;
        document.body.appendChild(spotifyScript);

        spotifyScript.onload = () => {
            console.info('Spotify SDK loaded');
        }
        console.log(document.body)
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = localStorage.getItem('spotify_auth_token');
            if (!token) {
                snackbarService.showBar('Authentication token not found. Please log in again.', 'Log in', authService.login);
                return;
            }
            createPlayer(token);
        };
    };

    const createPlayer = (token: string) => {
        state.player = new window.Spotify.Player({
            name: 'Vue Spotify Player',
            getOAuthToken: (cb: (token: string) => void) => cb(token),
            volume: 0.5,
        });

        if (!state.player) return;

        // Error Handling
        state.player.addListener('initialization_error', ({ message }: { message: string }) =>
            console.error('Initialization Error:', message)
        );
        state.player.addListener('authentication_error', ({ message }: { message: string }) =>
            console.error('Authentication Error:', message)
        );
        state.player.addListener('account_error', ({ message }: { message: string }) =>
            console.error('Account Error:', message)
        );
        state.player.addListener('playback_error', ({ message }: { message: string }) =>
            console.error('Playback Error:', message)
        );

        // Playback Updates
        state.player.addListener('player_state_changed', (stateData: any) => {
            if (!stateData) {
                snackbarService.showBar('Spotify disconnected', 'Reconnect', reconnect);
                return;
            }
            setPlayingStatus(!stateData.paused);
            state.position = stateData.position;
            console.log(stateData)
            getActiveTrack();
            if (!state.repeatSet && !stateData.paused && !stateData.loading) {
                apiClient.put('/me/player/repeat?state=track').then(() => {
                    state.repeatSet = true;
                });
            };
            if (stateData.paused && stateData.position === 0 && stateData.track_window.next_tracks.length === 0) {
                state.activeTrack = null;
                console.log(state.activeTrack);
            }
        });

        // Player Ready
        state.player.addListener('ready', (result: WebPlaybackPlayer) => {
            state.deviceID = result.device_id;
            console.log('Ready with Device ID:', result.device_id);
            activateDevice(result.device_id);
        });

        // Player Not Ready
        state.player.addListener('not_ready', (result: WebPlaybackPlayer) => {
            console.warn('Device went offline:', result.device_id);
        });


        state.player.connect();
    };

    const togglePlay = () => {
        state.player?.togglePlay();
    };


    const getActiveTrack = async () => {
        state.player?.getCurrentState().then((stateData: any) => {
            if (!stateData) return;
            state.activeTrack = stateData.track_window.current_track;
        });
    };

    const reconnect = async () => {
        try {
            const tokenResponse = await authService.requestNewToken();
            localStorage.setItem('spotify_auth_token', tokenResponse.access_token);
            localStorage.setItem('refresh_token', tokenResponse.refresh_token);

            activateDevice(state.deviceID!);
        } catch (error) {
            console.error('Error reconnecting:', error);
            snackbarService.showBar('Reconnection failed. Please try again.', 'Retry', reconnect);
        }
    };

    const activateDevice = async (deviceId: string) => {
        try {
            await apiClient.put('/me/player', { device_ids: [deviceId] });
            console.info('Device activated');
            state.isLoadingPlayer = false;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.warn('Device not found. Reconnecting...');
                reconnect();
            }
            console.error('Error activating device:', error);
        }
    };

    const setPlayingStatus = (status: boolean) => {
        state.isPlaying = status;
    };

    const setActiveTrack = (track: any) => {
        state.activeTrack = track;
    }

    const playTrack = (track: Track) => {
        console.log(track)
        apiClient.put('/me/player/play', { uris: [track.uri] }).then(() => {
            // apiClient.put('/me/player/repeat?state=track');
        });
    }

    const onPlayButtonClick = () => {
        if (state.activeTrack) {
            if (state.position !== null) togglePlay();
            else playTrack(state.activeTrack);
        }
    }

    if (!state.player) {
        init();
    }
    // Assign the singleton instance
    instance = {
        isLoadingPlayer: isLoadingPlayer,
        isPlaying: isPlaying,
        togglePlay,
        hasTrack: hasTrack,
        state,
        playTrack: playTrack,
        onPlayButtonClick,
        setTrackActive: setActiveTrack
    };

    return instance;
}