const getContributors = async({perPage=30, page=1}) => {
    try {
        const data = await fetch(`https://api.github.com/repos/OkenHaha/react-blog/contributors?per_page=${perPage}&page=${page}`);
        return await data.json();
    } catch (error) {
        console.log(error);
        return null
    }
}

export { getContributors }