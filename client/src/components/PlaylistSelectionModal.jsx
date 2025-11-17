// client/src/components/PlaylistSelectionModal.jsx
import React, { useState, useEffect } from 'react';

const PlaylistSelectionModal = ({ show, onClose, onSubmit, playlists = [] }) => {
    const [selectedId, setSelectedId] = useState('');
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (show && playlists.length > 0) {
            setSelectedId(playlists[0]._id);
        } else if (show) {
            setSelectedId('');
        }
        setNewName('');
    }, [show, playlists]);

    const handleSubmit = () => {
        if (newName.trim() !== '') {
            onSubmit({ name: newName.trim() });
        } else if (selectedId) {
            onSubmit({ id: selectedId });
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Додати трек до плейлиста</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Вибрати існуючий плейлист</label>
                            <select
                                className="form-select"
                                value={selectedId}
                                onChange={(e) => { setSelectedId(e.target.value); setNewName(''); }}
                                disabled={newName !== '' || playlists.length === 0}
                            >
                                {playlists.length === 0 ? (
                                    <option>У вас ще немає плейлістів</option>
                                ) : (
                                    playlists.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        <p className="text-center text-muted">або</p>

                        <div className="mb-3">
                            <label className="form-label">Створити новий плейлист</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newName}
                                onChange={(e) => { setNewName(e.target.value); setSelectedId(''); }}
                                placeholder="Назва нового плейлиста"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Скасувати</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Підтвердити</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlaylistSelectionModal;