import './login.scss';
import { Card, Form, Input, Button } from 'antd';
import Logo from '~/assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        // Form submission logic goes here
        navigate('/'); // Navigate to the home page
    };

    return (
        <>
            <div className="login-wrapper">
                <div className="site-card-border-less-wrapper">
                    <div className="text-center" style={{ marginBottom: 32 }}>
                        <img src={Logo} alt="" width={200} style={{ marginBottom: 16 }} />
                        <h2>CMS - HDSD</h2>
                    </div>
                    <Card bordered={false} style={{ maxWidth: '100%', width: 400 }}>
                        <Form
                            onFinish={handleSubmit}
                            layout="vertical"
                            name="basic"
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Form.Item label="Tên đăng nhập" name="username">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Mật khẩu" name="password">
                                <Input.Password />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                                <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Home;
