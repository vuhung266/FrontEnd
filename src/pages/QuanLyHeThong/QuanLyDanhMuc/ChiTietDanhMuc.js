import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Row, Col, Card, Form, Popconfirm, message, Modal, Space, Badge } from 'antd';
import { DeleteOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as menuServices from '~/services/menuService';
import { useQuery } from 'react-query';
import axios from 'axios';
import 'swiper/css';
const { Meta } = Card;
const { TextArea } = Input;
const QuanLyChiTietDanhMuc = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddNew, setIsAddNew] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [formHDSD] = Form.useForm();
    const [initialValuesHDSD, setinitialValuesHDSD] = useState([]);
    const params = useParams();

    const { data, refetch } = useQuery(
        'HDSDData',
        () => fetch('http://localhost:4000/detail_hdsd').then((res) => res.json()),
        { refetchOnWindowFocus: false },
    );
    // const fetchAllHDSD = async () => {
    //     const result = await menuServices.getAllHDSD(); console.log(result)
    //     let olala = GetAllItemsbyPid(params.id, result);
    // };
    const GetAllItemsbyPid = (pid, data) => {
        if (data) {
            let filteredArr = data.filter(function (item) {
                return item.pid === pid;
            });
            return filteredArr;
        } else {
            return [];
        }
    };
    let result = GetAllItemsbyPid(params.id, data);
    console.log(result);
    useEffect(() => {}, [params.id]);
    const confirmDelete = (e) => {
        deleteMenuItem(e.id);
        refetch();
    };
    async function deleteMenuItem(id) {
        await menuServices.deleteItemHDSD(id);
        message.info(`Xóa thành công`);
    }
    const addHDSD = async (e) => {
        e.pid = params.id;
        console.log(e);
        await axios.post('http://localhost:4000/detail_hdsd', e);
        // refetch()
        // let dataFromDetailHDSD = GetAllItemsbyPid(e.pid); console.log(dataFromDetailHDSD);
        // setDataSlideHDSD(dataFromDetailHDSD);
    };
    const OpenModalForm = () => {
        setIsModalOpen(true);
        setIsAddNew(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //onCreate gọi khi submit form, check xem add new hay edit
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
        data.pid = params.id;
        const response = await axios.post('http://localhost:4000/detail_hdsd', data);
        refetch();
        console.log(response.data);
    }
    const sendEditData = async (e) => {
        const result = await menuServices.editMenu(e, initialValuesHDSD.key);
        console.log(result);
    };
    return (
        <>
            <Row gutter={[16, 32]}>
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Button type="primary" icon={<PlusCircleOutlined />} onClick={OpenModalForm}>
                                Thêm mới danh mục
                            </Button>
                        </Col>
                        <Col span={24}>
                            <Swiper
                                navigation
                                pagination={{ clickable: true }}
                                spaceBetween={20}
                                slidesPerView={3}
                                className="mycustomswiper"
                            >
                                {result?.map((e) => {
                                    // const randomNumber = Math.floor(Math.random() * 100);
                                    return (
                                        <SwiperSlide key={e.id}>
                                            Step: <Badge count={e.step} color='#faad14' /> 
											Pid: {e.pid}
                                            <Space>
                                                <Popconfirm
                                                    placement="top"
                                                    title="Xóa nội dung"
                                                    description="Bạn chắc muốn xóa step này chứ?"
                                                    onConfirm={() => confirmDelete(e)}
                                                    okText="Xác nhận xóa"
                                                    cancelText="Không"
                                                >
                                                    <Button shape="circle" icon={<DeleteOutlined />} size="small" />
                                                </Popconfirm>
                                                <Popconfirm
                                                    placement="top"
                                                    title="Sửa nội dung"
                                                    description="Bạn chắc muốn xóa step này chứ?"
                                                    onConfirm={() => confirmDelete(e)}
                                                    okText="Xác nhận xóa"
                                                    cancelText="Không"
                                                >
                                                    <Button shape="circle" icon={<EditOutlined />} size="small" />
                                                </Popconfirm>
                                            </Space>
                                            <Card
                                                hoverable
                                                style={{ width: 240 }}
                                                // cover={<img alt="example" src={`https://picsum.photos/240/300?random=${randomNumber}`} />}
                                            >
                                                <Meta title={e.name} />
												<div dangerouslySetInnerHTML={{ __html: e.desc }} />
                                            </Card>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal
                forceRender
                open={isModalOpen}
                maskClosable={true}
                onOk={() => {
                    formHDSD
                        .validateFields()
                        .then((values) => {
                            formHDSD.resetFields();
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={handleCancel}
                okText="Lưu lại"
                title={`${isAddNew ? 'Thêm' : 'Sửa'} bước`}
            >
                <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                    <Col span={24}>
                        <Form
                            form={formHDSD}
                            layout=""
                            name="form_HDSD"
                            initialValues={initialValuesHDSD}
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

export default QuanLyChiTietDanhMuc;
