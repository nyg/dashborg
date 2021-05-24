import * as format from '../utils/format'

export default function TdNum({ className, children }) {
    return (
        <td className={"text-right tabular-nums " + className}>{format.asDecimal(children)}</td>
    )
}
