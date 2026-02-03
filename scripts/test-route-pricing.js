// Quick server-pricing emulation for label normalization
// Run with: node scripts/test-route-pricing.js
const pricingStructure = {
  "Standard Clean (FURNISHED)": {
    "1-bed/1-bath": 450,
    "2-bed/1-bath": 600,
    "3-bed/2-bath": 800,
    "4-bed/2+-bath": 1000,
    "5-bed/2+-bath": 1200,
  },
  "Deep Clean (FURNISHED)": {
    "1-bed/1-bath": 800,
    "2-bed/1-bath": 1200,
    "3-bed/2-bath": 1600,
    "4-bed/2+-bath": 2000,
    "5-bed/2+-bath": 2400,
  },
  "Pre and Post Tenancy Deposit Clean (UNFURNISHED)": {
    "1-bed/1-bath": 1000,
    "2-bed/1-bath": 1500,
    "3-bed/2-bath": 2000,
    "4-bed/2+-bath": 2500,
    "5-bed/2+-bath": 3000,
  },
};

const serviceTypeAliases = {
  "Pre and Post Tenancy Clean (UNFURNISHED)": "Pre and Post Tenancy Deposit Clean (UNFURNISHED)",
};

function getBasePrice(serviceType, propertySize) {
  const normalized = serviceTypeAliases[serviceType] || serviceType;
  if (normalized && pricingStructure[normalized]) {
    return pricingStructure[normalized][propertySize] || 0;
  }
  return 0;
}

const tests = [
  { serviceType: 'Pre and Post Tenancy Clean (UNFURNISHED)', propertySize: '4-bed/2+-bath' },
  { serviceType: 'Pre and Post Tenancy Deposit Clean (UNFURNISHED)', propertySize: '4-bed/2+-bath' },
  { serviceType: 'Deep Clean (FURNISHED)', propertySize: '3-bed/2-bath' }
];

for (const t of tests) {
  console.log('ServiceType:', t.serviceType, '=> basePrice:', getBasePrice(t.serviceType, t.propertySize));
}
