/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface Paging<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: LinkedFrom;
  restrictions?: Restrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: Restrictions;
  type: "album";
  uri: string;
  artists: Artist[];
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface ExternalIds {
  isrc: string;
  ean: string;
  upc: string;
}

export interface LinkedFrom {
  // Add specific properties if any exist in your real-world data
}

export interface Restrictions {
  reason: string;
}

export interface Playlist {
  collaborative: boolean;
  description: string | null;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: User;
  primary_color: string | null;
  public: boolean | null;
  snapshot_id: string;
  tracks: Paging<PlaylistTrack>;
  type: "playlist";
  uri: string;
}

export interface MyPlaylist extends Playlist {
  listpos: number;
  songs: Track[];
  fullName: string;
}

export interface PlaylistTrack {
  added_at: string | null;
  added_by: User;
  is_local: boolean;
  track: Track;
}

export interface User {
  display_name: string | null;
  external_urls: ExternalUrls;
  followers?: Followers;
  href: string;
  id: string;
  type: "user";
  uri: string;
}

export interface PlaybackState {
  device: Device;
  repeat_state: "off" | "track" | "context";
  shuffle_state: boolean;
  context: Context;
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: Track | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  actions: Actions;
}

export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface Actions {
  disallows: {
    resuming?: boolean;
    skipping_prev?: boolean;
    skipping_next?: boolean;
    // Other disallow actions...
  };
}

export interface PlaylistItemsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: PlaylistItem[];
}

export interface PlaylistItem {
  added_at: string;
  added_by: SpotifyUser;
  is_local: boolean;
  track: Track;
}

interface SpotifyUser {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  type: "user";
  uri: string;
}




