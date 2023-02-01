import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Row, Col, Space, Table, Select, Tooltip, Modal, message } from 'antd';
import { EditOutlined, SearchOutlined, DeleteOutlined, CheckCircleFilled, CloseCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { } from '@ant-design/icons';
import AdvancedSearchForm from '~/components/Form/AdvancedSearchForm';
const { Option } = Select;

const { confirm } = Modal;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <Input /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const LyDoKhachHangReport = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    console.log(record.key)
    setEditingKey(record.key);
  };

  const save = async (key) => {
    try {
      const row = (await form.validateFields());

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setEditingKey('');
      } else {
        newData.push(row);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const cancel = () => {
    setEditingKey('');
  };

  const showConfirm = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa lý do này?',
      icon: <DeleteOutlined />,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk () {
        messageApi.open({
          type: 'success',
          content: 'Xoá thành công',
        });
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 50
    },
    {
      title: 'Lí do',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical">
          <Space wrap>
            {isEditing(record) ? (
              <>
                <Tooltip title="Đồng ý">
                  <Button shape="circle" icon={<CheckCircleFilled />} type="primary" onClick={() => save(record.key)} />
                </Tooltip>
                <Tooltip title="Huỷ">
                  <Button shape="circle" icon={<CloseCircleFilled />} type="primary" danger onClick={cancel} />
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Chỉnh sửa">
                <Button shape="circle" icon={<EditOutlined />} onClick={() => edit(record)} />
              </Tooltip>
            )}
            <Tooltip title="Xoá">
              <Button shape="circle" icon={<DeleteOutlined />} onClick={showConfirm} />
            </Tooltip>
          </Space>
        </Space>
      ),
    }
  ];

  const data = [
    {
      key: '1',
      STT: '1',
      name: 'Không liên lạc được với phía kinh doanh',
    },
    {
      key: '2',
      STT: '2',
      name: 'Không nhận được tiền',
    }
  ];

  const dataForm = [
    {
      formItemProp: {
        name: 'ly-do',
        label: 'Lý do',
      },
      form: <Input placeholder="Nhập" />
    }
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  return (
    <>
      {contextHolder}
      <Row gutter={[16, 32]}>
        <Col span={24}>
          <AdvancedSearchForm dataForm={dataForm} />

        </Col>
        <Col span={24}>
          <Button type="primary" style={{ marginBottom: 16 }} icon={<PlusCircleOutlined />}>
            Thêm mới
          </Button>
          <Table columns={columns} dataSource={data} pagination={{ position: 'bottomRight' }} components={{
            body: {
              cell: EditableCell,
            },
          }}
            columns={mergedColumns}
          />
        </Col>
      </Row>
    </>
  );
};

export default LyDoKhachHangReport;
