module.exports = {
    retailers: {
        homedepot: {
            name: 'Home Depot',
            url: 'https://www.homedepot.com/b/Deals/N-5yc1vZc1gZ',
            selectors: {
                container: '[data-automation-id="product-pod"]',
                title: '[data-automation-id="product-title"]',
                price: '[data-automation-id="product-price"]',
                originalPrice: '[data-automation-id="was-price"]',
                image: '[data-automation-id="product-image"]',
                link: '[data-automation-id="product-title"]',
                description: '[data-automation-id="product-description"]',
                id: 'data-productid'
            }
        },
        lowes: {
            name: "Lowe's",
            url: 'https://www.lowes.com/pl/Deals/4294641336',
            selectors: {
                container: '.sc-dkrFOg',
                title: '.sc-gswNZR',
                price: '.sc-bcXHqe',
                originalPrice: '.sc-gKPRtg',
                image: '.sc-ipEyDJ',
                link: 'a',
                description: '.sc-eDvSVe',
                id: 'data-item-id'
            }
        },
        bestbuy: {
            name: 'Best Buy',
            url: 'https://www.bestbuy.com/site/misc/deal-of-the-day/pcmcat248000050016.c',
            selectors: {
                container: '.shop-sku-list-item',
                title: '.sku-title a',
                price: '.priceView-customer-price span',
                originalPrice: '.pricing-price__regular-price',
                image: '.product-image img',
                link: '.sku-title a',
                description: '.sku-value',
                id: 'data-sku-id'
            }
        },
        walmart: {
            name: 'Walmart',
            url: 'https://www.walmart.com/deals',
            selectors: {
                container: '[data-item-id]',
                title: '[data-automation-id="product-title"]',
                price: '[data-automation-id="product-price"]',
                originalPrice: '.price__was',
                image: '[data-automation-id="product-image"]',
                link: '[data-automation-id="product-title"]',
                id: 'data-item-id'
            }
        },
        amazon: {
            name: 'Amazon',
            url: 'https://www.amazon.com/gp/goldbox',
            selectors: {
                container: '[data-testid="deal-card"]',
                title: '[data-testid="deal-card-title"]',
                price: '.a-price-whole',
                originalPrice: '.a-text-price',
                image: '[data-testid="deal-card-image"] img',
                link: 'a',
                id: 'data-deal-id'
            }
        }
    },
    proxyList: [
        // Add your proxy servers here
        // 'http://proxy1.example.com:8080',
        // 'http://proxy2.example.com:8080'
    ],
    browserOptions: {
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080'
        ],
        ignoreHTTPSErrors: true
    },
    retryOptions: {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000
    },
    blockList: [
        'datadome',
        'imperva',
        'recaptcha',
        'cloudflare',
        'distil',
        'hcaptcha'
    ]
};
