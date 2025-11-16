import React, { useState, useEffect } from 'react';

const TrackForm = ({
                       trackToEdit = null,
                       onSubmit,
                       onCancel
                   }) => {
    const [formData, setFormData] = useState({
        name: '',
        artists: '',
        genre: '',
        duration: '',
        year: ''
    });

    useEffect(() => {
        if (trackToEdit) {
            setFormData({
                name: trackToEdit.name || '',
                artists: Array.isArray(trackToEdit.artists) ? trackToEdit.artists.join(', ') : '',
                genre: trackToEdit.genre || '',
                duration: trackToEdit.duration || '',
                year: trackToEdit.year || ''
            });
        }
    }, [trackToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            artists: formData.artists.split(',').map(artist => artist.trim()).filter(artist => artist.length > 0),
            duration: Number(formData.duration),
            year: Number(formData.year)
        };

        onSubmit(payload);
    };

    const title = trackToEdit ? 'Редагувати трек' : 'Додати новий трек';

    return (
        <div className="card shadow-lg mb-4">
            <div className="card-header bg-primary text-white">
                <h4 className="mb-0">{title}</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Назва треку</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="artists" className="form-label">Артисти (через кому)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="artists"
                            name="artists"
                            value={formData.artists}
                            onChange={handleChange}
                            placeholder="Наприклад: John Doe, Jane Smith"
                            required
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="genre" className="form-label">Жанр</label>
                            <input
                                type="text"
                                className="form-control"
                                id="genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="year" className="form-label">Рік випуску</label>
                            <input
                                type="number"
                                className="form-control"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="duration" className="form-label">Тривалість (у секундах)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            min="1"
                        />
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Скасувати
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {trackToEdit ? 'Зберегти зміни' : 'Створити трек'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TrackForm;