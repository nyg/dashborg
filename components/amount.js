import NumberFormat from 'react-number-format'

export default function Amount({ value }) {
    return (
        <NumberFormat value={value} displayType="text" thousandSeparator={true} fixedDecimalScale={true} decimalScale="2" />
    )
}