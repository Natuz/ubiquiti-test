import moment from 'moment';

export const formatDate = (timestamp: number, format = 'DD.MM.yyyy'): string => {
    return moment.unix(timestamp / 1000).local().format(format);
}
