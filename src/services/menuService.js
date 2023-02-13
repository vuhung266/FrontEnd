import * as httpRequest from '../utils/httpRequest';

export const getAllMenu = async () => {
    try {
        const res = await httpRequest.get('http://localhost:4000/menus', {
            params: {},
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
export const getMenu = async () => {
    try {
        const res = await httpRequest.get(`http://localhost:4000/menus`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const editMenu = async (data, id) => { 
    try {
        const res = await httpRequest.put(`http://localhost:4000/menus/${id}`, data);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const getAllHDSD = async () => {
    try {
        const res = await httpRequest.get('http://localhost:4000/detail_hdsd', {
            params: {},
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
export const deleteItemHDSD = async (id) => {  console.log(id)
    try {
        const res = await httpRequest.deleteResource(`http://localhost:4000/detail_hdsd/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
export const addStepHDSD = async (data) => { 
    try {
        const res = await httpRequest.post(`http://localhost:4000/detail_hdsd`, data);
        return res;
    } catch (error) {
        console.log(error);
    }
};
