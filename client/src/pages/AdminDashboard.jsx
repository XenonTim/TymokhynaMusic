// client/src/pages/AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { dataApi } from '../api/api.js';
import TrackForm from '../components/TrackForm.jsx';
import TrackCard from '../components/TrackCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';

const AdminDashboard = () => {
    const [allTracks, setAllTracks] = useState([]);
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);

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
            if (editingTrack) {
                await dataApi.updateTrack(editingTrack._id, trackData);
            } else {
                await dataApi.createTrack(trackData);
            }
            setEditingTrack(null);
            handleAdminUpdate();
        } catch (error) {
            console.error("Помилка при збереженні треку:", error);
            alert(`Помилка: ${error.message}. Перевірте консоль бекенду.`);
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


    return (
        <div>
            <h1>Панель Адміністратора</h1>

            <div className="row">
                <div className="col-md-6 mb-5">
                    <h2>Керування Треками</h2>

                    {!editingTrack && (
                        <button
                            className="btn btn-primary mb-3"
                            onClick={() => setEditingTrack({})}
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
                            <TrackCard
                                track={track}
                                role={'admin'}
                                onEdit={handleEditClick}
                                onDelete={handleTrackRemove}
                            />
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
                                onUpdate={handleAdminUpdate}
                                isAdmin={true}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;