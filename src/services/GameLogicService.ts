import type { Track } from "@/types/SpotifyWebAPI";
import { computed, ref } from "vue";
import { TrackService } from "./TrackService";
import { PlaybackService } from "./PlaybackService";

export interface Team {
    id: number;
    name: string | null;
    timeline: Array<Track | null>;
    isActive: boolean
    display: boolean;
}
export class GameLogicService {
    private static instance: GameLogicService;
    private playbackService: PlaybackService;
    private trackService: TrackService;
    private _teams = ref<Team[]>([]);
    public playingTeam = computed(() => this.getActiveTeam());
    public displayedTeam = computed(() => this.getDisplayedTeam());
    public currentlyPlayingTrack = ref<Track | null>(null);
    public showResult = ref(false);

    private constructor() {
        this.trackService = TrackService.getInstance();
        this.playbackService = PlaybackService.getInstance();
    }

    public static getInstance(): GameLogicService {
        if (!GameLogicService.instance) {
            GameLogicService.instance = new GameLogicService();
        }
        return GameLogicService.instance;
    }

    public get teams() {
        return this._teams;
    }

    public addTeam() {
        this._teams.value.push({ id: this._teams.value.length, name: null, timeline: [], isActive: false, display: false });
    }
    public updateTeamName(id: number, name: string | null) {
        const team = this.teams.value.find((t) => t.id === id);
        if (team) {
            team.name = name;
        }
    }
    public removeTeam(id: number) {
        this._teams.value = this._teams.value.filter(team => team.id !== id);
    }

    public getActiveTeam(): Team | undefined {
        return this._teams.value.find(team => team.isActive);
    }

    public getDisplayedTeam(): Team | undefined {
        return this._teams.value.find(team => team.display);
    }

    public setDisplayedTeam(teamToDisplay: Team | undefined) {
        this._teams.value.forEach(team => team.display = false);
        if (teamToDisplay) {
            const team = this._teams.value.find(team => team === teamToDisplay);
            if (team) {
                team.display = true;
            }
        }
    }

    private creatStartPointsForTeams() {
        this._teams.value.forEach(team => {
            team.timeline.push(this.trackService.getRandomSong());
        });
        this._teams.value[0].isActive = true;
    }


    public makeGuessBefore(after: Track, before?: Track) {
        this.currentlyPlayingTrack.value = this.trackService.activeTrack.value as Track;
        const currentlyPlayingTrack = this.trackService.activeTrack.value as Track;
        if (before) {
            if (this.checkIfInRange(before, after, currentlyPlayingTrack)) {
                this.addToActiveTimeline(currentlyPlayingTrack);
            }
        } else {
            if (this.getReleaseYearOfTrack(currentlyPlayingTrack) <= this.getReleaseYearOfTrack(after)) {
                this.addToActiveTimeline(currentlyPlayingTrack);
            }
        }
        this.showResult.value = true;
        // this.nextRound();
    }

    public makeGuessAfter(before: Track, after?: Track) {
        this.currentlyPlayingTrack.value = this.trackService.activeTrack.value as Track;
        const currentlyPlayingTrack = this.trackService.activeTrack.value as Track;
        if (after) {
            if (this.checkIfInRange(before, after, currentlyPlayingTrack)) {
                this.addToActiveTimeline(currentlyPlayingTrack);
            }
        } else {
            if (this.getReleaseYearOfTrack(currentlyPlayingTrack) >= this.getReleaseYearOfTrack(before)) {
                this.addToActiveTimeline(currentlyPlayingTrack);
            }
        }
        this.showResult.value = true;
        // this.nextRound();
    }

    private checkIfInRange(before: Track, after: Track, guess: Track) {
        return (this.getReleaseYearOfTrack(before) <= this.getReleaseYearOfTrack(guess) && this.getReleaseYearOfTrack(after) >= this.getReleaseYearOfTrack(guess));
    }

    private getReleaseYearOfTrack(track: Track): string {
        return track?.album.release_date.split('-')[0];
    }

    private addToActiveTimeline(track: Track) {
        let activeTimeline = this._teams.value.find(team => team.isActive)?.timeline;
        if (activeTimeline) {
            activeTimeline.push(track);
            activeTimeline = this.sortTracksByReleaseDate(activeTimeline as Track[]);
        }
    }

    private sortTracksByReleaseDate(tracks: Track[]): Track[] {
        return tracks.sort((a, b) => {
            const dateA = new Date(a.album.release_date).getTime();
            const dateB = new Date(b.album.release_date).getTime();
            return dateA - dateB; // Ascending order (oldest first)
        });
    }

    private setNextTeamActive() {
        const teamCount = this._teams.value.length;
        const currentIndex = this._teams.value.findIndex(team => team === this.getActiveTeam() as Team);
        let nextIndex;
        if (currentIndex + 1 === teamCount) nextIndex = 0;
        else nextIndex = currentIndex + 1;
        this._teams.value.forEach(team => team.isActive = false);
        this._teams.value.forEach(team => team.display = false);
        this._teams.value[nextIndex].isActive = true;
        this._teams.value[nextIndex].display = true;
    }

    public nextRound() {
        this.showResult.value = false;
        this.playbackService.nextTrack();
        console.log(this._teams)
        if (this._teams.value.length > 1) this.setNextTeamActive();
    }


    public startGame() {
        this.creatStartPointsForTeams();
        this.trackService.setRandomSong();
        this.teams.value[0].isActive = true;
        this.teams.value[0].display = true;
    }
}