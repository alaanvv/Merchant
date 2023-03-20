const items = {
  fullTimeEmployee: {
    id: 'fullTimeEmployee',
    name: 'Full Time Employee',
    description: 'If you have this item, you can work faster.',
    price: 50,

    maxStack: 1,
    
    usable: false,
  },
  cock: {
    id: 'cock',
    name: 'Cock',
    description: 'Fighter cock',
    price: 5,
    
    maxStack: 1,

    usable: false,
    destroyMessage: 'You  battled against your cock and obviously you winned'
  },
  sido: {
    id: 'sido',
    name: 'Sido',
    description: 'Apenas',
    price: 1,

    usable: true,
    useMessage: `<:sico_1:874793000004370432><:sico_2:874793097643581541><:sico_3:874793237179691079>\n<:sico_4:874793470634651688><:sico_5:874793538041294890><:sico_6:874793606588821516>\n<:sico_7:874793766496665700><:sico_8:874793831449657386><:sico_9:874793899774869574>\n<:sico_10:874794143090630666><:sico_11:874794057837199370><:sico_12:874794217367564299>\n<:sico_13:874794821980684339><:sico_14:874794903828324404><:sico_15:874794991963222096>`,
    destroyMessage: 'aiai'
  }
}

function getItem(itemId) {
  return items[itemId]
}

module.exports = { items, getItem }