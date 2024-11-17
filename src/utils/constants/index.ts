export const ACTIVE_BUSINESS_ID = "activeBusinessId";
export const AUTH_TOKEN = "token";

export const planDetails = [
    {
      id: "BASIC_FREE",
      name: "Basic Free",
      description:
        "Get started with our free plan and explore the basic features suitable for small businesses with limited needs.",
      price: "0",
      currency: "INR",
      additionalInfo: [
        { Key: "No of Businesses", Value: "Up to 1" },
        { Key: "No of Services", Value: "Up to 5" },
        { Key: "Orders Per Month", Value: "Up to 5" },
        { Key: "Products Listed", Value: "Up to 5" },
        { Key: "Support", Value: "Not Included" },
        { Key: "Advanced Analytics", Value: "Not Included" },
        { Key: "Dedicated Account Manager", Value: "Not Included" },
        { Key: "Custom Integrations", Value: "Not Included" },
      ],
      type: "YEAR",
      discount:{
        type: "percentage",
        value: "0"
      },
      subscriptionId: "BASIC_FREE",
      limitations:  {
            businesses: 1,
            services: 5,
            blogs: 5,
            albums:5,
            products:10,
            orders:10,
            categories: 10
      }
    },
    {
      id: "STARTER_WEEK",
      name: "Starter Week",
      description:
        "Ideal for new businesses looking to expand their reach over a short period with higher limits and access to more features.",
      price: "500",
      currency: "INR",
      additionalInfo: [
        { Key: "No of Businesses", Value: "Up to 3" },
        { Key: "No of Services", Value: "Up to 25" },
        { Key: "Orders Per Month", Value: "Up to 100" },
        { Key: "Products Listed", Value: "Up to 50" },
        { Key: "Support", Value: "Not Included" },
        { Key: "Advanced Analytics", Value: "Not Included" },
        { Key: "Dedicated Account Manager", Value: "Not Included" },
        { Key: "Custom Integrations", Value: "Not Included" },
      ],
      type: "WEEK",
      discount:{
        type: "percentage",
        value: "0"
      },
      subscriptionId: "STARTER_WEEK",
      limitations:  {
            businesses: 1,
            services: 5,
            blogs: 5,
            albums:5,
            products:10,
            orders:10,
            categories: 10
      }
    },
    {
      id: "PREMIUM_MONTHLY",
      name: "Premium Monthly",
      description:
        "Designed for growing businesses, this monthly plan provides extended resources and priority support for managing products and orders effectively.",
      price: "1500",
      currency: "INR",
      additionalInfo: [
        { Key: "No of Businesses", Value: "Up to 10" },
        { Key: "No of Services", Value: "Unlimited" },
        { Key: "Orders Per Month", Value: "Unlimited" },
        { Key: "Products Listed", Value: "Unlimited" },
        { Key: "Support", Value: "24/7 Email & Chat" },
        { Key: "Advanced Analytics", Value: "Included" },
        { Key: "Dedicated Account Manager", Value: "Included" },
        { Key: "Custom Integrations", Value: "Included" },
      ],
      type: "MONTH",
      discount:{
        type: "percentage",
        value: "0"
      },
      subscriptionId: "PREMIUM_MONTHLY",
      limitations:  {
            businesses: 5,
            services: 20,
            blogs: 20,
            albums: 10,
            products: 50,
            orders: 30,
            categories: 50
      }
    },
    {
      id: "ULTIMATE_PLAN",
      name: "Ultimate Plan",
      description:
        "A comprehensive plan for large enterprises offering maximum flexibility and resources, suited for high-volume business activities and extensive service offerings.",
      price: "5000",
      currency: "INR",
      additionalInfo: [
        { Key: "No of Businesses", Value: "Unlimited" },
        { Key: "No of Services", Value: "Unlimited" },
        { Key: "Orders Per Month", Value: "Unlimited" },
        { Key: "Products Listed", Value: "Unlimited" },
        { Key: "Dedicated Account Manager", Value: "Included" },
        { Key: "Support", Value: "24/7 Email & Chat" },
        { Key: "Custom Integrations", Value: "Included" },
        { Key: "Advanced Analytics", Value: "Included" },
      ],
      type: "YEAR",
      discount:{
        type: "percentage",
        value: "0"
      },
      subscriptionId: "ULTIMATE_PLAN",
      limitations:  {
            businesses: -1,
            services: -1,
            blogs: -1,
            albums: -1,
            products: -1,
            orders: -1,
            categories: -1
      }
    }
  ];