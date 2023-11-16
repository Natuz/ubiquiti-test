import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/utils/context/auth';
import {
    Row,
    Col,
    Typography,
    Button
} from 'antd';

interface IHeaderProps {
    title: React.ReactNode;
}

export function Header({ title }: IHeaderProps) {
    const { currentUser, login, loading } = useAuth();

    return <Row justify="space-between" align="middle">
        <Col>
            <Typography.Title level={1}>{title}</Typography.Title>
        </Col>
        <Col>
            {currentUser
                ? <Typography.Text>Hello, {currentUser.name}</Typography.Text>
                : <Button
                    loading={loading}
                    onClick={() => login()}
                    icon={<UserOutlined />}
                    type="primary"
                >
                    Login
                </Button>}
        </Col>
    </Row>;
}
