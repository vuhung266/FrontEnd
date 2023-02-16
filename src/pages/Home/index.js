import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import produce from 'immer';
const aa = {
    tire: true,
    aaaa: 'aaaa',
};
const Home = () => {
    const [data, setData] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

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
    }, []);

    return (
        <div>
            <input id="myInput" type="text" ref={inputRef} />
            {data ? <p>{JSON.stringify(data)}</p> : <p>Loading...</p>}
        </div>
    );
};

export default Home;
