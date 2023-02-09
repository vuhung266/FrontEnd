import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Row, Col, Space, Table, Tooltip, Select, Modal, message, Form, Popconfirm, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import * as menuServices from '~/services/menuService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import axios from 'axios';
const { TextArea } = Input;
const { Meta } = Card;
const QuanLyDanhMuc = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalHDSDOpen, setIsModalHDSDOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isAddNew, setIsAddNew] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [dataMenu, setDataMenu] = useState([]);
    const [dataPids, setDataPids] = useState([]);
    const [dataSlideHDSD, setDataSlideHDSD] = useState([]);
    const [initialValues, setInitialValues] = useState([]);
    const [initialValuesHDSD, setinitialValuesHDSD] = useState([]);

    const { data, refetch  } = useQuery('HDSDData', () => fetch('http://localhost:4000/detail_hdsd').then((res) => res.json()));
    useEffect(() => {
        if (sendRequest) {
            setSendRequest(false);
        }
        const fetchApi = async () => {
            const result = await menuServices.getMenu();
            // setServices(result);
            const resultArray = result.map((elm) => ({
                id: elm.id,
                key: elm.id,
                value: elm.id,
                label: elm.name,
                name: elm.name,
                pid: elm.pid,
                order: elm.order,
            }));
            setDataMenu(resultArray);
        };
        fetchApi();
    }, [sendRequest]);

    function convertToNestedArray(dataMenu) {
        const result = [];
        const map = {};

        dataMenu.forEach((item) => {
            map[item.id] = item;
            item.children = [];
        });

        dataMenu.forEach((item) => {
            const parent = map[item.pid];
            if (parent) {
                parent.children.push(item);
            } else {
                result.push(item);
            }
        });

        return result;
    }

    const nestedData = convertToNestedArray(dataMenu); //console.log(nestedData)

    const onCreate = (values) => {
        if (isAddNew) {
            createPost(values);
            setIsAddNew(false);
        } else {
            sendEditData(values);
        }
        setSendRequest(true);
        setIsModalOpen(false);
    };
    async function createPost(data) {
        const response = await axios.post('http://localhost:4000/menus', data);
        console.log(response.data);
    }
    const sendEditData = async (e) => {
        const result = await menuServices.editMenu(e, initialValues.key);
        console.log(result);
    };
    const addHDSD = (values) => {
        postHDSD(values);
		refetch()
		let dataFromDetailHDSD = GetAllItemsbyPid(values.pid);
		setDataSlideHDSD(dataFromDetailHDSD);
    };
    async function postHDSD(data) {
        await axios.post('http://localhost:4000/detail_hdsd', data);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalHDSDOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);
    const openEditModal = (e) => {
        setIsAddNew(false);
        setInitialValues(e);
        setIsModalOpen(true);
        setSendRequest(true);
        const filteredArray = dataMenu.filter((obj) => obj.key !== e.key); // bỏ item có id cần sửa khỏi drop Pid
        filteredArray.unshift({ key: 0, value: 0, label: 'Là thư mục gốc' });
        setDataPids(filteredArray);
        setDataMenu(dataMenu);
    };
    const openAddChildModal = (e) => {
        console.log(e);
        setIsAddNew(true);
        setInitialValues({ key: e.key, label: e.label, name: '', order: '', pid: e.key, value: e.key });
        setIsModalOpen(true);
        setSendRequest(true);
        dataMenu.unshift({ key: 0, value: 0, label: 'Là thư mục gốc' });
        setDataPids(dataMenu);
        setDataMenu(dataMenu);
    };
    const openAddHDSDModal = (e) => {
        let dataFromDetailHDSD = GetAllItemsbyPid(e.id);
		setDataSlideHDSD(dataFromDetailHDSD);
			console.log('đã set data mới cho vào slide:', dataFromDetailHDSD)
        setinitialValuesHDSD(e);
        setIsModalHDSDOpen(true);
    };

    const GetAllItemsbyPid = (pid) => {
        if (data) {
            let filteredArr = data.filter(function (item) {
                return item.pid === pid;
            });
			return filteredArr
        } else {
            return [];
        }
    };
    const columns = [
        {
            title: 'Thứ tự',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: 'ID',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thư mục cha',
            dataIndex: 'pid',
            key: 'pid',
        },

        {
            title: `Action`,
            render: (e) => (
                <Space direction="vertical">
                    <Space wrap>
                        <Tooltip title="Sửa Danh mục">
                            <Button
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(e)}
                                size="small"
                            />
                        </Tooltip>
                        <Popconfirm
                            placement="top"
                            title="Bạn muốn xóa danh mục này không?"
                            description="Hãy chắc chắn xóa Danh mục không có dữ liệu"
                            onConfirm={() => confirmDelete(e)}
                            okText="Xác nhận xóa"
                            cancelText="Không"
                        >
                            <Button shape="circle" icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                        <Tooltip title="Thêm danh mục con">
                            <Button
                                shape="circle"
                                icon={<PlusOutlined />}
                                onClick={() => openAddChildModal(e)}
                                size="small"
                            />
                        </Tooltip>
                        {e.children.length === 0 ? (
                            <Tooltip title="Nhập các bước HDSD">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                    onClick={() => openAddHDSDModal(e)}
                                    size="small"
                                />
                            </Tooltip>
                        ) : (
                            ''
                        )}
                    </Space>
                </Space>
            ),
        },
    ];

    const confirmDelete = (e) => {
        console.log(e);
        message.info(`Xóa thành công danh mục ${e.name}.`);
        deleteMenuItem(e.key);
    };
    async function deleteMenuItem(id) {
        await axios.delete(`http://localhost:4000/menus/${id}`);
        setSendRequest(true);
    }
    const addNewMenu = () => {
        setInitialValues({ key: '', label: '', name: '', order: '', pid: 0, value: '' });
        setIsModalOpen(true);
        setIsAddNew(true);
    };
    return (
        <>
            {contextHolder}
            {/* <TreeMenu nestedData= {nestedData} /> */}
            <Row gutter={[16, 32]}>
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Button type="primary" icon={<PlusCircleOutlined />} onClick={addNewMenu}>
                                Thêm mới danh mục
                            </Button>
                        </Col>
                        <Col span={24}>
                            <Table
                                columns={columns}
                                dataSource={nestedData}
                                pagination={false}
                                size="small"
                                rowClassName={(record, index) => (record.pid === 0 ? 'green' : null)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal
                forceRender
                open={isModalOpen}
                maskClosable={true}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={handleCancel}
                okText="Lưu lại"
                title={`${isAddNew ? 'Thêm' : 'Sửa'} danh mục`}
            >
                <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                    <Col span={24}>
                        <Form
                            form={form}
                            layout=""
                            name="form_in_modal"
                            initialValues={initialValues}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            labelAlign="left"
                        >
                            <Form.Item label="Tên danh mục" name="name" required={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Thứ tự" name="order" required={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Thư mục cha" name="pid" required={true}>
                                <Select showSearch allowClear options={dataPids} />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
            <Modal
                forceRender
                width={1000}
                open={isModalHDSDOpen}
                maskClosable={true}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            addHDSD(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={handleCancel}
                okText="Lưu lại"
                title={`Chi tiết ${initialValuesHDSD.name}`}
            >
                <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                    <Col span={24}>
                        <Swiper
							pagination={{ clickable: true }}
                            spaceBetween={30}
                            slidesPerView={3}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            {dataSlideHDSD.map((e) => (
                                <SwiperSlide key={e.id}>
									Step: {e.step}
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={
                                            <img
                                                alt="example"
                                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                                            />
                                        }
                                    >
                                        <Meta title={e.name} description={e.desc} />
                                    </Card>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                    <Col span={24}>
                        <Form
                            form={form}
                            layout=""
                            name="form_in_modal"
                            initialValues={initialValues}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            labelAlign="left"
                        >
                            <Form.Item label="Step" name="step" required={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Link ảnh" name="img" required={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Tên" name="name" required={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Mô tả" name="desc" required={true}>
                                <TextArea />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default QuanLyDanhMuc;
