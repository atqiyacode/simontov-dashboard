export default {
    methods: {
        onNumeric(event) {
            let keyCode = event.keyCode ? event.keyCode : event.which;
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) event.preventDefault();
        },
        numberFormat(number) {
            const data = new Intl.NumberFormat().format(number);
            return data.replaceAll(',', '.');
        },
        numberFloat(number) {
            return Number.parseFloat(number).toFixed(2);
        },
        formatCurrency(value) {
            return `${new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 2
            }).format(parseInt(value))}`;
        },
        formatFLowrate(number) {
            return number.toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },
        formatPercent(value) {
            return `${new Intl.NumberFormat('id-ID', {
                maximumSignificantDigits: 3,
                style: 'percent'
            }).format(value)}`;
        },
        formatDatetime(val) {
            const date = new Date(val);
            const year = date.getFullYear().toString();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);

            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        }
    }
};
