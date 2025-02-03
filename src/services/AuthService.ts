import axios from 'axios';
import { ref } from 'vue';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export class AuthService {
    private static instance: AuthService;
    private codeVerifier: string = "";
    private codeChallenge: string = "";
    private tokenUrl = 'https://accounts.spotify.com/api/token';
    private redirectUri = 'https://trnkma.github.io/SongStamp/';
    private scopes = 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state';
    private clientId = '36c414d78a0c48fb9df058c21aca2302';
    access_token = ref("");
    isLoading = ref(false);
    isLoggedIn = ref(false);

    private constructor() {
        if (localStorage.getItem('access_token')) {
            this.isLoggedIn.value = true;
            this.access_token.value = localStorage.getItem('access_token') as string;
            const currentDate = new Date();
            const tokenExpiry = new Date(localStorage.getItem('expires') as string);
            if (tokenExpiry < currentDate) this.getRefreshToken();
        }
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }


    login(): void {
        this.codeVerifier = this.generateRandomString(128);
        this.sha256(this.codeVerifier).then((result) => {
            this.codeChallenge = this.base64urlencode(result);
            localStorage.setItem('code_verifier', this.codeVerifier!);
            this.requestUserAuthorization();
        });
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '';
    }

    async authorizeUser(code: string): Promise<void> {
        this.isLoading.value = true;

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.clientId,
            code,
            redirect_uri: this.redirectUri,
            code_verifier: localStorage.getItem('code_verifier') || '',
        });

        try {
            const response = await axios.post(this.tokenUrl, body.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            this.isLoading.value = false;
            this.isLoggedIn.value = true;
            const result = response.data;
            this.saveToken(result);
            window.location.href = '';                  //i don't know why i need 2 reload, but if this isn't here, all props do not get updated
        } catch (error) {
            console.error('Error fetching access token:', error);
        } finally {
            this.isLoading.value = false;
            this.cleanUrl();
        }
    }

    private cleanUrl() {
        const url = new URL(window.location.href);
        url.searchParams.delete("code");

        const updatedUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, document.title, updatedUrl);
    }

    async getRefreshToken(): Promise<void> {
        try {
            const result = await this.requestNewToken();
            this.saveToken(result);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }

    private async requestNewToken(): Promise<TokenResponse> {
        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: this.clientId,
            refresh_token: localStorage.getItem('refresh_token') || '',
        });

        const response = await axios.post(this.tokenUrl, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return response.data;
    }

    private requestUserAuthorization(): void {
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        const params = {
            response_type: 'code',
            client_id: this.clientId,
            scope: this.scopes,
            code_challenge_method: 'S256',
            code_challenge: this.codeChallenge!,
            redirect_uri: this.redirectUri,
        };
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    private generateRandomString(length: number): string {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], '');
    }

    private async sha256(plain: string): Promise<ArrayBuffer> {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return crypto.subtle.digest('SHA-256', data);
    }

    private base64urlencode(a: ArrayBuffer): string {
        return btoa(String.fromCharCode(...new Uint8Array(a)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    private saveToken(response: TokenResponse) {
        const { access_token, refresh_token, expires_in } = response;
        this.access_token.value = access_token;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('expires_in', expires_in.toString());

        const now = new Date();
        const expiry = new Date(now.getTime() + (expires_in * 1000));
        localStorage.setItem('expires', expiry.toString());
    }
}












