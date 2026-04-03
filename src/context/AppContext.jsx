import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Fake seed data ───────────────────────────────────────────────────────────
// //////////////////////////////////////
const FAKE_PRODUCTS = [
  // Pizzas
  {
    id: 1,
    name: "Margherita",
    description: "Cheese & tomato",
    price: 6.5,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 720,
    prep_time_mins: 15,
    sizes: { '9"': 6.5, '12"': 9.99, '16"': 13.99 },
    tag: "Classic",
    type: "pizza",
  },
  {
    id: 2,
    name: "Jini's Special",
    description:
      "Cajun chicken, chicken tikka, red onions, green peppers, pineapple & olives",
    price: 8.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "medium",
    calories: 850,
    prep_time_mins: 18,
    sizes: { '9"': 8.99, '12"': 12.99, '16"': 16.99 },
    tag: "Signature",
    type: "pizza",
  },
  {
    id: 3,
    name: "Meat Feast",
    description: "Pepperoni, beef, ham & salami",
    price: 7.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "medium",
    calories: 920,
    prep_time_mins: 15,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    tag: "Popular",
    type: "pizza",
  },
  {
    id: 4,
    name: "Balti Taste",
    description: "Chicken balti, green peppers, red onions & fresh coriander",
    price: 7.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "hot",
    calories: 780,
    prep_time_mins: 15,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    type: "pizza",
  },
  {
    id: 5,
    name: "All Spice",
    description:
      "Chicken, balti chicken, pepperoni, fresh coriander & red onions",
    price: 7.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "hot",
    calories: 810,
    prep_time_mins: 15,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    type: "pizza",
  },
  {
    id: 6,
    name: "Hot & Spicy",
    description:
      "Chicken tikka, beef, jalapeños, onions, green chillies & cherry tomatoes",
    price: 8.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "extra_hot",
    calories: 840,
    prep_time_mins: 15,
    sizes: { '9"': 8.99, '12"': 12.99, '16"': 16.99 },
    tag: "Spicy",
    type: "pizza",
  },
  {
    id: 7,
    name: "Cajun Special",
    description: "Cajun chicken, red onions, green peppers & cherry tomatoes",
    price: 8.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "medium",
    calories: 740,
    prep_time_mins: 15,
    sizes: { '9"': 8.99, '12"': 12.99, '16"': 16.99 },
    type: "pizza",
  },
  {
    id: 8,
    name: "Veggie Supreme",
    description:
      "Mushrooms, onions, green peppers, cherry tomatoes & green chillies",
    price: 7.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1571066811602-716837513681?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 650,
    prep_time_mins: 15,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    tag: "Vegetarian",
    type: "pizza",
  },
  {
    id: 9,
    name: "Seafood",
    description: "Tuna, prawns & anchovies",
    price: 7.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 760,
    prep_time_mins: 15,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    type: "pizza",
  },
  {
    id: 10,
    name: "Hawaiian",
    description: "Ham & pineapple",
    price: 7.99,
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 690,
    prep_time_mins: 15,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    tag: "Classic",
    type: "pizza",
  },

  // Burgers
  {
    id: 20,
    name: "Chicken Fillet Burger",
    description: "Crispy chicken fillet served with chips, salad & sauce",
    price: 6.49,
    category: "burgers",
    image_url:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 580,
    prep_time_mins: 10,
    tag: "Popular",
    type: "regular",
  },
  {
    id: 21,
    name: "Cheeseburger",
    description:
      "Juicy beef patty with cheese, served with chips, salad & sauce",
    price: 6.49,
    category: "burgers",
    image_url:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "mild",
    calories: 650,
    prep_time_mins: 10,
    type: "regular",
  },
  {
    id: 22,
    name: "Beef Burger",
    description: "Classic beef patty served with chips, salad & sauce",
    price: 5.99,
    category: "burgers",
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 600,
    prep_time_mins: 10,
    type: "regular",
  },
  {
    id: 23,
    name: "Kebab Burger",
    description:
      "Seasoned kebab meat in a bun, served with chips, salad & sauce",
    price: 6.49,
    category: "burgers",
    image_url:
      "https://images.unsplash.com/photo-1593718611219-5f73c5d9f9b8?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "medium",
    calories: 620,
    prep_time_mins: 10,
    type: "regular",
  },
  {
    id: 24,
    name: "Veggie Burger",
    description: "Plant-based patty served with chips, salad & sauce",
    price: 5.99,
    category: "burgers",
    image_url:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 520,
    prep_time_mins: 10,
    tag: "Vegetarian",
    type: "regular",
  },

  // Special Offers
  {
    id: 30,
    name: "Offer 1",
    description: '9" pizza (2 toppings), 1× fries & 1× can of drink',
    price: 10.99,
    category: "offers",
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "mild",
    calories: 950,
    prep_time_mins: 15,
    tag: "Best Value",
    type: "regular",
  },
  {
    id: 31,
    name: "Offer 2",
    description: '2× 9" pizzas (3 toppings each) & 2× fries',
    price: 17.99,
    category: "offers",
    image_url:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "mild",
    calories: 1850,
    prep_time_mins: 25,
    tag: "For Two",
    type: "regular",
  },
  {
    id: 32,
    name: "Offer 3",
    description: '12" pizza (3 toppings), 1× fries & 2× cans of drink',
    price: 17.49,
    category: "offers",
    image_url:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 1450,
    prep_time_mins: 20,
    tag: "Family",
    type: "regular",
  },
  {
    id: 33,
    name: "Offer 4",
    description:
      '2× 12" pizzas (3 toppings each), large fries & 1.5L bottle of drink',
    price: 29.99,
    category: "offers",
    image_url:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 2600,
    prep_time_mins: 30,
    tag: "Party Deal",
    type: "regular",
  },

  // Kebabs & Piri Piri
  {
    id: 40,
    name: "Lamb Donner Kebab",
    description: "Tender lamb donner served with salad & sauce",
    price: 7.49,
    category: "kebabs",
    image_url:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "medium",
    calories: 680,
    prep_time_mins: 10,
    tag: "Popular",
    type: "regular",
  },
  {
    id: 41,
    name: "Chicken Tikka Kebab",
    description: "Marinated chicken tikka served with salad & sauce",
    price: 7.99,
    category: "kebabs",
    image_url:
      "https://images.unsplash.com/photo-1599481238640-4c1288751e0b?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "hot",
    calories: 590,
    prep_time_mins: 10,
    type: "regular",
  },
  {
    id: 42,
    name: "Full Piri Piri Chicken",
    description: "Whole piri piri chicken served with salad, chips & sauce",
    price: 13.99,
    category: "kebabs",
    image_url:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "extra_hot",
    calories: 1120,
    prep_time_mins: 25,
    tag: "Signature",
    type: "regular",
  },
  {
    id: 43,
    name: "Half Piri Piri Chicken",
    description: "Half piri piri chicken served with salad, chips & sauce",
    price: 8.99,
    category: "kebabs",
    image_url:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "hot",
    calories: 760,
    prep_time_mins: 18,
    type: "regular",
  },

  // Sides
  {
    id: 50,
    name: "Fries",
    description: "Crispy golden fries",
    price: 2.9,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 380,
    prep_time_mins: 5,
    type: "regular",
  },
  {
    id: 51,
    name: "Potato Wedges",
    description: "Seasoned potato wedges",
    price: 3.99,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1630384060421-cf20c0f2a3fc?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 420,
    prep_time_mins: 7,
    tag: "Vegetarian",
    type: "regular",
  },
  {
    id: 52,
    name: "Chicken Wings (10 pcs)",
    description: "10 crispy chicken wings",
    price: 7.99,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "medium",
    calories: 680,
    prep_time_mins: 12,
    tag: "Popular",
    type: "regular",
  },
  {
    id: 53,
    name: "Onion Rings",
    description: "Crispy battered onion rings",
    price: 3.49,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 390,
    prep_time_mins: 5,
    tag: "Vegetarian",
    type: "regular",
  },
  {
    id: 54,
    name: "Garlic Bread",
    description: "Classic garlic bread",
    price: 3.49,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 280,
    prep_time_mins: 5,
    tag: "Vegetarian",
    type: "regular",
  },
  {
    id: 55,
    name: "Garlic Bread with Cheese",
    description: "Garlic bread topped with melted cheese",
    price: 4.49,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 380,
    prep_time_mins: 6,
    tag: "Vegetarian",
    type: "regular",
  },
  {
    id: 56,
    name: "Stuffed Garlic Bread",
    description: "Generously stuffed garlic bread with cheese & fillings",
    price: 5.99,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 480,
    prep_time_mins: 8,
    tag: "Popular",
    type: "regular",
  },
  {
    id: 57,
    name: "Rice",
    description: "Steamed basmati rice",
    price: 2.99,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 220,
    prep_time_mins: 10,
    tag: "Vegan",
    type: "regular",
  },
  {
    id: 58,
    name: "Naan Bread",
    description: "Freshly baked naan",
    price: 1.99,
    category: "sides",
    image_url:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 180,
    prep_time_mins: 5,
    tag: "Vegetarian",
    type: "regular",
  },

  // Drinks & Desserts
  {
    id: 60,
    name: "Can (330ml)",
    description: "Coca-Cola, Sprite, Fanta, Pepsi or 7-Up",
    price: 1.5,
    category: "drinks",
    image_url:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 150,
    prep_time_mins: 1,
    tag: "Vegan",
    type: "regular",
  },
  {
    id: 61,
    name: "Bottle (1.5L)",
    description: "Large bottle — choice of flavours",
    price: 3.5,
    category: "drinks",
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOD6zax4BN9V2GpMVPXS5kAjXadJzM5KgOPw&s",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 650,
    prep_time_mins: 1,
    tag: "Vegan",
    type: "regular",
  },
  {
    id: 62,
    name: "Chocolate Fudge Cake",
    description: "Rich, indulgent chocolate fudge cake",
    price: 3.99,
    category: "desserts",
    image_url:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    is_featured: true,
    is_available: true,
    spice_level: "mild",
    calories: 520,
    prep_time_mins: 2,
    tag: "Dessert",
    type: "regular",
  },
  {
    id: 63,
    name: "Cheesecake",
    description: "Classic creamy cheesecake",
    price: 3.99,
    category: "desserts",
    image_url:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
    is_featured: false,
    is_available: true,
    spice_level: "mild",
    calories: 480,
    prep_time_mins: 2,
    tag: "Dessert",
    type: "regular",
  },
];

const FAKE_CATEGORIES = [
  {
    id: "pizzas",
    name: "Pizzas",
    description: "Freshly baked stone-oven pizzas",
    icon_emoji: "🍕",
    image_url:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "burgers",
    name: "Burgers",
    description: "Juicy smash burgers & gourmet stacks",
    icon_emoji: "🍔",
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "offers",
    name: "Special Offers",
    description: "Limited time deals you can't miss",
    icon_emoji: "🎁",
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    badge: "Hot Deals",
  },
  {
    id: "kebabs",
    name: "Kebabs & Piri Piri",
    description: "Tasty kebabs and piri piri chicken",
    icon_emoji: "🥙",
    image_url:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    sort_order: 4,
    is_active: true,
  },
  {
    id: "sides",
    name: "Sides",
    description: "Fries, wings, onion rings and more",
    icon_emoji: "🍟",
    image_url:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    sort_order: 5,
    is_active: true,
  },
  {
    id: "drinks",
    name: "Drinks & Desserts",
    description: "Refreshing drinks & sweet treats",
    icon_emoji: "🥤",
    image_url:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
    sort_order: 6,
    is_active: true,
  },
];

// Updated FAKE_SUBCATEGORIES with CORRECT image URLs for all items

const FAKE_SUBCATEGORIES = [
  // ========== PIZZAS (All 10 pizzas with complete options) ==========
  {
    id: "sub1",
    category_id: "pizzas",
    name: "Margherita",
    description: "Cheese & tomato",
    base_price: 6.5,
    image_url:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
    tag: "Classic",
    sizes: { '9"': 6.5, '12"': 9.99, '16"': 13.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Anchovies", extra_price: 1.5 },
          { name: "Beef", extra_price: 2.0 },
          { name: "Cajun Chicken", extra_price: 2.0 },
          { name: "Cherry Tomatoes", extra_price: 1.0 },
          { name: "Ham", extra_price: 1.5 },
          { name: "Olives", extra_price: 1.0 },
          { name: "Chicken Balti", extra_price: 2.5 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
        ],
      },
    ],
  },
  {
    id: "sub2",
    category_id: "pizzas",
    name: "Jini's Special",
    description:
      "Cajun chicken, chicken tikka, red onions, green peppers, pineapple & olives",
    base_price: 8.99,
    image_url:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    sort_order: 2,
    is_active: true,
    tag: "Signature",
    sizes: { '9"': 8.99, '12"': 12.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Mushrooms", extra_price: 1.0 },
          { name: "Olives", extra_price: 1.0 },
          { name: "Extra Cajun Chicken", extra_price: 2.0 },
        ],
      },
    ],
  },
  {
    id: "sub3",
    category_id: "pizzas",
    name: "Meat Feast",
    description: "Pepperoni, beef, ham & salami",
    base_price: 7.99,
    image_url:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    tag: "Popular",
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Pepperoni", extra_price: 1.5 },
          { name: "Extra Beef", extra_price: 1.5 },
          { name: "Extra Ham", extra_price: 1.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Jalapeños", extra_price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "sub4",
    category_id: "pizzas",
    name: "Balti Taste",
    description: "Chicken balti, green peppers, red onions & fresh coriander",
    base_price: 7.99,
    image_url:
      "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400&h=300&fit=crop",
    sort_order: 4,
    is_active: true,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Chicken Balti", extra_price: 2.0 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Mushrooms", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub5",
    category_id: "pizzas",
    name: "All Spice",
    description:
      "Chicken, balti chicken, pepperoni, fresh coriander & red onions",
    base_price: 7.99,
    image_url:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    sort_order: 5,
    is_active: true,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Mushrooms", extra_price: 1.0 },
          { name: "Extra Chicken", extra_price: 2.0 },
        ],
      },
    ],
  },
  {
    id: "sub6",
    category_id: "pizzas",
    name: "Hot & Spicy",
    description:
      "Chicken tikka, beef, jalapeños, onions, green chillies & cherry tomatoes",
    base_price: 8.99,
    image_url:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop",
    sort_order: 6,
    is_active: true,
    tag: "Spicy",
    sizes: { '9"': 8.99, '12"': 12.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Jalapeños", extra_price: 0.5 },
          { name: "Extra Green Chillies", extra_price: 0.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Extra Chicken Tikka", extra_price: 2.0 },
        ],
      },
    ],
  },
  {
    id: "sub7",
    category_id: "pizzas",
    name: "Cajun Special",
    description: "Cajun chicken, red onions, green peppers & cherry tomatoes",
    base_price: 8.99,
    image_url:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
    sort_order: 7,
    is_active: true,
    sizes: { '9"': 8.99, '12"': 12.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Cajun Chicken", extra_price: 2.0 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Mushrooms", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub8",
    category_id: "pizzas",
    name: "Veggie Supreme",
    description:
      "Mushrooms, onions, green peppers, cherry tomatoes & green chillies",
    base_price: 7.99,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvKrvYyLC_eyksYv5xOegtAIjYj6NjHBm-Qg&s",
    sort_order: 8,
    is_active: true,
    tag: "Vegetarian",
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Mushrooms", extra_price: 1.0 },
          { name: "Olives", extra_price: 1.0 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Sweetcorn", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub9",
    category_id: "pizzas",
    name: "Seafood",
    description: "Tuna, prawns & anchovies",
    base_price: 7.99,
    image_url:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    sort_order: 9,
    is_active: true,
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Tuna", extra_price: 1.5 },
          { name: "Extra Prawns", extra_price: 2.0 },
          { name: "Extra Anchovies", extra_price: 1.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
        ],
      },
    ],
  },
  {
    id: "sub10",
    category_id: "pizzas",
    name: "Hawaiian",
    description: "Ham & pineapple",
    base_price: 7.99,
    image_url:
      "https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?w=400&h=300&fit=crop",
    sort_order: 10,
    is_active: true,
    tag: "Classic",
    sizes: { '9"': 7.99, '12"': 11.99, '16"': 16.99 },
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 2.0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 5,
        options: [
          { name: "Extra Ham", extra_price: 1.5 },
          { name: "Extra Pineapple", extra_price: 1.0 },
          { name: "Extra Cheese", extra_price: 1.5 },
          { name: "Jalapeños", extra_price: 0.5 },
        ],
      },
    ],
  },

  // ========== BURGERS (All 5 burgers with options) ==========
  {
    id: "sub11",
    category_id: "burgers",
    name: "Chicken Fillet Burger",
    description: "Crispy chicken fillet served with chips, salad & sauce",
    base_price: 6.49,
    image_url:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
    tag: "Popular",
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Mayo", extra_price: 0 },
          { name: "Ketchup", extra_price: 0 },
          { name: "BBQ", extra_price: 0 },
          { name: "Sriracha", extra_price: 0 },
          { name: "Garlic Sauce", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 4,
        options: [
          { name: "Extra Cheese", extra_price: 0.75 },
          { name: "Bacon", extra_price: 1.5 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Onion Rings", extra_price: 1.0 },
          { name: "Fried Egg", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub12",
    category_id: "burgers",
    name: "Cheeseburger",
    description:
      "Juicy beef patty with cheese, served with chips, salad & sauce",
    base_price: 6.49,
    image_url:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    sort_order: 2,
    is_active: true,
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Mayo", extra_price: 0 },
          { name: "Ketchup", extra_price: 0 },
          { name: "BBQ", extra_price: 0 },
          { name: "Mustard", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 4,
        options: [
          { name: "Bacon", extra_price: 1.5 },
          { name: "Avocado", extra_price: 1.0 },
          { name: "Fried Egg", extra_price: 1.0 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Extra Cheese", extra_price: 0.75 },
        ],
      },
    ],
  },
  {
    id: "sub13",
    category_id: "burgers",
    name: "Beef Burger",
    description: "Classic beef patty served with chips, salad & sauce",
    base_price: 5.99,
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Mayo", extra_price: 0 },
          { name: "Ketchup", extra_price: 0 },
          { name: "BBQ", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 4,
        options: [
          { name: "Cheese", extra_price: 0.75 },
          { name: "Bacon", extra_price: 1.5 },
          { name: "Fried Egg", extra_price: 1.0 },
          { name: "Jalapeños", extra_price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "sub14",
    category_id: "burgers",
    name: "Kebab Burger",
    description:
      "Seasoned kebab meat in a bun, served with chips, salad & sauce",
    base_price: 6.49,
    image_url:
      "https://hips.hearstapps.com/hmg-prod/images/persian-burgers-68964eb5144c6.png?crop=0.675xw:0.968xh;0.0748xw,0&resize=640:*",
    sort_order: 4,
    is_active: true,
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Garlic Sauce", extra_price: 0 },
          { name: "Chilli Sauce", extra_price: 0 },
          { name: "BBQ", extra_price: 0 },
          { name: "Mix Sauce", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 4,
        options: [
          { name: "Extra Kebab Meat", extra_price: 1.5 },
          { name: "Cheese", extra_price: 0.75 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Onion Rings", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub15",
    category_id: "burgers",
    name: "Veggie Burger",
    description: "Plant-based patty served with chips, salad & sauce",
    base_price: 5.99,
    image_url:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop",
    sort_order: 5,
    is_active: true,
    tag: "Vegetarian",
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Vegan Mayo", extra_price: 0 },
          { name: "Ketchup", extra_price: 0 },
          { name: "BBQ", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 4,
        options: [
          { name: "Avocado", extra_price: 1.0 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Onion Rings", extra_price: 1.0 },
          { name: "Vegan Cheese", extra_price: 0.75 },
        ],
      },
    ],
  },

  // ========== SPECIAL OFFERS (All 4 offers - no extra options needed) ==========
  {
    id: "sub16",
    category_id: "offers",
    name: "Offer 1",
    description: '9" pizza (2 toppings), 1× fries & 1× can of drink',
    base_price: 10.99,
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
    tag: "Best Value",
  },
  {
    id: "sub17",
    category_id: "offers",
    name: "Offer 2",
    description: '2× 9" pizzas (3 toppings each) & 2× fries',
    base_price: 17.99,
    image_url:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop",
    sort_order: 2,
    is_active: true,
    tag: "For Two",
  },
  {
    id: "sub18",
    category_id: "offers",
    name: "Offer 3",
    description: '12" pizza (3 toppings), 1× fries & 2× cans of drink',
    base_price: 17.49,
    image_url:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    tag: "Family",
  },
  {
    id: "sub19",
    category_id: "offers",
    name: "Offer 4",
    description:
      '2× 12" pizzas (3 toppings each), large fries & 1.5L bottle of drink',
    base_price: 29.99,
    image_url:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=300&fit=crop",
    sort_order: 4,
    is_active: true,
    tag: "Party Deal",
  },

  // ========== KEBABS & PIRI PIRI (All 4 items with options) ==========
  {
    id: "sub20",
    category_id: "kebabs",
    name: "Lamb Donner Kebab",
    description: "Tender lamb donner served with salad & sauce",
    base_price: 7.49,
    image_url:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
    tag: "Popular",
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Garlic Sauce", extra_price: 0 },
          { name: "Chilli Sauce", extra_price: 0 },
          { name: "Mix", extra_price: 0 },
          { name: "BBQ", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 3,
        options: [
          { name: "Extra Meat", extra_price: 2.0 },
          { name: "Cheese", extra_price: 0.75 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Extra Salad", extra_price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "sub21",
    category_id: "kebabs",
    name: "Chicken Tikka Kebab",
    description: "Marinated chicken tikka served with salad & sauce",
    base_price: 7.99,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYvvTwgNamD4TDBp4EYolAnlxmRjbCJcf1JA&s",
    sort_order: 2,
    is_active: true,
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Garlic Sauce", extra_price: 0 },
          { name: "Chilli Sauce", extra_price: 0 },
          { name: "Mint Yogurt", extra_price: 0 },
          { name: "Mix", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 3,
        options: [
          { name: "Extra Chicken Tikka", extra_price: 2.0 },
          { name: "Cheese", extra_price: 0.75 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Onions", extra_price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "sub22",
    category_id: "kebabs",
    name: "Full Piri Piri Chicken",
    description: "Whole piri piri chicken served with salad, chips & sauce",
    base_price: 13.99,
    image_url:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    tag: "Signature",
    base_options: [
      {
        group_name: "Spice Level",
        required: true,
        select_type: "single",
        options: [
          { name: "Mild", extra_price: 0 },
          { name: "Medium", extra_price: 0 },
          { name: "Hot", extra_price: 0 },
          { name: "Extra Hot", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 3,
        options: [
          { name: "Extra Chips", extra_price: 2.0 },
          { name: "Extra Sauce", extra_price: 0.5 },
          { name: "Coleslaw", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub23",
    category_id: "kebabs",
    name: "Half Piri Piri Chicken",
    description: "Half piri piri chicken served with salad, chips & sauce",
    base_price: 8.99,
    image_url:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
    sort_order: 4,
    is_active: true,
    base_options: [
      {
        group_name: "Spice Level",
        required: true,
        select_type: "single",
        options: [
          { name: "Mild", extra_price: 0 },
          { name: "Medium", extra_price: 0 },
          { name: "Hot", extra_price: 0 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extras",
        max_selections: 3,
        options: [
          { name: "Extra Chips", extra_price: 2.0 },
          { name: "Extra Sauce", extra_price: 0.5 },
        ],
      },
    ],
  },

  // ========== SIDES (All 9 sides - some with options) ==========
  {
    id: "sub24",
    category_id: "sides",
    name: "Fries",
    description: "Crispy golden fries",
    base_price: 2.9,
    image_url:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "sub25",
    category_id: "sides",
    name: "Potato Wedges",
    description: "Seasoned potato wedges",
    base_price: 3.99,
    image_url:
      "https://www.recipetineats.com/tachyon/2015/05/Seasoned-Baked-Potato-Wedges_7.jpg?resize=500%2C375",
    sort_order: 2,
    is_active: true,
    tag: "Vegetarian",
  },
  {
    id: "sub26",
    category_id: "sides",
    name: "Chicken Wings (10 pcs)",
    description: "10 crispy chicken wings",
    base_price: 7.99,
    image_url:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    tag: "Popular",
    base_options: [
      {
        group_name: "Sauce",
        required: true,
        select_type: "single",
        options: [
          { name: "Plain", extra_price: 0 },
          { name: "Buffalo", extra_price: 0 },
          { name: "BBQ", extra_price: 0 },
          { name: "Piri Piri", extra_price: 0 },
          { name: "Garlic", extra_price: 0 },
        ],
      },
    ],
  },
  {
    id: "sub27",
    category_id: "sides",
    name: "Onion Rings",
    description: "Crispy battered onion rings",
    base_price: 3.49,
    image_url:
      "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
    sort_order: 4,
    is_active: true,
    tag: "Vegetarian",
  },
  {
    id: "sub28",
    category_id: "sides",
    name: "Garlic Bread",
    description: "Classic garlic bread",
    base_price: 3.49,
    image_url:
      "https://www.allrecipes.com/thmb/sueXmRXgK-S27uRzTrJuGb-_Smc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/216077-garlic-bread-spread-step-beauty-4x3-BP-3169-ef03a4a12d8c46e196055555be5b8d79.jpg",
    sort_order: 5,
    is_active: true,
    tag: "Vegetarian",
  },
  {
    id: "sub29",
    category_id: "sides",
    name: "Garlic Bread with Cheese",
    description: "Garlic bread topped with melted cheese",
    base_price: 4.49,
    image_url:
      "https://homecookedharvest.com/wp-content/uploads/2022/06/Stuffed-Garlic-Bread-G.jpg",
    sort_order: 6,
    is_active: true,
    tag: "Vegetarian",
  },
  {
    id: "sub30",
    category_id: "sides",
    name: "Stuffed Garlic Bread",
    description: "Generously stuffed garlic bread with cheese & fillings",
    base_price: 5.99,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH4MvAVT1dHmWeYLWbi2Dld8sAEnsa36LgIA&s",
    sort_order: 7,
    is_active: true,
    tag: "Popular",
    base_options: [
      {
        group_name: "Filling",
        required: true,
        select_type: "single",
        options: [
          { name: "Cheese Only", extra_price: 0 },
          { name: "Cheese & Chicken", extra_price: 2.0 },
          { name: "Cheese & Beef", extra_price: 2.0 },
          { name: "Cheese & Veggie", extra_price: 1.5 },
        ],
      },
    ],
  },
  {
    id: "sub31",
    category_id: "sides",
    name: "Rice",
    description: "Steamed basmati rice",
    base_price: 2.99,
    image_url: "https://media.soscuisine.com/images/recettes/large/2887.jpg",
    sort_order: 8,
    is_active: true,
    tag: "Vegan",
  },
  {
    id: "sub32",
    category_id: "sides",
    name: "Naan Bread",
    description: "Freshly baked naan",
    base_price: 1.99,
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4HRSP2dLR0NLXYaezeLM9UW2wErZ6fFL5Zg&s",
    sort_order: 9,
    is_active: true,
    tag: "Vegetarian",
    base_options: [
      {
        group_name: "Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Plain Naan", extra_price: 0 },
          { name: "Garlic Naan", extra_price: 0.5 },
          { name: "Cheese Naan", extra_price: 1.0 },
          { name: "Peshawari Naan", extra_price: 1.0 },
        ],
      },
    ],
  },

  // ========== DRINKS & DESSERTS (All 4 items with options) ==========
  {
    id: "sub33",
    category_id: "drinks",
    name: "Can (330ml)",
    description: "Coca-Cola, Sprite, Fanta, Pepsi or 7-Up",
    base_price: 1.5,
    image_url:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
    tag: "Vegan",
    base_options: [
      {
        group_name: "Flavour",
        required: true,
        select_type: "single",
        options: [
          { name: "Coca-Cola", extra_price: 0 },
          { name: "Sprite", extra_price: 0 },
          { name: "Fanta Orange", extra_price: 0 },
          { name: "Pepsi", extra_price: 0 },
          { name: "7-Up", extra_price: 0 },
        ],
      },
    ],
  },
  {
    id: "sub34",
    category_id: "drinks",
    name: "Bottle (1.5L)",
    description: "Large bottle — choice of flavours",
    base_price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
    sort_order: 2,
    is_active: true,
    tag: "Vegan",
    base_options: [
      {
        group_name: "Flavour",
        required: true,
        select_type: "single",
        options: [
          { name: "Coca-Cola", extra_price: 0 },
          { name: "Sprite", extra_price: 0 },
          { name: "Fanta Orange", extra_price: 0 },
          { name: "Pepsi", extra_price: 0 },
          { name: "Fruit Juice", extra_price: 0 },
        ],
      },
    ],
  },
  {
    id: "sub35",
    category_id: "drinks",
    name: "Chocolate Fudge Cake",
    description: "Rich, indulgent chocolate fudge cake",
    base_price: 3.99,
    image_url:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    tag: "Dessert",
    base_options: [
      {
        group_name: "With Ice Cream",
        required: false,
        select_type: "single",
        options: [
          { name: "Without Ice Cream", extra_price: 0 },
          { name: "With Vanilla Ice Cream", extra_price: 1.0 },
          { name: "With Chocolate Ice Cream", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub36",
    category_id: "drinks",
    name: "Cheesecake",
    description: "Classic creamy cheesecake",
    base_price: 3.99,
    image_url:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
    sort_order: 4,
    is_active: true,
    tag: "Dessert",
  },
];


const FAKE_STORE_SETTINGS = {
  store_name: 'BlazeBites',
  delivery_enabled: true,
  delivery_open_time_ms: 39600000,
  delivery_close_time_ms: 79200000,
  pickup_enabled: true,
  pickup_open_time_ms: 36000000,
  pickup_close_time_ms: 82800000,
  delivery_min_order: 10,
  delivery_fee: 3.99,
  delivery_free_threshold: 25,
  estimated_delivery_mins: 35,
  estimated_pickup_mins: 15,
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_user')) || null; } catch { return null; }
  });

  // Data state (fake, in-memory + localStorage)
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_cart')) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_wishlist')) || []; } catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_orders')) || []; } catch { return []; }
  });
  const [products, setProducts] = useState(FAKE_PRODUCTS);
  const [categories, setCategories] = useState(FAKE_CATEGORIES);
  const [subCategories, setSubCategories] = useState(FAKE_SUBCATEGORIES);
  const [storeSettings, setStoreSettings] = useState(FAKE_STORE_SETTINGS);
  const [groupOrders, setGroupOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_groups')) || []; } catch { return []; }
  });
  const [rewards, setRewards] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_rewards')) || { points: 0, history: [] }; } catch { return { points: 0, history: [] }; }
  });
  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bb_reviews')) || []; } catch { return []; }
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('bb_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('bb_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('bb_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { if (currentUser) localStorage.setItem('bb_user', JSON.stringify(currentUser)); else localStorage.removeItem('bb_user'); }, [currentUser]);
  useEffect(() => { localStorage.setItem('bb_groups', JSON.stringify(groupOrders)); }, [groupOrders]);
  useEffect(() => { localStorage.setItem('bb_rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem('bb_reviews', JSON.stringify(reviews)); }, [reviews]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = (email, password) => {
    // Fake auth — admin if email contains 'admin'
    const user = { id: 'u1', email, name: email.split('@')[0], role: email.includes('admin') ? 'admin' : 'user' };
    setCurrentUser(user);
    return user;
  };
  const signup = (name, email, password) => {
    const user = { id: 'u' + Date.now(), email, name, role: 'user' };
    setCurrentUser(user);
    return user;
  };
  const logout = () => { setCurrentUser(null); setCart([]); setWishlist([]); };

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) return prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { id: 'ci' + Date.now(), product_id: product.id, product_name: product.name, product_image: product.image_url, price: product.price, quantity: qty }];
    });
  };
  const addCustomToCart = (item) => {
    setCart(prev => [...prev, { id: 'ci' + Date.now(), ...item }]);
  };
  const updateCartQty = (id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  // ── Wishlist ───────────────────────────────────────────────────────────────
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.product_id === product.id);
      if (exists) return prev.filter(w => w.product_id !== product.id);
      return [...prev, { id: 'wi' + Date.now(), product_id: product.id, product_name: product.name, product_image: product.image_url, price: product.price, category: product.category }];
    });
  };
  const isWishlisted = (productId) => wishlist.some(w => w.product_id === productId);

  // ── Orders ─────────────────────────────────────────────────────────────────
  const placeOrder = (orderData) => {
    const newOrder = { id: 'ord' + Date.now(), created_date: new Date().toISOString(), status: 'pending', ...orderData };
    setOrders(prev => [newOrder, ...prev]);
    // Earn points: 1 pt per $1 spent (rounded)
    const earnedPts = Math.floor(orderData.total || 0);
    if (earnedPts > 0) {
      setRewards(prev => ({
        points: prev.points + earnedPts,
        history: [{ label: `Order #${newOrder.id.slice(-6)}`, pts: earnedPts, date: new Date().toLocaleDateString() }, ...prev.history],
      }));
    }
    clearCart();
    return newOrder;
  };
  const updateOrderStatus = (orderId, status) => setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

  // ── Products (admin) ───────────────────────────────────────────────────────
  const createProduct = (data) => { const p = { ...data, id: 'p' + Date.now() }; setProducts(prev => [...prev, p]); return p; };
  const updateProduct = (id, data) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  // ── Categories (admin) ─────────────────────────────────────────────────────
  const createCategory = (data) => { const c = { ...data, id: 'cat' + Date.now() }; setCategories(prev => [...prev, c]); return c; };
  const updateCategory = (id, data) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));

  // ── SubCategories (admin) ──────────────────────────────────────────────────
  const createSubCategory = (data) => { const s = { ...data, id: 'sub' + Date.now() }; setSubCategories(prev => [...prev, s]); return s; };
  const updateSubCategory = (id, data) => setSubCategories(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const deleteSubCategory = (id) => setSubCategories(prev => prev.filter(s => s.id !== id));

  // ── Store settings (admin) ─────────────────────────────────────────────────
  const saveStoreSettings = (data) => setStoreSettings(data);

  // ── Group orders ───────────────────────────────────────────────────────────
  const createGroupOrder = (data) => { const g = { ...data, id: 'grp' + Date.now(), created_date: new Date().toISOString() }; setGroupOrders(prev => [g, ...prev]); return g; };
  const updateGroupOrder = (id, data) => { let updated; setGroupOrders(prev => prev.map(g => { if (g.id === id) { updated = { ...g, ...data }; return updated; } return g; })); return updated; };
  const findGroupByCode = (code) => groupOrders.find(g => g.share_code === code.toUpperCase());

  // ── Rewards ────────────────────────────────────────────────────────────────
  const redeemReward = (reward) => {
    if (rewards.points < reward.points) return;
    setRewards(prev => ({
      points: prev.points - reward.points,
      history: [{ label: `Redeemed: ${reward.name}`, pts: -reward.points, date: new Date().toLocaleDateString() }, ...prev.history],
    }));
  };
  const applyRewardDiscount = (discountAmt) => {
    // Called from checkout when redeeming points for discount
  };

  // ── Reviews ────────────────────────────────────────────────────────────────
  const addReview = (reviewData) => {
    setReviews(prev => [{ id: 'rev' + Date.now(), ...reviewData }, ...prev]);
  };
  const getProductRating = (productId) => {
    const pReviews = reviews.filter(r => r.product_id === productId);
    if (pReviews.length === 0) return null;
    return { avg: pReviews.reduce((s, r) => s + r.rating, 0) / pReviews.length, count: pReviews.length };
  };

  const cartCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <AppContext.Provider value={{
      // Auth
      currentUser, login, signup, logout,
      // Cart
      cart, cartCount, addToCart, addCustomToCart, updateCartQty, removeFromCart, clearCart,
      // Wishlist
      wishlist, toggleWishlist, isWishlisted,
      // Orders
      orders, placeOrder, updateOrderStatus,
      // Data
      products, categories, subCategories, storeSettings,
      // Admin
      createProduct, updateProduct, deleteProduct,
      createCategory, updateCategory, deleteCategory,
      createSubCategory, updateSubCategory, deleteSubCategory,
      saveStoreSettings,
      // Group
      groupOrders, createGroupOrder, updateGroupOrder, findGroupByCode,
      // Rewards
      rewards, redeemReward,
      // Reviews
      reviews, addReview, getProductRating,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};