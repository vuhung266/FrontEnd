import React, { useEffect, useState, useRef  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import {
    Button,
    Input,
    Row,
    Col,
    Card,
    Form,
    Popconfirm,
    message,
    Modal,
    Space,
    Affix,
    Steps,
    Divider,
    Tooltip,
} from 'antd';
import { DeleteOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as menuServices from '~/services/menuService';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Pagination } from 'swiper';
import 'swiper/css';
const { Meta } = Card;
const { TextArea } = Input;
const QuanLyChiTietDanhMuc = () => {
	const editorRef = useRef(null);
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
    useEffect(() => {
        formHDSD.setFieldsValue(initialValuesHDSD);
    }, [formHDSD, initialValuesHDSD]);
    const confirmDelete = (e) => {
        deleteMenuItem(e.id);
        refetch();
    };
    async function deleteMenuItem(id) {
        await menuServices.deleteItemHDSD(id);
        message.info(`Xóa thành công`);
    }
    const editHDSD = async (e) => {
        setIsModalOpen(true);
        setIsAddNew(false);
        setinitialValuesHDSD(e);
        console.log(initialValuesHDSD);
    };
    const OpenModalAddForm = () => {
        setIsModalOpen(true);
        setIsAddNew(true);
		formHDSD.resetFields();
		setinitialValuesHDSD({ step: (result.length+1), img: `${result.length+1}.jpg`, name: '', desc: '' });
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //onCreate gọi khi submit form, check xem add new hay edit
    const onCreate = (values) => {
        if (isAddNew) {
            console.log('add new');
            createPost(values);
            setIsAddNew(false);
        } else {
            values.pid = initialValuesHDSD.pid;
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
        await menuServices.editStepHDSD(e, initialValuesHDSD.id);
        refetch();
    };
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };
    return (
        <>
            <Divider />
            <Row gutter={[16, 32]}>
                <Col span={12}>
                    <div>
                        <Button type="primary" icon={<PlusCircleOutlined />} onClick={OpenModalAddForm}>
                            Thêm step mới
                        </Button>
                    </div>
                    <Divider />
                    <Steps
                        className="custom-step"
                        direction="vertical"
                        current={false}
                        items={result.map((e) => ({
                            title: (
                                <>
                                    <p>Step: {e.step}</p>
									<h4>{e.name}</h4>
                                    <Space.Compact style={{ marginLeft: 'auto', float: 'right' }}>
                                        <Popconfirm
                                            placement="top"
                                            title="Xóa nội dung"
                                            description="Bạn chắc muốn xóa step này chứ?"
                                            onConfirm={() => confirmDelete(e)}
                                            okText="Xác nhận xóa"
                                            cancelText="Không"
                                        >
                                            <Button icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                        <Tooltip title="Sửa">
                                            <Button icon={<EditOutlined />} onClick={() => editHDSD(e)} />
                                        </Tooltip>
                                    </Space.Compact>
                                </>
                            ),
                            description: (
                                <>
                                    <div dangerouslySetInnerHTML={{ __html: e.desc }} /> <Divider />
                                </>
                            ),
                        }))}
                    />
                </Col>
                <Col span={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Card title="Demo kết quả">
                                    {result.length > 0 ? (
                                        <Swiper
                                            navigation
                                            pagination={pagination}
                                            modules={[Pagination]}
                                            spaceBetween={20}
                                            slidesPerView={1}
                                            className="mycustomswiper"
                                        >
                                            {result?.map((e) => {
                                                const randomNumber = Math.floor(Math.random() * 100);
                                                return (
                                                    <SwiperSlide key={e.id}>
                                                        <div>
                                                            <div className="demo-view-img">
                                                                <img
                                                                    alt="example"
                                                                    src={`https://picsum.photos/240/300?random=${randomNumber}`}
                                                                />
                                                            </div>
                                                            <p>{e.name}</p>
                                                            <div
                                                                className="demo-view-desc"
                                                                dangerouslySetInnerHTML={{ __html: e.desc }}
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </Swiper>
                                    ) : (
                                        <p>Chưa có dữ liệu</p>
                                    )}
                                </Card>
                            </Space>
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
							{/* <Form.Item label="Mô tả" name="desc">
                            <Editor
								apiKey='mn91e4l4u8nhtjz09fcrbsrtld9x9gb38zzjdol76hrxo623'
								cloudChannel='5-testing'
                               // onInit={(evt, editor) => (editorRef.current = editor)}
                                initialValue={initialValuesHDSD.desc.toString()}
								name="desc"
                                init={{
                                    height: 200,
                                    menubar: true,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount',
                                    ],
                                    toolbar:
                                        'undo redo | formatselect | ' +
                                        'bold italic backcolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                }}
                            />
							</Form.Item> */}
                        </Form>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default QuanLyChiTietDanhMuc;
