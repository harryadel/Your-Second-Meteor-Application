export const PAGE_SIZES = [5, 10, 15, 20, 50, 100];

export const PROPERTY_TYPES_1 = ["sale", "rent"];
export const PROPERTY_TYPES_2 = ["residential", "commercial"];
export const PROPERTY_TYPES_2_MAPPING = {
  residential: "residential",
  commercial: "commercial",
};
export const PROPERTY_TYPES_RES_3 = [
  {
    _id: "basement",
    label: "Basement",
    rating: 1,
  },
  {
    _id: "apartment",
    label: "Apartment",
    rating: 2,
  },
  {
    _id: "duplex",
    label: "Duplex",
    rating: 3,
  },
  {
    _id: "penthouse",
    label: "Penthouse",
    rating: 3.5,
  },
  {
    _id: "townhouse",
    label: "Town House",
    rating: 5,
  },
  {
    _id: "twinhouse",
    label: "Twin House",
    rating: 6,
  },
  {
    _id: "villa",
    label: "Villa",
    rating: 8,
  },
];

export const PROPERTY_TYPES_COM_3 = [
  {
    _id: "shop",
    label: "Shop",
    rating: 1,
  },
  {
    _id: "clinic",
    label: "Clinic",
    rating: 1,
  },
  {
    _id: "office",
    label: "Office",
    rating: 1,
  },
  {
    _id: "industrial",
    label: "Industrial",
    rating: 1,
  },
  {
    _id: "land",
    label: "Land",
    rating: 1,
  },
];
// export const PAYMENT_OPTIONS = ['cash', 'installment']

export const SOURCE_ITEMS = {
  bk: "LeadsNet",
  olx: "dubizzle",
  pf: "Property Finder",
  fb: "Facebook",
};

export const CURRENCIES_ALLOWED = ["egp", "usd"];
export const PRICE_TYPES_ALLOWED = ["fixed", "installments"];
export const PRICE_TYPES_ALLOWED_MAPPING = {
  fixed: "fixed",
  installments: "installments",
};

export const PROPERTY_STATUSES = Object.freeze({
  active: "active",
  inactive: "inactive",
  expired: "expired",
  deleted: "deleted",
  tobedeleted: "tobedeleted",
  sold: "sold",
  testing: "testing",
  chatGPT: "chatGPT",
});

type UsersStatusKeys = keyof typeof PROPERTY_STATUSES;
export type PROPERTY_STATUSES = (typeof PROPERTY_STATUSES)[UsersStatusKeys];

export const PROPERTY_STATUSES_COLOR_MAPPING = Object.freeze({
  [PROPERTY_STATUSES.active]: "green",
  [PROPERTY_STATUSES.inactive]: "yellow",
  [PROPERTY_STATUSES.expired]: "orange",
  [PROPERTY_STATUSES.deleted]: "red",
  [PROPERTY_STATUSES.tobedeleted]: "red",
  [PROPERTY_STATUSES.sold]: "black",
  [PROPERTY_STATUSES.testing]: "blue",
  [PROPERTY_STATUSES.chatGPT]: "purple",
});

export const SOURCES = Object.freeze({
  bk: "bk",
  olx: "olx",
  pf: "pf",
  fb: "fb",
});

type SourcesKeys = keyof typeof SOURCES;
export type SOURCES = (typeof SOURCES)[SourcesKeys];

export const SOURCES_COLOR_MAPPING = Object.freeze({
  [SOURCES.bk]: "blue",
  [SOURCES.olx]: "yellow",
  [SOURCES.pf]: "orange",
  [SOURCES.fb]: "green",
});

export const NOTIFICATIONS_TYPES = ["property", "request", "chat", "default"];

export const JOBS_STATUSES_COLOR_MAPPING = Object.freeze({
  pending: "blue",
  success: "green",
  failure: "red",
  executing: "yellow",
});

export const JOBS_DATA_STATUSES = Object.freeze({
  SUCCESS: "success",
  FAILURE: "failed",
  ERROR: "error",
});
type JobsDataStatusKeys = keyof typeof JOBS_DATA_STATUSES;
export type JOBS_DATA_STATUSES = (typeof JOBS_DATA_STATUSES)[JobsDataStatusKeys];

export const JOBS_DATA_STATUSES_COLOR_MAPPING = Object.freeze({
  [JOBS_DATA_STATUSES.SUCCESS]: "green",
  [JOBS_DATA_STATUSES.FAILURE]: "red",
  [JOBS_DATA_STATUSES.ERROR]: "orange",
});

export const PROPERTY_DEFAULT_EXPIRY_DATE_MONTH = 6;

export const MATCHING_STEPS = {
  locationAreaStep: 0.0001, // 1 point for each 1000m
  maxCashInstallmentSpan: 2, // if cash required, max installments span (in years)
  price: 4.5,
  downPayment: 4.5,
  installmentAmount: 4.5,
  surfaceArea: 2.5,
  propertyType: 0.0005,
  propertyRating: 0.1,
  agentRating: 0.1,
  bedrooms: 1,
  bathrooms: 1,
  receptionPieces: 1,
  areaRating: 0.005,
  source: 0.01,
  stretchingFactor: 0.9,
};
