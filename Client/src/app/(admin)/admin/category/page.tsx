'use client';

import { useState, useEffect } from 'react';
import { Layout, Typography, Table, Button, Space, Modal, message, Form, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}

interface CategoryFormValues {
    name: string;
    description?: string;
    slug?: string;
}

function AdminCategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/categories');
            const categoriesData = response.data.$values || response.data || [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            message.error('Failed to fetch categories');
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const showEditModal = (category: Category) => {
        setSelectedCategory(category);
        form.setFieldsValue({
            name: category.name,
            description: category.description,
            slug: category.slug
        });
        setEditModalVisible(true);
    };

    const showAddModal = () => {
        form.resetFields();
        setAddModalVisible(true);
    };

    const handleModalCancel = () => {
        setEditModalVisible(false);
        setAddModalVisible(false);
        setSelectedCategory(null);
        form.resetFields();
    };

    const handleSubmit = async (values: CategoryFormValues) => {
        try {
            setLoading(true);
            if (selectedCategory) {
                // Edit category
                await axios.put(`http://localhost:5000/api/categories/${selectedCategory.id}`, values);
                message.success('Category updated successfully');
            } else {
                // Add new category
                await axios.post('http://localhost:5000/api/categories', values);
                message.success('Category added successfully');
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

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/categories/${id}`);
            message.success('Category deleted successfully');
            handleRefresh();
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                message.error('Cannot delete category that has products. Remove or reassign products first.');
            } else {
                message.error('Failed to delete category');
            }
            console.error('Error deleting category:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Category> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this category?"
                        description="This action cannot be undone. Products in this category may be affected."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const renderCategoryForm = () => (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter category name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="slug"
                label="Slug"
                help="Leave empty to auto-generate from name"
            >
                <Input />
            </Form.Item>
        </Form>
    );

    const renderEditModal = () => (
        <Modal
            title={`Edit Category: ${selectedCategory?.name}`}
            open={editModalVisible}
            onOk={form.submit}
            onCancel={handleModalCancel}
            confirmLoading={loading}
        >
            {renderCategoryForm()}
        </Modal>
    );

    const renderAddModal = () => (
        <Modal
            title="Add New Category"
            open={addModalVisible}
            onOk={form.submit}
            onCancel={handleModalCancel}
            confirmLoading={loading}
        >
            {renderCategoryForm()}
        </Modal>
    );

    return (
        <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3}>Categories Management</Title>
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddModal}
                        >
                            Add Category
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
                    dataSource={categories}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} categories`,
                    }}
                />
            </div>
            {renderEditModal()}
            {renderAddModal()}
        </Content>
    );
}

export default AdminCategoryPage;