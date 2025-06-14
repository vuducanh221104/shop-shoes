'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Form, Input, Button, Card, Typography, message, Spin, Divider } from 'antd';
import { LockOutlined, MailOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { registerOnly } from '@/redux/authActions';
import styles from './register.module.scss';

const { Title, Text } = Typography;

interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const onFinish = async (values: RegisterFormValues) => {
        if (values.password !== values.confirmPassword) {
            message.error('Mật khẩu nhập lại không khớp!');
            return;
        }

        setLoading(true);
        try {
            // Generate username from email
            const username = values.email.split('@')[0];
            // @ts-ignore
            await dispatch(registerOnly(username, values.email, values.password));
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            router.push('/account/login');
        } catch (error: any) {
            message.error(error.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <Card className={styles.registerCard}>
                <div className={styles.brandIcons}>
                    <Image src="/image/icon/nike.png" alt="Nike" width={40} height={40} />
                    <Image src="/image/icon/jordan.png" alt="Jordan" width={40} height={40} />
                </div>
                <div className={styles.registerHeader}>
                    <Title level={2}>Đăng ký</Title>
                    <Text type="secondary">Tạo tài khoản mới</Text>
                </div>

                <Spin spinning={loading}>
                    <Form
                        name="user_register"
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
                                prefix={<MailOutlined />} 
                                placeholder="Email" 
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="Mật khẩu" 
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="Xác nhận mật khẩu" 
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className={styles.registerButton}
                                loading={loading}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>

                <Divider plain>Hoặc đăng ký với</Divider>
                
                <div className={styles.socialLogin}>
                    <Button icon={<GoogleOutlined />} className={styles.googleButton}>
                        Google
                    </Button>
                    <Button icon={<FacebookOutlined />} className={styles.facebookButton}>
                        Facebook
                    </Button>
                </div>

                <div className={styles.loginLink}>
                    <Text type="secondary">Đã có tài khoản? </Text>
                    <Link href="/account/login">Đăng nhập ngay</Link>
                </div>
            </Card>
        </div>
    );
}

export default RegisterPage;