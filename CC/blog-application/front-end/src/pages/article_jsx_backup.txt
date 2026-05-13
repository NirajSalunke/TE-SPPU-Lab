import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaBookmark, FaTrash } from 'react-icons/fa';

// CSS for animations and hover effects (to be added in a global CSS file)
const styles = `
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes rotateLoader {
    0% {
        transform: rotate(0deg);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: rotate(360deg);
        opacity: 0;
    }
}

.fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

.loader {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top-color: #4caf50;
    border-radius: 50%;
    animation: rotateLoader 1.5s infinite;
}

.search-bar {
    transition: all 0.3s ease;
}

.search-bar:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.search-bar:hover {
    background-color: #f1f1f1;
    border-color: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

.tag {
    cursor: pointer;
    display: inline-block;
    background-color: #e0e0e0;
    padding: 5px 10px;
    border-radius: 20px;
    margin-right: 5px;
    transition: background-color 0.3s ease;
}

.tag:hover {
    background-color: #4caf50;
    color: white;
}

.category-dropdown {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: white;
    margin-bottom: 20px;
}

.category-dropdown:hover {
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

/* Hover effect for delete button */
.delete-btn {
    transition: all 0.3s ease;
}

.delete-btn:hover {
    color: red;
    transform: scale(1.1);
}
`;

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [tagsFilter, setTagsFilter] = useState([]);
    const [sortOrder, setSortOrder] = useState('recent');
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            const loadedArticles = [
                {
                    name: 'article-1',
                    title: 'AI in Technology',
                    content: ['Content of article 1'],
                    thumbnail: 'https://via.placeholder.com/600x400',
                    category: 'Technology',
                    tags: ['AI', 'Tech'],
                    authorName: 'John Doe',
                    authorProfilePicture: 'https://via.placeholder.com/50',
                    url: 'https://example.com/article-1',
                },
                {
                    name: 'article-2',
                    title: 'Mental Health Awareness',
                    content: ['Content of article 2'],
                    thumbnail: 'https://via.placeholder.com/600x400',
                    category: 'Health',
                    tags: ['Mental Health', 'Psychology'],
                    authorName: 'Jane Smith',
                    authorProfilePicture: 'https://via.placeholder.com/50',
                    url: 'https://example.com/article-2',
                },
                {
                    name: 'article-3',
                    title: 'Lifestyle Changes for Better Health',
                    content: ['Content of article 3'],
                    thumbnail: 'https://via.placeholder.com/600x400',
                    category: 'Lifestyle',
                    tags: ['Lifestyle', 'Health'],
                    authorName: 'Tom Brown',
                    authorProfilePicture: 'https://via.placeholder.com/50',
                    url: 'https://example.com/article-3',
                },
            ];
            setArticles(loadedArticles);
            setFilteredArticles(loadedArticles);
            setIsLoading(false);
        }, 2000);
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = articles.filter(article =>
            article.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
            article.content[0].toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredArticles(filtered);
    };

    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
        const filtered = articles.filter(article =>
            article.category.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredArticles(filtered);
    };

    const handleTagsFilter = (tag) => {
        setTagsFilter([tag]);
        const filtered = articles.filter(article =>
            article.tags.includes(tag)
        );
        setFilteredArticles(filtered);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        let sortedArticles = [...filteredArticles];
        if (e.target.value === 'recent') {
            sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (e.target.value === 'alphabetical') {
            sortedArticles.sort((a, b) => a.title.localeCompare(b.title));
        }
        setFilteredArticles(sortedArticles);
    };

    const toggleBookmark = (articleName) => {
        if (bookmarkedArticles.includes(articleName)) {
            setBookmarkedArticles(bookmarkedArticles.filter((name) => name !== articleName));
        } else {
            setBookmarkedArticles([...bookmarkedArticles, articleName]);
        }
    };

    const confirmDelete = (article) => {
        setShowConfirmation(true);
        setArticleToDelete(article);
    };

    const handleDelete = () => {
        setArticles(articles.filter(article => article.name !== articleToDelete.name));
        setFilteredArticles(filteredArticles.filter(article => article.name !== articleToDelete.name));
        setShowConfirmation(false);
        setArticleToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
        setArticleToDelete(null);
    };

    return (
        <>
            <style>{styles}</style>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <select
                        className="category-dropdown"
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Health">Health</option>
                        <option value="Lifestyle">Lifestyle</option>
                    </select>

                    <select
                        className="category-dropdown"
                        value={sortOrder}
                        onChange={handleSortChange}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="alphabetical">Alphabetical</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search Articles..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-3 rounded-md mb-6 border border-gray-300 search-bar"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((article, index) => (
                                <div
                                    key={index}
                                    className="fade-in max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-green-100"
                                >
                                    <Link to={`/article/${article.name}`}>
                                        <img
                                            src={article.thumbnail}
                                            className="w-full h-48 object-cover object-center transition-all duration-300 hover:scale-110"
                                            alt=""
                                        />
                                    </Link>
                                    <div className="p-6">
                                        <Link to={`/article/${article.name}`}>
                                            <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-500 transition-colors duration-300 mb-3">
                                                {article.title}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            {article.content[0].substring(0, 110)}...
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <Link
                                                className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
                                                to={`/article/${article.name}`}
                                            >
                                                Read More
                                            </Link>
                                            <button
                                                onClick={() => toggleBookmark(article.name)}
                                                className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
                                            >
                                                <FaBookmark />
                                            </button>
                                        </div>

                                        {/* Tags */}
                                        <div className="mt-3">
                                            {article.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="tag"
                                                    onClick={() => handleTagsFilter(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => confirmDelete(article)}
                                            className="delete-btn mt-4 text-red-500"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-6 space-x-4">
                            <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none transition duration-300">
                                Prev
                            </button>
                            <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none transition duration-300">
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl">Are you sure you want to delete this article?</h3>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Articles;
