    'use client';
    
import { useState, useEffect } from 'react';
import { Layout, Typography, Table, Button, Space, Modal, message, Tag, Image, Form, Input, InputNumber, Select, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, EyeOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface Size {
    size: string;
    stock: number;
}

interface ProductVariant {
    id: number;
    color: string;
    sizes: {
        $values: Size[];
    };
    images: {
        $values: string[];
    };
    totalStock: number;
}

interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
}

interface PriceDetails {
    original: number;
    discount: number;
    quantityDiscount: number;
}

interface Product {
    id: number;
    name: string;
    brand: string;
    category: Category;
    categoryId: number;
    description: string;
    price: number;
    priceDiscount: number;
    slug: string;
    stock: number;
    variants: {
        $values: ProductVariant[];
    };
    createdAt: string;
    updatedAt: string;
}

interface ProductFormValues {
    name: string;
    brand: string;
    categoryId: number;
    description: string;
    priceDetails: {
        original: number;
        discount: number;
        quantityDiscount: number;
    };
    stock: number;
    variants: {
        color: string;
        sizes: { size: string; stock: number; }[];
        images: string[];
    }[];
    slug?: string;
}

function AdminProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<{ [key: number]: UploadFile[] }>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploadedImages, setUploadedImages] = useState<{ [key: number]: string[] }>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data.$values || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/products');
            // Lấy mảng sản phẩm từ response
            const productsData = response.data.$values || [];
            setProducts(productsData);
        } catch (error) {
            message.error('Failed to fetch products');
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const showViewModal = (product: Product) => {
        setSelectedProduct(product);
        setViewModalVisible(true);
    };

    const showEditModal = (product: Product) => {
        setSelectedProduct(product);
        
        // Initialize uploadedImages with existing images from product variants
        const initialImages: { [key: number]: string[] } = {};
        product.variants.$values.forEach((variant, index) => {
            initialImages[index] = variant.images.$values || [];
        });
        setUploadedImages(initialImages);
        
        form.setFieldsValue({
            name: product.name,
            brand: product.brand,
            categoryId: product.categoryId,
            description: product.description,
            priceDetails: {
                original: product.price,
                discount: product.priceDiscount
            },
            stock: product.stock,
            slug: product.slug,
            variants: product.variants.$values.map(variant => ({
                color: variant.color,
                sizes: variant.sizes.$values,
                images: variant.images.$values,
            }))
        });
        setEditModalVisible(true);
    };

    const showAddModal = () => {
        form.resetFields();
        setFileList({});
        setAddModalVisible(true);
    };

    const showDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setDeleteModalVisible(true);
    };

    const handleModalCancel = () => {
        setViewModalVisible(false);
        setEditModalVisible(false);
        setAddModalVisible(false);
        setDeleteModalVisible(false);
        setSelectedProduct(null);
        setUploadedImages({});
        setFileList({});
        form.resetFields();
    };

    const uploadImages = async (files: RcFile[]): Promise<string[]> => {
        if (files.length === 0) return [];
        
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('img', file);
            });
            
            console.log('Sending upload request with files:', files.map(f => f.name));
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('Upload response:', response.data);
            // Return the image URLs from the response
            return response.data.$values || response.data;
        } catch (error) {
            console.error('Error uploading images:', error);
            message.error('Failed to upload images');
            return [];
        }
    };

    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
            .trim();
    };

    const handleSubmit = async (values: ProductFormValues) => {
        try {
            console.log('Form submitted with values:', values);
            setSubmitting(true);
            
            // Generate slug if not provided
            if (!values.slug) {
                values.slug = generateSlug(values.name);
            }
            
            // Upload images for each variant and wait for all uploads to complete
            const updatedVariants = await Promise.all(
                values.variants.map(async (variant, index) => {
                    // If we're editing and already have images, use them
                    if (selectedProduct && !fileList[index]?.length) {
                        const existingVariant = selectedProduct.variants.$values[index];
                        return {
                            ...variant,
                            images: existingVariant?.images.$values || []
                        };
                    }
                    
                    // Otherwise upload new images
                    const files = fileList[index]?.map(file => file.originFileObj as RcFile).filter(Boolean) as RcFile[];
                    let imageUrls: string[] = [];
                    
                    if (files?.length) {
                        message.loading(`Uploading images for ${variant.color} variant...`, 0);
                        imageUrls = await uploadImages(files);
                        message.destroy();
                        console.log('Uploaded images:', imageUrls);
                        
                        if (!imageUrls.length) {
                            throw new Error(`Failed to upload images for ${variant.color} variant`);
                        }
                    }
                    
                    return {
                        ...variant,
                        images: imageUrls
                    };
                })
            );
            
            // Convert the form values to match the server's expected structure
            const updatedValues = {
                name: values.name,
                description: values.description,
                brand: values.brand,
                category: [values.categoryId.toString()], // Server expects category as string array
                stock: values.stock,
                // Use direct price properties instead of a nested object
                price: values.priceDetails.original,
                priceDiscount: values.priceDetails.discount === 0 || values.priceDetails.discount === values.priceDetails.original 
                    ? null 
                    : values.priceDetails.discount,
                slug: values.slug,
                variants: updatedVariants
            };
            
            console.log('Final values to submit:', updatedValues);
            
            try {
                if (selectedProduct) {
                    // Edit product
                    console.log(`Updating product ${selectedProduct.id}...`);
                    const response = await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, updatedValues);
                    console.log('Update response:', response.data);
                    message.success('Product updated successfully');
                } else {
                    // Add new product
                    console.log('Creating new product...');
                    const response = await axios.post('http://localhost:5000/api/products', updatedValues);
                    console.log('Create response:', response.data);
                    message.success('Product added successfully');
                }
                handleModalCancel();
                handleRefresh();
            } catch (error: any) {
                console.error('API Error:', error);
                console.error('Error details:', error.response?.data);
                message.error(`API Error: ${error.response?.data?.message || error.message}`);
            }
        } catch (error) {
            message.error('Operation failed');
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        
        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/products/${selectedProduct.id}`);
            message.success('Product deleted successfully');
            setDeleteModalVisible(false);
            setSelectedProduct(null);
            handleRefresh();
        } catch (error) {
            message.error('Failed to delete product');
            console.error('Error deleting product:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Product> = [
        {
            title: 'Image',
            key: 'image',
            width: 100,
            render: (_, record) => (
                <Image
                    src={record.variants?.$values[0]?.images?.$values[0] || '/placeholder.png'}
                    alt={record.name}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                    fallback="/placeholder.png"
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            filters: [
                { text: 'Nike', value: 'Nike' },
                { text: 'Adidas', value: 'Adidas' },
                { text: 'Puma', value: 'Puma' },
            ],
            onFilter: (value, record) => record.brand === value,
        },
        {
            title: 'Category',
            key: 'category',
            render: (_, record) => (
                <Tag color="blue">{record.category?.name}</Tag>
            ),
        },
        {
            title: 'Price',
            key: 'price',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {record.priceDiscount && record.priceDiscount !== 0 && record.priceDiscount !== record.price ? (
                        <>
                            <span style={{ textDecoration: 'line-through', color: '#999' }}>
                                ${(record.price || 0).toLocaleString()}
                            </span>
                            <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                                ${(record.priceDiscount || 0).toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span style={{ fontWeight: 'bold' }}>
                            ${(record.price || 0).toLocaleString()}
                        </span>
                    )}
                </Space>
            ),
            sorter: (a, b) => {
                const aPrice = a.priceDiscount && a.priceDiscount !== 0 && a.priceDiscount !== a.price
                    ? a.priceDiscount
                    : a.price || 0;
                    
                const bPrice = b.priceDiscount && b.priceDiscount !== 0 && b.priceDiscount !== b.price
                    ? b.priceDiscount
                    : b.price || 0;
                    
                return aPrice - bPrice;
            },
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => (
                <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                    {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </Tag>
            ),
            sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
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
            title="Product Details"
            open={viewModalVisible}
            onCancel={handleModalCancel}
            footer={[
                <Button key="close" onClick={handleModalCancel}>
                    Close
                </Button>
            ]}
            width={800}
        >
            {selectedProduct && (
                <div>
                    <div style={{ marginBottom: 20 }}>
                        <Image.PreviewGroup>
                            <Space>
                                {selectedProduct.variants.$values[0]?.images.$values.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        width={200}
                                        alt={`Product image ${index + 1}`}
                                    />
                                ))}
                            </Space>
                        </Image.PreviewGroup>
                    </div>
                    <p><strong>Name:</strong> {selectedProduct.name}</p>
                    <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                    <p><strong>Category:</strong> {selectedProduct.category.name}</p>
                    <p><strong>Description:</strong> {selectedProduct.description}</p>
                    {selectedProduct.priceDiscount && selectedProduct.priceDiscount !== 0 && selectedProduct.priceDiscount !== selectedProduct.price ? (
                        <>
                            <p><strong>Original Price:</strong> ${selectedProduct.price.toLocaleString()}</p>
                            <p><strong>Discounted Price:</strong> ${selectedProduct.priceDiscount.toLocaleString()}</p>
                        </>
                    ) : (
                        <p><strong>Price:</strong> ${selectedProduct.price.toLocaleString()}</p>
                    )}
                    <p><strong>Total Stock:</strong> {selectedProduct.stock}</p>
                    <div>
                        <strong>Variants:</strong>
                        {selectedProduct.variants.$values.map((variant, index) => (
                            <div key={index} style={{ marginLeft: 20, marginTop: 10 }}>
                                <p>Color: {variant.color}</p>
                                <p>Sizes:</p>
                                <ul>
                                    {variant.sizes.$values.map((size, sizeIndex) => (
                                        <li key={sizeIndex}>
                                            Size {size.size}: {size.stock} in stock
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );

    const renderProductForm = () => (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                priceDetails: { original: 0, discount: 0, quantityDiscount: 0 },
                variants: [{ color: '', sizes: [], images: [] }]
            }}
        >
            <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="brand"
                label="Brand"
                rules={[{ required: true, message: 'Please enter brand' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
            >
                <Select>
                    {categories.map(category => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
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

            <Form.Item label="Price Details">
                <Form.Item
                    name={['priceDetails', 'original']}
                    label="Original Price (stored in Price field)"
                    rules={[{ required: true, message: 'Please enter original price' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>

                <Form.Item
                    name={['priceDetails', 'discount']}
                    label="Discounted Price (stored in PriceDiscount field)"
                    rules={[{ required: true, message: 'Please enter discounted price' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    >
                    </InputNumber>
                </Form.Item>
            </Form.Item>

            <Form.Item
                name="stock"
                label="Total Stock"
                rules={[{ required: true, message: 'Please enter total stock' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.List name="variants">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                            <div key={field.key} style={{ marginBottom: 24, border: '1px dashed #d9d9d9', padding: 16 }}>
                                <Form.Item
                                    {...field}
                                    label="Color"
                                    name={[field.name, 'color']}
                                    rules={[{ required: true, message: 'Please enter color' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.List name={[field.name, 'sizes']}>
                                    {(sizeFields, { add: addSize, remove: removeSize }) => (
                                        <>
                                            {sizeFields.map((sizeField, sizeIndex) => (
                                                <Space key={sizeField.key} align="baseline">
                                                    <Form.Item
                                                        {...sizeField}
                                                        label="Size"
                                                        name={[sizeField.name, 'size']}
                                                        rules={[{ required: true, message: 'Please enter size' }]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...sizeField}
                                                        label="Stock"
                                                        name={[sizeField.name, 'stock']}
                                                        rules={[{ required: true, message: 'Please enter stock' }]}
                                                    >
                                                        <InputNumber min={0} />
                                                    </Form.Item>
                                                    <Button onClick={() => removeSize(sizeField.name)} danger>
                                                        Remove Size
                                                    </Button>
                                                </Space>
                                            ))}
                                            <Button type="dashed" onClick={() => addSize()} block>
                                                Add Size
                                            </Button>
                                        </>
                                    )}
                                </Form.List>

                                <Form.Item label="Images">
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList[index] || []}
                                        onChange={({ fileList: newFileList }) => {
                                            const updatedFileList = { ...fileList };
                                            updatedFileList[index] = newFileList;
                                            setFileList(updatedFileList);
                                        }}
                                        beforeUpload={() => false}
                                        multiple
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Select Images</div>
                                        </div>
                                    </Upload>
                                    
                                    {selectedProduct && selectedProduct.variants.$values[index]?.images.$values?.length > 0 && !fileList[index]?.length && (
                                        <div style={{ marginTop: 16 }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Current Images:</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {selectedProduct.variants.$values[index].images.$values.map((url, imgIndex) => (
                                                    <Image 
                                                        key={imgIndex} 
                                                        src={url} 
                                                        width={80} 
                                                        height={80}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                ))}
                                            </div>
                                            <div style={{ marginTop: 8, color: '#ff4d4f' }}>
                                                Note: Selecting new images will replace these current images
                                            </div>
                                        </div>
                                    )}
                                </Form.Item>

                                {fields.length > 1 && (
                                    <Button type="text" danger onClick={() => remove(field.name)}>
                                        Remove Variant
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button type="dashed" onClick={() => add()} block>
                            Add Variant
                        </Button>
                    </>
                )}
            </Form.List>
        </Form>
    );

    const renderEditModal = () => (
        <Modal
            title="Edit Product"
            open={editModalVisible}
            onOk={() => {
                console.log('Submitting edit form...');
                form.submit();
            }}
            onCancel={handleModalCancel}
            width={1000}
            confirmLoading={submitting}
        >
            {renderProductForm()}
        </Modal>
    );

    const renderAddModal = () => (
        <Modal
            title="Add New Product"
            open={addModalVisible}
            onOk={() => {
                console.log('Submitting add form...');
                form.submit();
            }}
            onCancel={handleModalCancel}
            width={1000}
            confirmLoading={submitting}
        >
            {renderProductForm()}
        </Modal>
    );

    const renderDeleteModal = () => (
        <Modal
            title="Delete Product"
            open={deleteModalVisible}
            onCancel={() => {
                setDeleteModalVisible(false);
                setSelectedProduct(null);
            }}
            footer={[
                <Button 
                    key="cancel" 
                    onClick={() => {
                        setDeleteModalVisible(false);
                        setSelectedProduct(null);
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
            {selectedProduct && (
                <div>
                    <p>Are you sure you want to delete this product?</p>
                    <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                        <div style={{ marginBottom: 16 }}>
                            <Image
                                src={selectedProduct.variants.$values[0]?.images.$values[0] || '/placeholder.png'}
                                alt={selectedProduct.name}
                                width={100}
                                height={100}
                                style={{ objectFit: 'cover' }}
                                fallback="/placeholder.png"
                            />
                        </div>
                        <p><strong>Name:</strong> {selectedProduct.name}</p>
                        <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                        <p><strong>Category:</strong> {selectedProduct.category.name}</p>
                        {selectedProduct.priceDiscount && selectedProduct.priceDiscount !== 0 && selectedProduct.priceDiscount !== selectedProduct.price ? (
                            <p><strong>Price:</strong> ${selectedProduct.priceDiscount.toLocaleString()}</p>
                        ) : (
                            <p><strong>Price:</strong> ${selectedProduct.price.toLocaleString()}</p>
                        )}
                    </div>
                    <p style={{ color: '#ff4d4f', marginTop: 16 }}>
                        This action cannot be undone. The product will be permanently deleted.
                    </p>
                </div>
            )}
        </Modal>
    );

    return (
        <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3}>Products Management</Title>
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddModal}
                        >
                            Add Product
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
                    dataSource={products}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} products`,
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

export default AdminProductPage;