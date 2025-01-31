
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
    getCurrentState(): Promise<WebPlaybackState | null>;
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
    player_state_changed: (state: WebPlaybackState | null) => void;
    initialization_error: (error: WebPlaybackError) => void;
    authentication_error: (error: WebPlaybackError) => void;
    account_error: (error: WebPlaybackError) => void;
    playback_error: (error: WebPlaybackError) => void;
}

export interface WebPlaybackState {
    timestamp: number;
    context: {
        uri: string | null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: Record<string, any> | null;
    };
    duration: number;
    paused: boolean;
    shuffle: boolean;
    position: number;
    loading: boolean;
    repeat_mode: 0 | 1 | 2;
    track_window: {
        current_track: WebPlaybackTrack;
        previous_tracks: WebPlaybackTrack[];
        next_tracks: WebPlaybackTrack[];
    };
    restrictions: {
        disallow_seeking_reasons: string[];
        disallow_skipping_next_reasons: string[];
        disallow_skipping_prev_reasons: string[];
        disallow_toggling_repeat_context_reasons: string[];
        disallow_toggling_repeat_track_reasons: string[];
        disallow_toggling_shuffle_reasons: string[];
        disallow_peeking_next_reasons: string[];
        disallow_peeking_prev_reasons: string[];
        undefined: string[];
        disallow_resuming_reasons: string[];
    };
    disallows: {
        seeking?: boolean;
        skipping_next?: boolean;
        skipping_prev?: boolean;
        toggling_repeat_context?: boolean;
        toggling_repeat_track?: boolean;
        toggling_shuffle?: boolean;
        peeking_next?: boolean;
        peeking_prev?: boolean;
        undefined?: boolean;
        resuming?: boolean;
    };
    playback_id: string;
    playback_quality: string;
    playback_features: {
        hifi_status: string;
        playback_speed: {
            current: number;
            selected: number;
            restricted: boolean;
        };
    };
    playback_speed: number;
}

export interface WebPlaybackTrack {
    uri: string;
    id: string | null;
    type: "track" | "episode" | "ad";
    uid: string;
    linked_from: {
        uri: string | null;
        id: string | null;
    };
    media_type: "audio" | "video";
    track_type: "audio" | "video";
    name: string;
    duration_ms: number;
    artists: {
        name: string;
        uri: string;
        url: string;
    }[];
    album: {
        name: string;
        uri: string;
        images: {
            url: string;
            height: number;
            width: number;
            size: string;
        }[];
    };
    is_playable: boolean;
}


export interface WebPlaybackPlayer {
    device_id: string;
}


