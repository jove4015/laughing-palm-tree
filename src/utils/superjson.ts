import SuperJSON from "superjson";
import { Decimal } from "decimal.js";
import { DateTime, Duration, Interval } from "luxon";

SuperJSON.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js",
);
SuperJSON.registerCustom<DateTime, string | null>(
  {
    isApplicable: (v): v is DateTime => DateTime.isDateTime(v),
    serialize: (v) => v.toISO(),
    deserialize: (v) => (v ? DateTime.fromISO(v) : DateTime.invalid("null")),
  },
  "luxon_dt",
);
SuperJSON.registerCustom<Interval, string | null>(
  {
    isApplicable: (v): v is Interval => Interval.isInterval(v),
    serialize: (v) => v.toISO(),
    deserialize: (v) => (v ? Interval.fromISO(v) : Interval.invalid("null")),
  },
  "luxon_int",
);
SuperJSON.registerCustom<Duration, string | null>(
  {
    isApplicable: (v): v is Duration => Duration.isDuration(v),
    serialize: (v) => v.toISO(),
    deserialize: (v) => (v ? Duration.fromISO(v) : Duration.invalid("null")),
  },
  "luxon_dur",
);

export default SuperJSON;
