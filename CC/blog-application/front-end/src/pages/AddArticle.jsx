import React, { useState } from 'react';
import axios from 'axios';
import { link } from '../components/Baselink';
import { CreatingArticleLoader } from '../Utils/loader';

const AddArticleModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        thumbnail: '',
        tag: ''
    });
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(false)

    const handleChange = (e) => {
        // console.log(formData)

        const { name, value } = e.target;

        if (name === 'thumbnail') {
            setFormData({ ...formData, thumbnail: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const url = `${link}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('thumbnail', formData.thumbnail);
            data.append('tag', formData.tag);

            const response = await axios.post(
                `${url}/api/article/addarticle`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            onSuccess(response.data.article);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Error creating article');
        }
        setloading(false);
    };

    if (loading) {
        return <CreatingArticleLoader />
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Create a New Article</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-300"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-100 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter article title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100 mb-1">
                                Content
                            </label>
                            <textarea
                                name="content"
                                placeholder="Write your article content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-colors resize-none"
                            />
                        </div>

                        <div className='flex flex-row' >
                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-1">
                                    Thumbnail
                                </label>
                                <input
                                    type="file"
                                    name="thumbnail"
                                    accept="image/*"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div className='w-full flex justify-center'>
                            <select value={formData.tag} onChange={handleChange}  className='p-2 text-black rounded-lg' name="tag" id="">
                                {/* <option value="">Select Tag</option> */}
                                <option value="Tech">Technology</option>
                                <option value="Music">Music</option>
                                <option value="Game">Gaming</option>
                                <option value="Movies">Movies</option>
                                <option value="Books">Books</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Health">Health</option> 
                                <option value="Sports">Sports</option>
                                <option value="Sci-Fi">Sci-Fi</option>
                                <option value="Finance">Finance</option>
                                <option value="Politics">Politics</option>
                                <option value="Narratives">Narratives</option>
                                <option value="Trending-Topics">Trending-Topics</option>
                            </select>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                className="relative bg-gradient-to-r w-40  bg-white rounded-lg shadow-lg px-4 py-2 transform transition-all duration-300 hover:scale-110 group"
                                type="submit"
                            >
                                <div className="relative z-10">Create</div   >
                                <span className=" rounded-3xl absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddArticleModal;
