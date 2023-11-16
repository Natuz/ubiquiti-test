import {
    useQuery as useClientQuery,
    useMutation as useClientMutation,
    useSubscription as useClientSubscription
} from '@apollo/client';
import { IGQLQuery, IGQLMutation } from '../query';

interface IQueryResult<T> {
    data: T;
    loading: boolean;
}

interface ISubscriptionResult<T> extends IQueryResult<T> { }

interface IMutationResult<T> extends IQueryResult<T> {
    mutateFunction: (variables?: Record<string, any>) => Promise<T>;
}

export function useSubscription<T>(
    { name, query }: IGQLQuery,
    variables: Record<string, any> = {}
): ISubscriptionResult<T> {
    const { data, loading } = useClientSubscription(query, { variables });

    return {
        data: data ? data[name] : null,
        loading
    };
}

export function useQuery<T>(
    { name, query }: IGQLQuery,
    variables: Record<string, any> = {}
): IQueryResult<T> {
    const { data, loading } = useClientQuery(query, { variables });

    return {
        data: data ? data[name] : null,
        loading
    };
}

export function useMutation<T>(
    { name, mutation }: IGQLMutation
): IMutationResult<T> {
    const [mutateFunction, { data, loading }] = useClientMutation(mutation);

    return {
        mutateFunction: async (variables) => {
            const result = await mutateFunction({ variables });

            return result?.data ? result.data[name] : null;
        },
        data: data ? data[name] : null,
        loading
    };
}
