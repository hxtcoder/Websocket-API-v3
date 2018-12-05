export default interface Instrument {
    instrument_id: string;
    base_currency: string;
    quote_currency: string;
    min_size: string;
    size_increment: string;
    tick_size: string;
}