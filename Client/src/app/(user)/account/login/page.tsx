'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Form, Input, Button, Card, Typography, message, Spin, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authActions';
import styles from './login.module.scss';

const { Title, Text } = Typography;

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            // @ts-ignore
            await dispatch(login(values.email, values.password));
            message.success('Đăng nhập thành công!');
            router.push('/');
        } catch (error: any) {
            message.error(error.message || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <Card className={styles.loginCard}>
                <div className={styles.brandIcons}>
                    <Image src="/image/icon/nike.png" alt="Nike" width={40} height={40} />
                    <Image src="/image/icon/jordan.png" alt="Jordan" width={40} height={40} />
                </div>
                <div className={styles.loginHeader}>
                    <Title level={2}>Đăng nhập</Title>
                    <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
                </div>

                <Spin spinning={loading}>
                    <Form
                        name="user_login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined />} 
                                placeholder="Email" 
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="Mật khẩu" 
                            />
                        </Form.Item>

                        <Form.Item>
                            <div className={styles.forgotPassword}>
                                <Link href="/account/forgot-password">Quên mật khẩu?</Link>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className={styles.loginButton}
                                loading={loading}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>

                <Divider plain>Hoặc đăng nhập với</Divider>
                
                <div className={styles.socialLogin}>
                    <Button icon={<GoogleOutlined />} className={styles.googleButton}>
                        Google
                    </Button>
                    <Button icon={<FacebookOutlined />} className={styles.facebookButton}>
                        Facebook
                    </Button>
                </div>

                <div className={styles.registerLink}>
                    <Text type="secondary">Chưa có tài khoản? </Text>
                    <Link href="/account/register">Đăng ký ngay</Link>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage;