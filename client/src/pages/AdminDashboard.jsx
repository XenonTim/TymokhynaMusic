// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { dataApi } from '../api/api.js';
import TrackForm from '../components/TrackForm.jsx';
import TrackCard from '../components/TrackCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import PlaylistSelectionModal from '../components/PlaylistSelectionModal.jsx';

const AdminDashboard = () => {
    const [allTracks, setAllTracks] = useState([]);
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [recommendations, setRecommendations] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackToAdd, setTrackToAdd] = useState(null);
    const [editingTrack, setEditingTrack] = useState(null);

    const handleAdminUpdate = () => setUpdateTrigger(prev => prev + 1);

    const loadData = useCallback(async () => {
        try {
            const [tracksRes, playlistsRes] = await Promise.all([
                dataApi.getAllTracks(),
                dataApi.getAllPlaylists(),
            ]);
            setAllTracks(Array.isArray(tracksRes.data) ? tracksRes.data : []);
            setAllPlaylists(Array.isArray(playlistsRes.data) ? playlistsRes.data : []);
        } catch (error) {
            console.error("Помилка завантаження даних:", error);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData, updateTrigger]);

    const handleTrackSubmit = async (trackData) => {
        try {
            if (editingTrack && editingTrack._id) {
                await dataApi.updateTrack(editingTrack._id, trackData);
            } else {
                await dataApi.createTrack(trackData);
            }

            setEditingTrack(null);
            handleAdminUpdate();
        } catch (error) {
            console.error("Помилка при збереженні треку:", error);
            alert(`Помилка: ${error.response?.data?.message || 'Не вдалося зберегти трек.'}`);
        }
    };

    const handleTrackRemove = async (trackId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей трек?")) return;
        try {
            await dataApi.deleteTrack(trackId);
            handleAdminUpdate();
        } catch (error) {
            console.error("Помилка при видаленні треку:", error);
        }
    };

    const handleEditClick = (track) => {
        setEditingTrack(track);
    };

    const fetchRecommendations = async (trackId) => {
        if (recommendations[trackId]) {
            setRecommendations({});
            return;
        }
        try {
            const res = await dataApi.getTrackRecommendations(trackId);
            setRecommendations({ [trackId]: res.data });
        } catch (error) {
            console.error("Помилка отримання рекомендацій:", error);
        }
    };

    const handleAddToPlaylist = (trackId) => {
        setTrackToAdd(trackId);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (playlistData) => {
        if (!trackToAdd) return;

        try {
            if (playlistData.name) {
                const newPlaylistData = { name: playlistData.name, tracks: [trackToAdd] };
                await dataApi.createPlaylist(newPlaylistData);
                alert(`Трек додано до нового плейлиста "${playlistData.name}"`);
            } else if (playlistData.id) {
                await dataApi.addTrackToPlaylist(playlistData.id, trackToAdd);
                alert(`Трек додано до плейлиста.`);
            }

            setIsModalOpen(false);
            setTrackToAdd(null);
            handleAdminUpdate();

        } catch (error) {
            console.error("Помилка додавання до плейлиста:", error);
            alert(`Не вдалося додати трек: ${error.response?.data?.message || error.message}`);
        }
    };

    const handlePlaylistDelete = async (playlistId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей плейлист?")) return;
        try {
            await dataApi.deletePlaylist(playlistId);
            handleAdminUpdate();
        } catch (error) {
            console.error("Помилка видалення плейлиста:", error);
        }
    };

    const handlePlaylistEdit = async (playlist) => {
        const newName = window.prompt("Введіть нову назву плейлиста:", playlist.name);
        if (newName && newName.trim() !== "" && newName !== playlist.name) {
            try {
                await dataApi.updatePlaylist(playlist._id, { name: newName.trim() });
                handleAdminUpdate();
            } catch (error) {
                console.error("Помилка оновлення плейлиста:", error);
                alert(`Не вдалося оновити плейлист: ${error.response?.data?.message}`);
            }
        }
    };

    const handleRemoveTrackFromPlaylist = async (playlistId, trackId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей трек з плейлиста?")) {
            try {
                await dataApi.removeTrackFromPlaylist(playlistId, trackId);
                handleAdminUpdate();
            } catch (error) {
                console.error("Помилка видалення треку з плейлиста:", error);
                alert(`Не вдалося видалити трек: ${error.response?.data?.message}`);
            }
        }
    };

    return (
        <div>
            <h1>Панель Адміністратора</h1>

            <div className="row">
                <div className="col-md-6 mb-5">
                    <h2>Керування Треками</h2>

                    {!editingTrack && (
                        <button
                            className="btn btn-primary mb-3"
                            onClick={() => setEditingTrack({ isNew: true })}
                        >
                            + Додати новий трек
                        </button>
                    )}

                    {editingTrack !== null && (
                        <TrackForm
                            trackToEdit={editingTrack._id ? editingTrack : null}
                            onSubmit={handleTrackSubmit}
                            onCancel={() => setEditingTrack(null)}
                        />
                    )}

                    <h3 className="mt-4">Список треків ({allTracks.length})</h3>
                    <div className="track-list-container">
                        {allTracks.map(track => (
                            <div key={track._id}>
                                <TrackCard
                                    track={track}
                                    role={'admin'}
                                    onEdit={handleEditClick}
                                    onDelete={handleTrackRemove}
                                    onRecommend={fetchRecommendations}
                                    onAddToPlaylist={handleAddToPlaylist}
                                />

                                {recommendations[track._id] && (
                                    <div className="alert alert-info mt-2">
                                        Рекомендації:
                                        {recommendations[track._id].length > 0 ? (
                                            <ul>
                                                {recommendations[track._id].map(rec => (
                                                    <li key={rec._id}>{rec.name} ({rec.artists.join(', ')})</li>
                                                ))}
                                            </ul>
                                        ) : 'Не знайдено схожих треків.'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-6 mb-5">
                    <h2>Керування Плейлістами (Всі)</h2>
                    {allPlaylists.map(playlist => (
                        <div key={playlist._id} className="mb-3">
                            <PlaylistCard
                                playlist={playlist}
                                allTracks={allTracks}
                                role={'admin'}
                                onEdit={handlePlaylistEdit}
                                onDelete={handlePlaylistDelete}
                                onRemoveTrack={handleRemoveTrackFromPlaylist}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <PlaylistSelectionModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                playlists={allPlaylists}
            />
        </div>
    );
};

export default AdminDashboard;
