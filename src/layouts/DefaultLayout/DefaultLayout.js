import PropTypes from 'prop-types';
import { Avatar, Dropdown, Form, Modal, Input, message, Typography, Space } from 'antd';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { SolutionOutlined, UserOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import Logo from '~/assets/images/logo-light.svg';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const defaultMenus = {
    path: '/',
    routes: [
        {
            path: '/quan-ly-he-thong',
            name: 'Quản lý hệ thống',
            icon: <SolutionOutlined />,
            routes: [
                {
                    path: 'quan-ly-danh-muc',
                    name: 'Quản lý Danh mục',
                },
                {
                    path: 'quan-ly-danh-muc/chi-tiet-danh-muc',
                    name: 'Chi tiết danh mục',
                    hideInMenu: true,
                },
                {
                    path: 'quan-ly-danh-muc/them-moi-danh-muc',
                    name: 'Thêm mới danh mục',
                    hideInMenu: true,
                },
                {
                    path: 'chi-tiet-hdsd',
                    name: 'Chi tiết HDSD',
                },
                {
                    path: 'chi-tiet-hdsd/chi-tiet/:id',
                    name: 'Chi tiết HDSD',
                    hideInMenu: true,
                },
            ],
        },
    ],
};

const RightContent = ({ data }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        messageApi.open({
            type: 'success',
            content: 'Thay đổi thành công',
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const items = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: <Link to="">Thông tin tài khoản</Link>,
        },
        {
            key: '2',
            icon: <KeyOutlined />,
            onClick: showModal,
            label: <>Đổi mật khẩu</>,
        },
        {
            key: '3',
            icon: <LogoutOutlined />,
            label: <Link to="/login">Đăng xuất</Link>,
        },
    ];
    return (
        <div>
            {contextHolder}
            <Avatar icon={<UserOutlined />} />{' '}
            <Dropdown menu={{ items }} placement="bottomRight">
                <Typography.Link>
                    <Space className="link-color-white">{data.name} </Space>
                </Typography.Link>
            </Dropdown>
            <Modal
                open={isModalOpen}
                maskClosable={true}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu lại"
                title="Đổi mật khẩu"
            >
                <Form labelAlign="left" labelCol={{ span: 9 }} wrapperCol={{ span: 16 }}>
                    <Form.Item label="Mật khẩu hiện tại" required>
                        <Input.Password type="password" />
                    </Form.Item>
                    <Form.Item label="Mật khẩu mới" required>
                        <Input.Password type="password" />
                    </Form.Item>
                    <Form.Item label="Nhập lại mật khẩu mới " required>
                        <Input.Password type="password" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
function DefaultLayout({ children, selected, pageTitle }) {

    const dataUser = useSelector((state) => state.user);
    const [userinfo, setUserinfo] = useState(dataUser);
    const location = useLocation();
    return (
        <ProLayout
            style={{
                minHeight: 500,
            }}
            siderWidth={260}
            fixSiderbar
            location={location}
            route={defaultMenus}
            menuItemRender={(item, defaultDom) => <Link to={item.path}> {defaultDom} </Link>}
            layout="mix"
            logo={Logo}
            title="HDSD App"
            rightContentRender={() => <RightContent data={userinfo} />}
            breadcrumbRender={(route) =>
                route.map(({ path, ...rest }) => ({ path: `${process.env.PUBLIC_URL}${path}`, ...rest }))
            }
            headerTitleRender={(logo, title, _) => {
                const defaultDom = (
                    <Link to="/">
                        <img alt="logo" src={Logo} />
                        {title}
                    </Link>
                );
                if (document.body.clientWidth < 1400) {
                    return defaultDom;
                }
                if (_.isMobile) return defaultDom;
                return <>{defaultDom}</>;
            }}
        >
            <PageContainer title={pageTitle}>
                <div
                    style={{
                        minHeight: 600,
                    }}
                >
                    {children}
                </div>
            </PageContainer>
        </ProLayout>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
