import type { PlaybackState } from "./SpotifyWebAPI";

export interface WebPlaybackSDKInit {
    name: string; // The name of the playback session
    getOAuthToken: (callback: (token: string) => void) => void; // Function to fetch a valid token
    volume?: number; // Initial volume (0 to 1)
}

export interface WebPlaybackError {
    message: string; // Error message
}

export interface WebPlaybackReady {
    device_id: string; // The device ID assigned to this playback session
}

export interface SpotifyPlayer {
    connect(): Promise<boolean>;
    disconnect(): void;
    getCurrentState(): Promise<PlaybackState | null>;
    setName(name: string): Promise<void>;
    setVolume(volume: number): Promise<void>;
    getVolume(): Promise<number>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(positionMs: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
    addListener<T extends keyof SpotifyPlayerListeners>(
        event: T,
        callback: SpotifyPlayerListeners[T]
    ): boolean;
    removeListener<T extends keyof SpotifyPlayerListeners>(
        event: T,
        callback?: SpotifyPlayerListeners[T]
    ): boolean;
}

export interface SpotifyPlayerListeners {
    ready: (ready: WebPlaybackReady) => void;
    not_ready: (ready: WebPlaybackReady) => void;
    player_state_changed: (state: PlaybackState | null) => void;
    initialization_error: (error: WebPlaybackError) => void;
    authentication_error: (error: WebPlaybackError) => void;
    account_error: (error: WebPlaybackError) => void;
    playback_error: (error: WebPlaybackError) => void;
}


