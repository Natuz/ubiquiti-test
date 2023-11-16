'use client';

import { ApolloProvider } from '@apollo/client';
import { TodoItemList } from '@/app/components/TodoItemList';
import { client } from '@/app/utils/query';
import { ConfigProvider } from 'antd';
import theme from '@/app/utils/themeConfig';
import { AuthProvider } from '@/app/utils/context/auth';
import { Header } from '@/app/components/Header';

export default function Home() {
    return <ApolloProvider client={client}>
        <ConfigProvider theme={theme}>
            <AuthProvider>
                <main style={{ maxWidth: 1024, margin: '2em auto' }}>
                    <Header title="Todo List" />
                    <TodoItemList />
                </main>
            </AuthProvider>
        </ConfigProvider>
    </ApolloProvider>;
}
