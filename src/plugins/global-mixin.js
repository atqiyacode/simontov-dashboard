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
        formatNumber(number) {
            const data = new Intl.NumberFormat().format(number);
            return data.replaceAll(',', '.');
        },
        formatCurrency(value) {
            return `${new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(parseInt(value))}`;
        },
        formatPercent(value) {
            return `${new Intl.NumberFormat('id-ID', { maximumSignificantDigits: 3, style: 'percent' }).format(value)}`;
        }
    }
};
