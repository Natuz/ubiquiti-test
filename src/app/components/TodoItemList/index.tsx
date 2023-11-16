'use client';

import { useState, useEffect, useContext, Key } from 'react';
import { Table, PaginationProps, Space, Button, Input } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useSubscription, useMutation } from '@/app/utils/hooks/query';
import { MUTATIONS, SUBSCRIPTIONS } from '@/app/utils/query/todo';
import { IPaginatedResponse, ITodoItem } from '@/interfaces';
import { SorterResult, FilterDropdownProps } from 'antd/lib/table/interface';
import { TodoItemAddModal } from '@/app/components/TodoItemAddModal';
import { Timestamp } from '../Timestamp';
import { useAuth } from '@/app/utils/context/auth';

export function TodoItemList() {
    const defaultPageSize = 10;
    const defaultCurrentPage = 1;

    const { currentUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [currentPage, setCurrentPage] = useState<number>(defaultCurrentPage);
    const [sort, setSort] = useState<SorterResult<ITodoItem>>({ field: 'id', order: 'descend' });
    const [filter, setFilter] = useState<Record<string, (Key | boolean)[] | null>>({});
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

    const { data, loading: watchListLoading } = useSubscription<IPaginatedResponse<ITodoItem>>(
        SUBSCRIPTIONS.watchTodoItemList,
        {
            currentPage,
            pageSize,
            sort,
            filter
        }
    );

    const columns: ColumnsType<ITodoItem> = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
            width: 40,
            align: 'center',
            sorter: true,
            showSorterTooltip: false
        },
        {
            title: 'Title',
            key: 'title',
            dataIndex: 'title',
            filterDropdown: ({
                setSelectedKeys, selectedKeys, confirm
            }: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search..."
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                    >
                        Search
                    </Button>
                </div>),
            filterIcon: () => <SearchOutlined />
        },
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (createdAt) => (
                <Timestamp
                    timestamp={createdAt}
                    format="DD.MM.yyyy HH:mm:ss"
                />
            ),
            width: 180,
            align: 'center',
            sorter: true,
            showSorterTooltip: false
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, item) => (
                <Space size="middle">
                    <Button
                        disabled={!currentUser}
                        size="middle"
                        type="text"
                        onClick={() => onDelete(item.id)}
                        icon={<DeleteOutlined />}
                    />
                </Space>
            ),
            width: 100,
            align: 'center'
        }
    ];

    const { mutateFunction: deleteItem, loading: deleteItemLoading } = useMutation<ITodoItem>(MUTATIONS.deleteTodoItem);

    function onDelete(id: number): void {
        deleteItem({ id });
    }

    function onAdd(): void {
        setAddModalOpen(true);
    }

    const onChange: TableProps<ITodoItem>['onChange'] = (
        pagination: PaginationProps,
        filters: Record<string, (Key | boolean)[] | null>,
        sorter: SorterResult<ITodoItem> | SorterResult<ITodoItem>[]
    ) => {
        setPageSize(pagination.pageSize || defaultPageSize);
        setCurrentPage(pagination.current || defaultCurrentPage);
        setFilter(filters);

        if (Object.keys(sorter).length) {
            if (Array.isArray(sorter)) {
                setSort({ field: sorter[0].columnKey, order: sorter[0].order });
            } else {
                setSort({ field: sorter.columnKey, order: sorter.order });
            }
        }
    };

    useEffect(() => {
        setLoading(watchListLoading || deleteItemLoading);
    }, [watchListLoading, deleteItemLoading]);

    useEffect(() => {
        if (data?.total <= pageSize * (currentPage - 1)) {
            setCurrentPage(currentPage - 1);
        }
    }, [data, pageSize, currentPage]);

    return <>
        <Space style={{ marginBottom: '1em' }}>
            <Button
                type="primary"
                disabled={!currentUser}
                onClick={() => onAdd()}
                icon={<PlusOutlined />}
            >
                Add
            </Button>
        </Space>
        <Table
            columns={columns}
            dataSource={data?.items}
            loading={loading}
            onChange={onChange}
            bordered
            pagination={{
                position: ['bottomCenter'],
                showSizeChanger: true,
                pageSize,
                total: data?.total
            }}
        />
        <TodoItemAddModal
            isOpen={addModalOpen}
            handleOk={() => setAddModalOpen(false)}
            handleCancel={() => setAddModalOpen(false)}
        />
    </>;
}
