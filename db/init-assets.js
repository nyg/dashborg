// extract assets from: https://swissborg.com/supported-assets
//
// const cryptoCodeClass = 'hczDIU'
// const cryptoNameClass = 'dlAjLN'
// const fiatCodeClass = 'bVRNsF'
// const fiatNameClass = 'llKSba'

// const nodesWith = clazz => [...document.getElementsByClassName(clazz)].map(e => e.textContent)

// const zipNodes = (codeClass, nameClass, type) => {
//     const codes = nodesWith(codeClass)
//     const names = nodesWith(nameClass)
//     return names.map((name, i) => ({ code: codes[i], name: name, type: { connectOrCreate: { where: { value: type }, create: { value: type } } } }))
// }

// // right-click "Copy object"
// zipNodes(cryptoCodeClass, cryptoNameClass, 'Crypto').concat(zipNodes(fiatCodeClass, fiatNameClass, 'Fiat'))

const PrismaClient = require('@prisma/client').PrismaClient;

(async () => {

  const assets = [
    {
      "code": "BTC",
      "name": "Bitcoin",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "ETH",
      "name": "Ethereum",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "CHSB",
      "name": "Swissborg Token",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "USDC",
      "name": "USD Coin",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "PAXG",
      "name": "PAX Gold",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "ENJ",
      "name": "Enjin Coin",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "BNB",
      "name": "Binance Coin",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "AAVE",
      "name": "Aave",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "KNC",
      "name": "KyberNetwork",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "DAI",
      "name": "Dai",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "COMP",
      "name": "Compound",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "REN",
      "name": "Ren",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "UNI",
      "name": "Uniswap",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "UTK",
      "name": "Utrust",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "CHZ",
      "name": "Chilliz",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "DOT",
      "name": "Polkadot",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "XLM",
      "name": "Stellar",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "HBAR",
      "name": "Hedera Hashgraph",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "XTZ",
      "name": "Tezos",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "ADA",
      "name": "Cardano",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "ZIL",
      "name": "Ziliqa",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "MKR",
      "name": "Maker",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "BAT",
      "name": "Basic Attention Token",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "LINK",
      "name": "Chainlink",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Crypto"
          },
          "create": {
            "value": "Crypto"
          }
        }
      }
    },
    {
      "code": "EUR",
      "name": "Euro",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "CHF",
      "name": "Swiss Franc",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "GBP",
      "name": "British Pound",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "CAD",
      "name": "Canadian Dollar",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "CZK",
      "name": "Czech Koruna",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "DKK",
      "name": "Danish Krone",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "HKD",
      "name": "HK Dollar",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "HUF",
      "name": "Hungarian Forint",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "ILS",
      "name": "Israeli Shekel",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "NOK",
      "name": "Norwegian Krone",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "PLN",
      "name": "Polish Złoty",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "RON",
      "name": "Romanian Leu",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "SGD",
      "name": "SG Dollar",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "ZAR",
      "name": "South African Rand",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    },
    {
      "code": "SEK",
      "name": "Swedish Krona",
      "type": {
        "connectOrCreate": {
          "where": {
            "value": "Fiat"
          },
          "create": {
            "value": "Fiat"
          }
        }
      }
    }
  ]

  const prisma = new PrismaClient()
  await prisma.$connect()
  console.log('Connected')

  await prisma.$executeRaw('UPDATE sqlite_sequence SET seq = 0 WHERE name = "Asset" OR name = "AssetType"')
  console.log('Reset sequences')

  await prisma.asset.deleteMany()
  await prisma.assetType.deleteMany()
  console.log('Emptied tables')

  for (const asset of assets) {
    await prisma.asset.create({ data: asset })
  }

  console.log('Inserted rows')

  await prisma.$disconnect()
  console.log('Done')
})()
