import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { link } from './Baselink';

const LikeButton = ({ articleId, initialLikes, initialLikedState }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialLikedState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLike = async () => {
        if (!localStorage.getItem('token')) {
            setError('Please login to like articles');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${link}/api/article/like/${articleId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setLikes(response.data.likes);
            setIsLiked(!isLiked);
        } catch (err) {
            setError(err.response?.data?.error || 'Error updating like status');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleLike}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${
                    isLiked 
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:from-pink-600 hover:to-rose-600' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow'
                }`}
            >
                <svg
                    className={`w-5 h-5 ${isLiked ? 'fill-white' : 'fill-pink-500'} transition-colors duration-200`}
                    viewBox="0 0 24 24"
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="font-medium">{likes}</span>
            </button>
            {error && (
                <span className="text-red-500 text-sm animate-fade-in">{error}</span>
            )}
        </div>
    );
};

export default LikeButton; 