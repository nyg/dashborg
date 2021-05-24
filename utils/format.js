const locales = typeof navigator !== 'undefined' ? navigator.language : 'en-GB'

const shortDateFormatter = new Intl.DateTimeFormat(locales, { month: 'short', day: 'numeric' })
const longDateFormatter = new Intl.DateTimeFormat(locales, { year: 'numeric', month: 'short', day: 'numeric' })
const dateTimeFormatter = new Intl.DateTimeFormat(locales, { dateStyle: 'short', timeStyle: 'short' })
const percentageFormatter = new Intl.NumberFormat(locales, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* Dates */

export function asLongDate(timestamp) {
  return longDateFormatter.format(timestamp)
}

export function asShortDate(timestamp) {
  return shortDateFormatter.format(timestamp)
}

export function asDateTime(timestamp) {
  return dateTimeFormatter.format(timestamp)
}

/* Percentages */

export function asPercentage(value) {
  return percentageFormatter.format(value)
}

/* Currency amounts */

export function asCurrency(amount, currency, { hideSymbol = false, crypto = false }) {
  return new Intl
    .NumberFormat(locales, {
      style: 'currency',
      // not all crypto symbols are supported
      currency: crypto ? 'CHF' : currency,
      // for all crypto we will display 8 decimals
      ...(crypto ? { minimumFractionDigits: 8, maximumFractionDigits: 8 } : {})
    })
    .formatToParts(amount)
    .filter(p => hideSymbol
      // if we want to hide the symbol, filter out the currency part
      ? p.type != 'currency'
      // if it's crypto replace the CHF symbol by the real crypto symbol
      : (crypto && p.value == 'currency' ? ((p.value = currency) || true) : true))
    .reduce((s, p) => s + p.value, '')
    .trim()
}

export function asDecimal(number) {
  return new Intl
    .NumberFormat(locales, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(number)
}
