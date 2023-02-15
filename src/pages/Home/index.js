import React, { useState, useEffect } from 'react';
import axios from 'axios';
import produce from 'immer';
const aa = {
	tire: true,
	aaaa: 'aaaa',
};
const Home = () => {
    
    const [data, setData] = useState(null);
    const [tree, setTree] = useState(aa);

    const handleClick = () => {
        setTree(
            produce((draft) => {
                draft.tire = false;
            }),
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/v1/partners', {
                headers: {
                    Authorization: '67890',
                },
            });
            setData(response.data);
        };

        fetchData();
    }, [tree]);
    console.log(tree);

    return (
        <div>
            <button onClick={handleClick}>abc</button>
            {data ? <p>{JSON.stringify(data)}</p> : <p>Loading...</p>}
        </div>
    );
};

export default Home;
