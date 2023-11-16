'use client';

import { Modal, Form, Input } from 'antd';
import { useMutation } from '@/app/utils/hooks/query';
import { MUTATIONS } from '@/app/utils/query/todo';
import { ITodoItem } from '@/interfaces';

interface ITodoItemModalProps {
    isOpen?: boolean;
    handleOk?: (data: Record<string, any>) => void;
    handleCancel?: () => void;
}

export function TodoItemAddModal({ isOpen, handleOk = () => { }, handleCancel = () => { } }: ITodoItemModalProps) {
    const [form] = Form.useForm();

    const { mutateFunction: addItem, loading } = useMutation<ITodoItem>(MUTATIONS.addTodoItem);

    const handleSubmit = () => {
        form
            .validateFields()
            .then(async (data) => {
                const item = await addItem({ data });

                if (item.id) {
                    form.resetFields();
                    handleOk(data);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }


    return <Modal
        title="Add item"
        open={isOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okButtonProps={{ loading }}
        cancelButtonProps={{ disabled: loading }}
    >
        <Form
            form={form}
            layout="vertical"
            name="add_todo_item"
        >
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please input the title!' }]}
            >
                <Input />
            </Form.Item>
        </Form>
    </Modal>;
}
