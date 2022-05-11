export default class Helpers {
    public getSumOfThrows(array): number {
        let total = 0;
        array.forEach(value => {
          total = total + value;
        });

        return total;
    }

    public formatFirestoreDatetime(timestamp: number) {
        const date = new Date(timestamp);
        // eslint-disable-next-line max-len
        return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} - ${date.getHours()}:${('0'+ date.getMinutes()).slice(-2)}`;
    }
}
