const locales = typeof navigator !== 'undefined' ? navigator.language : 'en-GB'


/* Dates */

const longDateFormatter = new Intl.DateTimeFormat(locales, { year: 'numeric', month: 'short', day: 'numeric' })
export function asLongDate(timestamp) {
  return longDateFormatter.format(timestamp)
}

const shortDateFormatter = new Intl.DateTimeFormat(locales, { month: 'short', day: 'numeric' })
export function asShortDate(timestamp) {
  return shortDateFormatter.format(timestamp)
}

const dateTimeFormatter = new Intl.DateTimeFormat(locales, { dateStyle: 'short', timeStyle: 'short' })
export function asDateTime(timestamp) {
  return dateTimeFormatter.format(timestamp)
}

/* Percentages */

const percentageFormatter = new Intl.NumberFormat(locales, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
export function asPercentage(value) {
  return percentageFormatter.format(value)
}

/* Number */

const decimalFormatter = new Intl.NumberFormat(locales, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export function asDecimal(number) {
  return decimalFormatter.format(number)
}

const integerFormatter = new Intl.NumberFormat(locales, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
export function asInteger(number) {
  return integerFormatter.format(number)
}

/* Currency amounts */

const currencyFractionDigits = {
  'BTC': 8,
  'ETH': 5,
  'PAXG': 5,
}

const currencyFormatters = {}


const crypto = ['BTC', 'ETH', 'CHSB', 'PAXG', 'ENJ', 'BNB', 'AAVE', 'KNC', 'COMP', 'REN', 'UNI', 'UTK', 'CHZ', 'DOT', 'XLM', 'HBAR', 'XTZ', 'ADA', 'ZIL', 'MKR', 'BAT', 'LINK']
export function asCurrency(amount, currency, { hideSymbol = false }) {

  return new Intl
    .NumberFormat(locales, {
      style: 'currency',
      // not all crypto symbols are supported
      currency: crypto ? 'CHF' : currency,
      // for all crypto we will display 8 decimals
      ...(crypto.includes(currency) ? { minimumFractionDigits: 5, maximumFractionDigits: 5 } : {})
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
