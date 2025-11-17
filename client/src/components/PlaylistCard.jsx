import React from 'react';

const PlaylistCard = ({
                          playlist,
                          role,
                          currentUserId,
                          onDelete,
                          onEdit,
                          onRemoveTrack
                      }) => {
    const isOwner = playlist.owner && playlist.owner._id === currentUserId;
    const canModify = role === 'admin' || isOwner;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uk-UA');
    };

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="card mb-4 shadow">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{playlist.name}</h5>
                {canModify && (
                    <div className="btn-group">
                        <button
                            className="btn btn-sm btn-warning"
                            onClick={() => onEdit(playlist)}
                        >
                            Редагувати
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onDelete(playlist._id)}
                        >
                            Видалити
                        </button>
                    </div>
                )}
            </div>
            <div className="card-body">
                <p className="card-text">
                    <small className="text-muted">
                        Створено: {formatDate(playlist.creation_date)} |
                        Треків: {playlist.tracks.length} |
                        Загальна тривалість: {formatDuration(playlist.total_duration)}
                    </small>
                </p>

                <h6>Список треків:</h6>
                <ul className="list-group list-group-flush">
                    {playlist.tracks && playlist.tracks.length > 0 ? (
                        playlist.tracks.map(track => (
                            <li key={track._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {track.name} – {track.artists.join(', ')}
                                    <span className="badge bg-info ms-2">{formatDuration(track.duration)}</span>
                                </div>
                                {canModify && (
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onRemoveTrack(playlist._id, track._id)}
                                        title="Видалити трек з плейлиста"
                                    >
                                        &times;
                                    </button>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">Плейлист порожній.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PlaylistCard;
