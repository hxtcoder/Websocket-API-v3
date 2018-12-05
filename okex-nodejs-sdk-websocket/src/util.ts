export  function legacyProductId(instrument_id: string): string {
    const split = instrument_id.split('-');
    return `${split[0].toLowerCase()}_${split[1].toLowerCase()}`;
}