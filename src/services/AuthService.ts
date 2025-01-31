import axios from 'axios';
import { reactive } from 'vue';

// Define the state interface
interface AuthState {
    codeVerifier: string | null;
    codeChallenge: string | null;
    tokenUrl: string;
    redirectUri: string;
    scopes: string;
    clientId: string;
    _token: string | null;
    _refreshToken: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    isLoggedOut: boolean;
}


const state = reactive<AuthState>({
    codeVerifier: null,
    codeChallenge: null,
    tokenUrl: 'https://accounts.spotify.com/api/token',
    redirectUri: 'https://trnkma.github.io/SongStamp/',
    scopes: 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state',
    clientId: '36c414d78a0c48fb9df058c21aca2302',
    _token: localStorage.getItem('spotify_auth_token') || null,
    _refreshToken: null,
    isLoading: false,
    isLoggedIn: !!localStorage.getItem('spotify_auth_token'),
    isLoggedOut: !localStorage.getItem('spotify_auth_token'),
});

function login(): void {
    state.codeVerifier = generateRandomString(128);
    sha256(state.codeVerifier).then((result) => {
        state.codeChallenge = base64urlencode(result);
        localStorage.setItem('code_verifier', state.codeVerifier!);
        requestUserAuthorization();
    });
}

async function getAccessToken(code: string): Promise<void> {
    state.isLoading = true;

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: state.clientId,
        code,
        redirect_uri: state.redirectUri,
        code_verifier: localStorage.getItem('code_verifier') || '',
    });

    try {
        const response = await axios.post(state.tokenUrl, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const result = response.data;
        state._token = result.access_token;
        state._refreshToken = result.refresh_token;

        localStorage.setItem('spotify_auth_token', result.access_token);
        localStorage.setItem('refresh_token', result.refresh_token);
        window.location.href = '';
        state.isLoggedOut = false;
    } catch (error) {
        console.error('Error fetching access token:', error);
    } finally {
        state.isLoading = false;
    }
}

async function getRefreshToken(): Promise<void> {
    try {
        const result = await requestNewToken();
        state._token = result.access_token;
        state._refreshToken = result.refresh_token;

        localStorage.setItem('spotify_auth_token', result.access_token);
        localStorage.setItem('refresh_token', result.refresh_token);
    } catch (error) {
        console.error('Error refreshing token:', error);
    }
}

async function requestNewToken(): Promise<{ access_token: string; refresh_token: string }> {
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: state.clientId,
        refresh_token: localStorage.getItem('refresh_token') || '',
    });

    const response = await axios.post(state.tokenUrl, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data;
}

function requestUserAuthorization(): void {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
        response_type: 'code',
        client_id: state.clientId,
        scope: state.scopes,
        code_challenge_method: 'S256',
        code_challenge: state.codeChallenge!,
        redirect_uri: state.redirectUri,
    };
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(a)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export function AuthService() {
    return {
        state,
        login,
        getAccessToken,
        getRefreshToken,
        requestUserAuthorization,
        requestNewToken,
    }
}
