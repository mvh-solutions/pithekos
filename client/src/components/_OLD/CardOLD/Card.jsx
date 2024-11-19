import React, { useState } from 'react';

function Card({ books, onCardRemove, children }) {
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedChapter, setSelectedChapter] = useState(1);
    const [selectedVerse, setSelectedVerse] = useState(1);

    const handleBookChange = (event) => {
        setSelectedBook(event.target.value);
    };

    const handleChapterChange = (event) => {
        setSelectedChapter(Number(event.target.value));
    };

    const handleVerseChange = (event) => {
        setSelectedVerse(Number(event.target.value));
    };

    return (
        <div className="card">
            <div className="card-header">
                <select value={selectedBook} onChange={handleBookChange}>
                    <option value="">Select Book</option>
                    {books.map((book) => (
                        <option key={book.code} value={book.code}>
                            {book.name}
                        </option>
                    ))}
                </select>

                <select value={selectedChapter} onChange={handleChapterChange}>
                    {/* Assuming chapters are numbered from 1 to 50 */}
                    {Array.from({ length: 50 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>

                <select value={selectedVerse} onChange={handleVerseChange}>
                    {/* Assuming verses are numbered from 1 to 30 */}
                    {Array.from({ length: 30 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>

                <button onClick={onCardRemove}>Remove</button>
            </div>

            <div className="card-content">
                {children ? children : <button className="empty-button">Empty</button>}
            </div>
        </div>
    );
}

export default Card;
