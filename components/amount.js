import { NumericFormat } from 'react-number-format'

export default function Amount({ value }) {
    return (
        <NumericFormat value={value} displayType="text" thousandSeparator={true} fixedDecimalScale={true} decimalScale="2" />
    )
}
