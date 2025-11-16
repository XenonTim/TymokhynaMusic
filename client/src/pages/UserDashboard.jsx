// client/src/pages/UserDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { dataApi } from '../api/api.js';
import { getUserId } from '../utils/auth.js';
import TrackCard from '../components/TrackCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';

const UserDashboard = () => {
    const userId = getUserId();
    const [allTracks, setAllTracks] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [recommendations, setRecommendations] = useState({});

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
            setRecommendations({ [trackId]: res.data });
        } catch (error) {
            console.error("Помилка отримання рекомендацій:", error);
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
                                    **Рекомендації:**
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
                <h2>Мої Плейлісти (Керування)</h2>
                <p>Керуйте плейлистами, які ви створили. Ви можете їх змінювати та видаляти.</p>
                <div className="row">
                    {userPlaylists.map(playlist => (
                        <div key={playlist._id} className="col-md-6 mb-4">
                            <PlaylistCard
                                playlist={playlist}
                                allTracks={allTracks}
                                currentUserId={userId}
                                onUpdate={handleUpdate}
                                isAdmin={false}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;