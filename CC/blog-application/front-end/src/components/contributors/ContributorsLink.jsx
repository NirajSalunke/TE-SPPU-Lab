import React, { useEffect, useState } from 'react';
import { getContributors } from "./contribution.js";
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

function ContributorsLink({classes}) {
    const [data, setData] = useState([]);
    
    const getData = async () => {
        const res = await getContributors({ perPage: 5 });
        if(res) {
            setData(res);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="w-full flex justify-center">
            <Link to="/contributors">
                {data.length ? (
                    <div className="flex items-center group">
                        <div className="flex -space-x-3 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                            {data.map((item) => (
                                <img 
                                    src={item.avatar_url} 
                                    key={item.id} 
                                    className={`${classes} rounded-full border-2 border-white dark:border-gray-800 shadow-sm`}
                                    alt={`${item.login}'s avatar`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center ml-2 text-[20px] text-blue-600 dark:text-blue-400">
                            <span className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                                see all
                            </span>
                            <FaChevronRight className="w-2.5 h-2.5 ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                        </div>
                    </div>
                ) : (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Contributors↗
                    </p>
                )}
            </Link>
        </div>
    );
}

export default ContributorsLink;