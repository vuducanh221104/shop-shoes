'use client';

import { useState, useEffect } from 'react';
import { Layout, Typography, Table, Button, Space, Modal, message, Tag, Form, Input, Select, Card, Divider, Image, List } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface OrderItem {
    $id: string;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
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
    items: {
        $values: OrderItem[];
    };
}

interface OrderFormValues {
    userId: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
    paymentMethod: string;
    status: string;
}

function AdminOrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [form] = Form.useForm();

    const getProductImages = (imagesString: string | null): string[] => {
        if (!imagesString) return [];
        try {
            return JSON.parse(imagesString);
        } catch (error) {
            console.error('Error parsing images string:', error);
            return [];
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/orders');
            const ordersData = response.data.$values || [];
            setOrders(ordersData);
        } catch (error) {
            message.error('Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const showViewModal = (order: Order) => {
        setSelectedOrder(order);
        setViewModalVisible(true);
    };

    const showEditModal = (order: Order) => {
        setSelectedOrder(order);
        form.setFieldsValue({
            userId: order.userId,
            fullName: order.fullName,
            email: order.email,
            phone: order.phone,
            address: order.address,
            city: order.city,
            note: order.note,
            paymentMethod: order.paymentMethod,
            status: order.status
        });
        setEditModalVisible(true);
    };

    const showAddModal = () => {
        form.resetFields();
        setAddModalVisible(true);
    };

    const showDeleteModal = (order: Order) => {
        setSelectedOrder(order);
        setDeleteModalVisible(true);
    };

    const handleModalCancel = () => {
        setViewModalVisible(false);
        setEditModalVisible(false);
        setAddModalVisible(false);
        setDeleteModalVisible(false);
        setSelectedOrder(null);
        form.resetFields();
    };

    const handleSubmit = async (values: OrderFormValues) => {
        try {
            setLoading(true);
            if (selectedOrder) {
                // Edit order
                await axios.put(`http://localhost:5000/api/orders/${selectedOrder.id}`, values);
                message.success('Order updated successfully');
            } else {
                // Add new order
                await axios.post('http://localhost:5000/api/orders', values);
                message.success('Order added successfully');
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
        if (!selectedOrder) return;
        
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/orders/${selectedOrder.id}`);
            message.success('Order deleted successfully');
            setDeleteModalVisible(false);
            setSelectedOrder(null);
            handleRefresh();
        } catch (error) {
            message.error('Failed to delete order');
            console.error('Error deleting order:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'gold';
            case 'processing':
                return 'blue';
            case 'shipped':
                return 'cyan';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    };

    const columns: ColumnsType<Order> = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Customer',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_, record) => (
                <>
                    <div>{record.email}</div>
                    <div>{record.phone}</div>
                </>
            ),
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `$${amount.toLocaleString()}`,
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
            title={`Order Details #${selectedOrder?.id}`}
            open={viewModalVisible}
            onCancel={handleModalCancel}
            footer={[
                <Button key="close" onClick={handleModalCancel}>
                    Close
                </Button>
            ]}
            width={1000}
        >
            {selectedOrder && (
                <div>
                    <Card title="Customer Information" style={{ marginBottom: 16 }}>
                        <p><strong>Full Name:</strong> {selectedOrder.fullName}</p>
                        <p><strong>Email:</strong> {selectedOrder.email}</p>
                        <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                        <p><strong>Address:</strong> {selectedOrder.address}</p>
                        <p><strong>City:</strong> {selectedOrder.city}</p>
                        {selectedOrder.note && <p><strong>Note:</strong> {selectedOrder.note}</p>}
                    </Card>

                    <Card title="Order Information" style={{ marginBottom: 16 }}>
                        <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                        <p><strong>Status:</strong> <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status.toUpperCase()}</Tag></p>
                        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
                        <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toLocaleString()}</p>
                        <p><strong>Created At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                    </Card>

                    <Card title="Order Items">
                        <List
                            dataSource={selectedOrder.items.$values}
                            renderItem={(item: OrderItem) => (
                                    <List.Item>
                                        <Card size="small" style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ marginRight: 16 }}>
                                                    <Image
                                                    src={item.productImage || '/placeholder.png'}
                                                    alt={item.productName}
                                                        width={80}
                                                        height={80}
                                                        style={{ objectFit: 'cover' }}
                                                        fallback="/placeholder.png"
                                                        preview={{
                                                            visible: false,
                                                        src: item.productImage,
                                                            toolbarRender: () => null
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                <p><strong>{item.productName}</strong></p>
                                                    <Space>
                                                        <Tag>Color: {item.color}</Tag>
                                                        <Tag>Size: {item.size}</Tag>
                                                        <Tag>Quantity: {item.quantity}</Tag>
                                                    </Space>
                                                    <p style={{ color: '#f5222d', marginTop: 8 }}>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0
                                                    }).format(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </List.Item>
                            )}
                        />
                    </Card>
                </div>
            )}
        </Modal>
    );

    const renderOrderForm = () => (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="userId"
                label="User ID"
                rules={[{ required: true, message: 'Please enter user ID' }]}
            >
                <Input type="number" />
            </Form.Item>

            <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
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

            <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="note"
                label="Note"
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="paymentMethod"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select payment method' }]}
            >
                <Select>
                    <Select.Option value="cod">Cash on Delivery</Select.Option>
                    <Select.Option value="card">Credit Card</Select.Option>
                    <Select.Option value="bank">Bank Transfer</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
            >
                <Select>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Processing">Processing</Select.Option>
                    <Select.Option value="Shipped">Shipped</Select.Option>
                    <Select.Option value="Delivered">Delivered</Select.Option>
                    <Select.Option value="Cancelled">Cancelled</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    );

    const renderEditModal = () => (
        <Modal
            title={`Edit Order #${selectedOrder?.id}`}
            open={editModalVisible}
            onOk={form.submit}
            onCancel={handleModalCancel}
            confirmLoading={loading}
        >
            {renderOrderForm()}
        </Modal>
    );

    const renderAddModal = () => (
        <Modal
            title="Add New Order"
            open={addModalVisible}
            onOk={form.submit}
            onCancel={handleModalCancel}
            confirmLoading={loading}
        >
            {renderOrderForm()}
        </Modal>
    );

    const renderDeleteModal = () => (
        <Modal
            title="Delete Order"
            open={deleteModalVisible}
            onCancel={() => {
                setDeleteModalVisible(false);
                setSelectedOrder(null);
            }}
            footer={[
                <Button 
                    key="cancel" 
                    onClick={() => {
                        setDeleteModalVisible(false);
                        setSelectedOrder(null);
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
            {selectedOrder && (
                <div>
                    <p>Are you sure you want to delete this order?</p>
                    <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                        <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                        <p><strong>Customer:</strong> {selectedOrder.fullName}</p>
                        <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toLocaleString()}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                    </div>
                    <p style={{ color: '#ff4d4f', marginTop: 16 }}>
                        This action cannot be undone. The order will be permanently deleted.
                    </p>
                </div>
            )}
        </Modal>
    );

    return (
        <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3}>Orders Management</Title>
                    <Space>
                        {/* <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddModal}
                        >
                            Add Order
                        </Button> */}
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
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} orders`,
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

export default AdminOrderPage; 