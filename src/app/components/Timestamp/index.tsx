'use client';

import { formatDate } from '@/app/utils/formatters';

interface ITimestampProps {
    timestamp: number;
    format?: string;
}

export function Timestamp({ timestamp, format = 'DD.MM.yyyy' }: ITimestampProps) {
    return formatDate(timestamp, format);
}
