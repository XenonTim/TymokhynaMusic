// client/src/api/api.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth.js';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authApi = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    register: (username, password) => api.post('/auth/register', { username, password }),
};

export const dataApi = {
    getAllTracks: () => api.get('/tracks'),
    getTrackRecommendations: (id) => api.get(`/tracks/${id}/similar`),
    createTrack: (data) => api.post('/tracks', data),
    updateTrack: (id, data) => api.put(`/tracks/${id}`, data),
    deleteTrack: (id) => api.delete(`/tracks/${id}`),

    getAllPlaylists: () => api.get('/playlists'),
    getMyPlaylists: () => api.get('/playlists/my-playlists'),
    createPlaylist: (data) => api.post('/playlists', data),
    updatePlaylist: (id, data) => api.put(`/playlists/${id}`, data),
    addTrackToPlaylist: (playlistId, trackId) => api.put(`/playlists/${playlistId}/tracks`, { trackId }),
    removeTrackFromPlaylist: (playlistId, trackId) => api.delete(`/playlists/${playlistId}/tracks/${trackId}`),
    deletePlaylist: (id) => api.delete(`/playlists/${id}`),
};
