import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Input,
    Row,
    Col,
    Space,
    Table,
    Tooltip,
    Modal,
    message,
    Form,
    Popconfirm,
    Drawer,
    TreeSelect,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    FileDoneOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import AddStepToHDSD from './AddStepToHDSD';
import axios from 'axios';
let nestedData = [];
const QuanLyDanhMuc = () => {
	const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [listPid, setListPid] = useState([]);// data pid
    const [currentPid, setCurrentPid] = useState(0); // pid set selected trong modal add & edit
    const [isAddNew, setIsAddNew] = useState(false);
    const [dataMenu, setDataMenu] = useState([]);
    const [selectedMenuHDSD, setSelectedMenuHDSD] = useState([]);
    const [initialValues, setInitialValues] = useState([]);
    const [expanKeys, setExpanKeys] = useState(null);

    const menuData = useQuery('MenuData', () => fetch('http://localhost:4000/menus').then((res) => res.json()), {
        refetchOnWindowFocus: false,
    });
    const Rest2 = useQuery('HDSDData', () => fetch('http://localhost:4000/detail_hdsd').then((res) => res.json()), {
        refetchOnWindowFocus: false,
    });

    const onClose = () => {
        setOpen(false);
    };
    const fetchMenuItems = async () => {
        //const result = await menuServices.getMenu();
        const resultArray = menuData.data?.map((obj) => {
            obj.key = obj.id;
            obj.value = obj.id;
            obj.label = obj.name;
            obj.title = obj.name;
            return obj;
        });
        setDataMenu(resultArray);
    };
    // useEffect(() => {
    //     fetchMenuItems();
    //     form.setFieldsValue(initialValues);
    // }, [form, initialValues]);
    useEffect(() => {
        if (menuData.data) {
            fetchMenuItems();
        }
    }, [menuData.data]);

    if (dataMenu) {
        nestedData = convertToNestedArray(dataMenu); // chuy???n th??nh array tree
        if (nestedData) {
            nestedData.sort((a, b) => a.order - b.order);
            nestedData.forEach((item) => {
                if (item.children) {
                    item.children.sort((a, b) => a.order - b.order);
                }
            });
        }
        nestedData = JSON.parse(
            JSON.stringify(nestedData, (key, value) => {
                if (key === 'children' && JSON.stringify(value) === '[]') return undefined;
                return value;
            }),
        );
        console.log('load data', nestedData);
    }
    function convertToNestedArray(dataMenu) {
        const result = [];
        const map = {};

        dataMenu?.forEach((item) => {
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

    // function convertToNestedArray(dataMenu) {
    //     const result = [];
    //     const map = {};

    //     dataMenu.forEach((item) => {
    //         map[item.id] = item;
    //     });

    //     dataMenu.forEach((item) => {
    //         const parent = map[item.pid];
    //         if (parent) {
    //             if (!parent.children) {
    //                 parent.children = [];
    //             }
    //             parent.children.push(item);
    //         } else {
    //             result.push(item);
    //         }
    //     });

    //     return result;
    // }

    const onCreate = (values) => {
        if (isAddNew) {
            //createPost(values);
            addMenuData.mutate(values);
            setIsAddNew(false);
        } else {
            updateMenuData.mutate(values);
        }
    };
    const addMenuData = useMutation(
        (updatedMenuData) => {
            return fetch(`http://localhost:4000/menus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMenuData),
            }).then((res) => res.json());
        },
        {
            onSuccess: (updatedData) => {
                setIsModalOpen(false);
                queryClient.invalidateQueries('MenuData');
                fetchMenuItems();
            },
        },
    );
    const updateMenuData = useMutation(
        (updatedMenuData) => {
            return fetch(`http://localhost:4000/menus/${initialValues.key}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMenuData),
            }).then((res) => res.json());
        },
        {
            onSuccess: (updatedData) => {
                setIsModalOpen(false);
                queryClient.invalidateQueries('MenuData');
                fetchMenuItems();
            },
        },
    );
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const makeDropParents = (e) => {
        const filteredArray = dataMenu.filter((obj) => obj.key !== e.key); // b??? item c?? id c???n s???a kh???i drop Pid
        const resultArray = filteredArray.map((obj) => {
            obj.key = obj.id;
            obj.value = obj.id;
            obj.label = obj.name;
            return obj;
        });
        resultArray.unshift({ key: 0, value: 0, label: 'L?? th?? m???c g???c' });
    };
    const openEditModal = (e) => {
        setIsAddNew(false);
        setInitialValues(e);
        setIsModalOpen(true);
        makeDropParents(e);
    };
    const openAddChildModal = (e) => {
        console.log('item v???a ch???n: ', e);
        setIsAddNew(true);
		setCurrentPid(e.id); console.log(currentPid)
       // setInitialValues({ key: e.key, label: e.label, name: e.name, title: e.name, order: 1, pid: e.id, value: e.id });
        setIsModalOpen(true);
       // dataMenu.unshift({ key: 0, value: 0, label: 'L?? th?? m???c g???c' });
    };
    const openAddHDSDModal = (e) => {
        setSelectedMenuHDSD(e);
        setOpen(true);
    };

    const columns = [
        {
            title: `T??n danh m???c`,
            render: (e) =>
                !e.children ? (
                    <>
                        <Link className="color-primary" to={`../quan-ly-he-thong/chi-tiet-danh-muc/${e.id}`}>
                            <FileTextOutlined /> {e.name}
                        </Link>
                    </>
                ) : (
                    e.name
                ),
        },
        {
            title: 'Th??? t???',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: 'ID',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Th?? m???c cha',
            dataIndex: 'pid',
            key: 'pid',
        },

        {
            title: `Action`,
            render: (e) => (
                <Space direction="vertical">
                    <Space wrap>
                        <Tooltip title="S???a Danh m???c">
                            <Button
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(e)}
                                size="small"
                            />
                        </Tooltip>
                        <Popconfirm
                            placement="top"
                            title="B???n mu???n x??a danh m???c n??y kh??ng?"
                            description="H??y ch???c ch???n x??a Danh m???c kh??ng c?? d??? li???u"
                            onConfirm={() => confirmDelete(e)}
                            okText="X??c nh???n x??a"
                            cancelText="Kh??ng"
                        >
                            <Button shape="circle" icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                        <Tooltip title="Th??m danh m???c con">
                            <Button
                                shape="circle"
                                icon={<PlusOutlined />}
                                onClick={() => openAddChildModal(e)}
                                size="small"
                            />
                        </Tooltip>
                        {!e.children ? (
                            <Tooltip title="Nh???p c??c b?????c HDSD">
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
        message.info(`X??a th??nh c??ng danh m???c ${e.name}.`);
        deleteMenuItem(e.key);
    };
    async function deleteMenuItem(id) {
        await axios.delete(`http://localhost:4000/menus/${id}`);
    }
    const addNewMenu = () => {
        setInitialValues({ key: '', label: '', name: '', order: '', pid: 0, value: '' });
        setIsModalOpen(true);
        setIsAddNew(true);
    };
    function downloadFile(data, filename) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function handleDownloadClick() {
        downloadFile(nestedData, 'myDataFile');
    }
    return (
        <>
            <Row gutter={[16, 32]}>
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Button type="primary" icon={<PlusCircleOutlined />} onClick={addNewMenu}>
                                Th??m m???i danh m???c
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => {
                                    setExpanKeys([]);
                                }}
                            >
                                ????ng t???t c???
                            </Button>
                            <Button
                                type="dashed"
                                danger
                                icon={<FileDoneOutlined />}
                                onClick={handleDownloadClick}
                                style={{ marginLeft: 'auto', float: 'right' }}
                            >
                                Xu???t file json
                            </Button>
                        </Col>
                        <Col span={24}>
                            <Table
                                bordered
                                key={nestedData.key}
                                ExpandedRowKeys={expanKeys}
                                //expandRowByClick= {true}
                                columns={columns}
                                dataSource={nestedData}
                                pagination={false}
                                size="small"
                                rowClassName={(record, index) => (record.pid === 0 ? 'green' : null)}
                            />
                            <p style={{ height: '100px' }}></p>
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
                okText="L??u l???i"
                title={`${isAddNew ? 'Th??m' : 'S???a'} danh m???c`}
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
                            <Form.Item label="T??n danh m???c" name="name" required={true}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Th??? t???" name="order" required={true}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item label="Th?? m???c cha" name="pid" required={true}>
                                <TreeSelect
                                    showSearch
                                    placeholder="Please select"
                                    dropdownMatchSelectWidth={true}
                                    allowClear
                                    treeDefaultExpandAll
                                    treeData={nestedData}
									value={['55']}
									onChange={(value) => console.log('Selected:', value)}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
            <Drawer title={`${selectedMenuHDSD.name}`} placement="right" size="large" onClose={onClose} open={open}>
                <AddStepToHDSD pid={selectedMenuHDSD.id} />
            </Drawer>
        </>
    );
};

export default QuanLyDanhMuc;
