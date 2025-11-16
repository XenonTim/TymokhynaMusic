import React from 'react';

const TrackCard = ({
                       track,
                       role,
                       onDelete,
                       onEdit,
                       onRecommend,
                       onAddToPlaylist
                   }) => {

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <h5 className="card-title text-primary">{track.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                    {track.artists.join(', ')} ({track.year})
                </h6>
                <div className="row">
                    <div className="col-md-6">
                        <p className="card-text">
                            **Жанр:** <span className="badge bg-secondary">{track.genre}</span>
                        </p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <p className="card-text">
                            **Тривалість:** {formatDuration(track.duration)}
                        </p>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => onRecommend(track._id)}
                    >
                        Рекомендації
                    </button>

                    {role && (
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => onAddToPlaylist(track._id)}
                        >
                            Додати до плейлиста
                        </button>
                    )}

                    {role === 'admin' && (
                        <>
                            <button
                                className="btn btn-sm btn-warning"
                                onClick={() => onEdit(track)}
                            >
                                Редагувати
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => onDelete(track._id)}
                            >
                                Видалити
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackCard;