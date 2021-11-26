import * as format from '../utils/format'


export default function TdNum({ className, decimal, currency, currencyWithSymbol, children: value }) {

    let formattedValue
    if (decimal) {
        formattedValue = format.asDecimal(value)
    }
    else if (currency) {
        formattedValue = format.asCurrency(value, currency, { hideSymbol: true, crypto: true })
    }
    else if (currencyWithSymbol) {
        formattedValue = format.asCurrency(value, currencyWithSymbol)
    }
    else {
        formattedValue = format.asInteger(value)
    }

    return (
        <td className={"text-right tabular-nums " + className}>{formattedValue}</td>
    )
}
