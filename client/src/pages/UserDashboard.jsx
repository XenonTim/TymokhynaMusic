// client/src/pages/UserDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { dataApi } from '../api/api.js';
import { getUserId } from '../utils/auth.js';
import TrackCard from '../components/TrackCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import PlaylistSelectionModal from '../components/PlaylistSelectionModal.jsx';

const UserDashboard = () => {
    const userId = getUserId();
    const [allTracks, setAllTracks] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [recommendations, setRecommendations] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trackToAdd, setTrackToAdd] = useState(null);
    const handleUpdate = () => setUpdateTrigger(prev => prev + 1);

    const loadData = useCallback(async () => {
        try {
            const [tracksRes, playlistsRes] = await Promise.all([
                dataApi.getAllTracks(),
                dataApi.getMyPlaylists(),
            ]);
            setAllTracks(tracksRes.data);
            setUserPlaylists(playlistsRes.data);
        } catch (error) {
            console.error("Помилка завантаження даних:", error);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData, updateTrigger]);

    const fetchRecommendations = async (trackId) => {
        if (recommendations[trackId]) {
            setRecommendations({});
            return;
        }
        try {
            const res = await dataApi.getTrackRecommendations(trackId);
            setRecommendations({[trackId]: res.data});
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
                const newPlaylistData = {
                    name: playlistData.name,
                    tracks: [trackToAdd]
                };
                await dataApi.createPlaylist(newPlaylistData);
                alert(`Трек додано до нового плейлиста "${playlistData.name}"`);

            } else if (playlistData.id) {
                await dataApi.addTrackToPlaylist(playlistData.id, trackToAdd);
                alert(`Трек додано до плейлиста.`);
            }

            setIsModalOpen(false);
            setTrackToAdd(null);
            handleUpdate();

        } catch (error) {
            console.error("Помилка додавання до плейлиста:", error);
            alert(`Не вдалося додати трек: ${error.response?.data?.message || error.message}`);
        }
    };

    const handlePlaylistEdit = async (playlist) => {
        const newName = window.prompt("Введіть нову назву плейлиста:", playlist.name);

        if (newName && newName.trim() !== "" && newName !== playlist.name) {
            try {
                await dataApi.updatePlaylist(playlist._id, {name: newName.trim()});
                handleUpdate();
            } catch (error) {
                console.error("Помилка оновлення плейлиста:", error);
                alert(`Не вдалося оновити плейлист: ${error.response?.data?.message}`);
            }
        }
    };

    const handlePlaylistDelete = async (playlistId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей плейлист?")) return;
        try {
            await dataApi.deletePlaylist(playlistId);
            handleUpdate();
        } catch (error) {
            console.error("Помилка видалення плейлиста:", error);
        }
    };

    const handleRemoveTrackFromPlaylist = async (playlistId, trackId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей трек з плейлиста?")) {
            try {
                await dataApi.removeTrackFromPlaylist(playlistId, trackId);
                handleUpdate();
            } catch (error){
            console.error("Помилка видалення треку з плейлиста:", error);
            alert(`Не вдалося видалити трек: ${error.response?.data?.message}`);
            }
        }
    };

    return (
        <div>
            <h1>Панель Користувача</h1>

            <section className="mb-5">
                <h2>Всі Треки</h2>
                <div className="row">
                    {allTracks.map(track => (
                        <div key={track._id} className="col-md-4 mb-4">
                            <TrackCard
                                track={track}
                                role={'user'}
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
            </section>

            <section className="mb-5">
                <h2>Мої Плейлісти</h2>
                <div className="row">
                    {userPlaylists.map(playlist => (
                        <div key={playlist._id} className="col-md-6 mb-4">
                            <PlaylistCard
                                playlist={playlist}
                                allTracks={allTracks}
                                currentUserId={userId}
                                onUpdate={handleUpdate}
                                role={'user'}
                                onEdit={handlePlaylistEdit}
                                onDelete={handlePlaylistDelete}
                                onRemoveTrack={handleRemoveTrackFromPlaylist}
                            />
                        </div>
                    ))}
                </div>
            </section>
            <PlaylistSelectionModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                playlists={userPlaylists}
            />
        </div>
    );
};

export default UserDashboard;
