'use client';

import { useState, useEffect } from 'react';
import { Layout, Typography, Table, Button, Space, Modal, message, Tag, Form, Input, Select, Tabs, Card, Divider, Image, List } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

interface Address {
    id: number;
    street: string;
    city: string;
    district: string;
    ward: string;
    country: string;
    isDefault: boolean;
    userId: number;
}

interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    gender: 'male' | 'female' | 'other';
    phoneNumber: string;
    role: number;
    status: number;
    createdAt: string;
    updatedAt: string;
    addresses: {
        $values: Address[];
    };
    orders: {
        $values: Order[];
    };
}

interface UserFormValues {
    username: string;
    email: string;
    password?: string;
    fullName: string;
    gender: 'male' | 'female' | 'other';
    phoneNumber: string;
    role: number;
}

interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    size: string;
    color: string;
    product: {
        id: number;
        name: string;
        variants: {
            $values: {
                id: number;
                color: string;
                imagesString: string;
            }[];
        };
    };
}

interface Order {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    note: string;
    paymentMethod: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    orderItems: {
        $values: OrderItem[];
    };
}

function AdminUserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data.$values || []);
        } catch (error) {
            message.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const showViewModal = (user: User) => {
        setSelectedUser(user);
        setViewModalVisible(true);
    };

    const showEditModal = (user: User) => {
        setSelectedUser(user);
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            role: user.role
        });
        setEditModalVisible(true);
    };

    const showAddModal = () => {
        form.resetFields();
        setAddModalVisible(true);
    };

    const showDeleteModal = (user: User) => {
        setSelectedUser(user);
        setDeleteModalVisible(true);
    };

    const handleModalCancel = () => {
        setViewModalVisible(false);
        setEditModalVisible(false);
        setAddModalVisible(false);
        setDeleteModalVisible(false);
        setSelectedUser(null);
        form.resetFields();
    };

    const handleSubmit = async (values: UserFormValues) => {
        try {
            setLoading(true);
            if (selectedUser) {
                // Edit user
                await axios.put(`http://localhost:5000/api/users/${selectedUser.id}`, values);
                message.success('User updated successfully');
            } else {
                // Add new user
                await axios.post('http://localhost:5000/api/users', values);
                message.success('User added successfully');
            }
            handleModalCancel();
            handleRefresh();
        } catch (error) {
            message.error('Operation failed');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/users/${selectedUser.id}`);
            message.success('User deleted successfully');
            setDeleteModalVisible(false);
            setSelectedUser(null);
            handleRefresh();
        } catch (error) {
            message.error('Failed to delete user');
            console.error('Error deleting user:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleName = (role: number) => {
        switch (role) {
            case 0:
                return 'USER';
            case 2:
                return 'ADMIN';
            default:
                return 'UNKNOWN';
        }
    };

    const getProductImages = (imagesString: string | null): string[] => {
        if (!imagesString) return [];
        try {
            return JSON.parse(imagesString);
        } catch (error) {
            console.error('Error parsing images string:', error);
            return [];
        }
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender: string) => (
                <Tag color={gender === 'male' ? 'blue' : gender === 'female' ? 'pink' : 'default'}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: number) => (
                <Tag color={role === 2 ? 'red' : 'green'}>
                    {getRoleName(role)}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => showViewModal(record)}
                    />
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteModal(record)}
                    />
                </Space>
            ),
        },
    ];

    const renderViewModal = () => (
        <Modal
            title="User Details"
            open={viewModalVisible}
            onCancel={handleModalCancel}
            footer={[
                <Button key="close" onClick={handleModalCancel}>
                    Close
                </Button>
            ]}
            width={1000}
        >
            {selectedUser && (
                <div>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Basic Information" key="1">
                            <div style={{ marginBottom: 20 }}>
                                <p><strong>Username:</strong> {selectedUser.username}</p>
                                <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                                <p><strong>Gender:</strong> {selectedUser.gender}</p>
                                <p><strong>Role:</strong> {getRoleName(selectedUser.role)}</p>
                                <p><strong>Status:</strong> {selectedUser.status === 1 ? 'Active' : 'Inactive'}</p>
                                <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                                <p><strong>Updated At:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
                            </div>

                            <Divider orientation="left">Addresses</Divider>
                            {selectedUser.addresses?.$values.map((address, index) => (
                                <Card key={index} style={{ marginBottom: 16 }} size="small">
                                    <p>{address.street}</p>
                                    <p>{`${address.ward}, ${address.district}, ${address.city}`}</p>
                                    <p>{address.country}</p>
                                    {address.isDefault && <Tag color="blue">Default Address</Tag>}
                                </Card>
                            ))}
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Orders" key="2">
                            <List
                                dataSource={selectedUser.orders?.$values || []}
                                renderItem={(order: Order) => (
                                    <List.Item>
                                        <Card
                                            title={`Order #${order.id}`}
                                            style={{ width: '100%', marginBottom: 16 }}
                                            extra={
                                                <Tag color={
                                                    order.status === 'Pending' ? 'gold' :
                                                    order.status === 'Completed' ? 'green' :
                                                    order.status === 'Cancelled' ? 'red' : 'default'
                                                }>
                                                    {order.status}
                                                </Tag>
                                            }
                                        >
                                            <div style={{ marginBottom: 16 }}>
                                                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                                <p><strong>Shipping To:</strong> {order.fullName}</p>
                                                <p><strong>Address:</strong> {order.address}, {order.city}</p>
                                                <p><strong>Contact:</strong> {order.phone} | {order.email}</p>
                                                <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                                                <p><strong>Total Amount:</strong> ${order.totalAmount.toLocaleString()}</p>
                                                {order.note && <p><strong>Note:</strong> {order.note}</p>}
                                            </div>

                                            <Divider orientation="left">Order Items</Divider>
                                            <List
                                                dataSource={order.orderItems?.$values || []}
                                                renderItem={(item: OrderItem) => {
                                                    const images = item.product?.variants?.$values[0]?.imagesString 

                                                    return (
                                                        <List.Item>
                                                            <Card size="small" style={{ width: '100%' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <div style={{ marginRight: 16 }}>
                                                                        <Image
                                                                            src={images[0] || '/placeholder.png'}
                                                                            alt={item.product.name}
                                                                            width={80}
                                                                            height={80}
                                                                            style={{ objectFit: 'cover' }}
                                                                            fallback="/placeholder.png"
                                                                            preview={{
                                                                                visible: false,
                                                                                src: images[0],
                                                                                toolbarRender: () => null
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <p><strong>{item.product.name}</strong></p>
                                                                        <Space>
                                                                            <Tag>Color: {item.color}</Tag>
                                                                            <Tag>Size: {item.size}</Tag>
                                                                            <Tag>Quantity: {item.quantity}</Tag>
                                                                        </Space>
                                                                        <p style={{ color: '#f5222d', marginTop: 8 }}>
                                                                            ${item.price.toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </List.Item>
                                                    );
                                                }}
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            )}
        </Modal>
    );

    const renderUserForm = () => (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please enter username' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                ]}
            >
                <Input />
            </Form.Item>

            {!selectedUser && (
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter password' }]}
                >
                    <Input.Password />
                </Form.Item>
            )}

            <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
            >
                <Select>
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select role' }]}
            >
                <Select>
                    <Select.Option value={0}>User</Select.Option>
                    <Select.Option value={2}>Admin</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    );

    const renderEditModal = () => (
        <Modal
            title="Edit User"
            open={editModalVisible}
            onOk={form.submit}
            onCancel={handleModalCancel}
            confirmLoading={loading}
        >
            {renderUserForm()}
        </Modal>
    );

    const renderAddModal = () => (
        <Modal
            title="Add New User"
            open={addModalVisible}
            onOk={form.submit}
            onCancel={handleModalCancel}
            confirmLoading={loading}
        >
            {renderUserForm()}
        </Modal>
    );

    const renderDeleteModal = () => (
        <Modal
            title="Delete User"
            open={deleteModalVisible}
            onCancel={() => {
                setDeleteModalVisible(false);
                setSelectedUser(null);
            }}
            footer={[
                <Button 
                    key="cancel" 
                    onClick={() => {
                        setDeleteModalVisible(false);
                        setSelectedUser(null);
                    }}
                >
                    Cancel
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    danger
                    loading={loading}
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            ]}
        >
            {selectedUser && (
                <div>
                    <p>Are you sure you want to delete this user?</p>
                    <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                        <p><strong>Username:</strong> {selectedUser.username}</p>
                        <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Role:</strong> {getRoleName(selectedUser.role)}</p>
                    </div>
                    <p style={{ color: '#ff4d4f', marginTop: 16 }}>
                        This action cannot be undone. The user will be permanently deleted.
                    </p>
                </div>
            )}
        </Modal>
    );

    return (
        <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3}>Users Management</Title>
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddModal}
                        >
                            Add User
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                        >
                            Refresh
                        </Button>
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} users`,
                    }}
                />
            </div>
            {renderViewModal()}
            {renderEditModal()}
            {renderAddModal()}
            {renderDeleteModal()}
        </Content>
    );
}

export default AdminUserPage;