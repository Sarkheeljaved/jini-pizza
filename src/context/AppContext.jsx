import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Fake seed data ───────────────────────────────────────────────────────────

const FAKE_PRODUCTS = [
  // 🍕 PIZZAS
  {
    id: "p1",
    name: "Margherita",
    description: 'Cheese & tomato (9", 12", 16")',
    price: 9.99,
    sizes: {
      small: 6.5,
      medium: 9.99,
      large: 13.99,
    },
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    is_featured: true,
    is_available: true,
    spice_level: "mild",
    prep_time_mins: 12,
  },
  {
    id: "p2",
    name: "Jini's Special",
    description:
      "Cajun chicken, chicken tikka, onions, peppers, pineapple & olives",
    price: 12.99,
    sizes: {
      small: 8.99,
      medium: 12.99,
      large: 16.99,
    },
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    is_featured: true,
    is_available: true,
    spice_level: "medium",
    prep_time_mins: 15,
  },
  {
    id: "p3",
    name: "Meat Feast",
    description: "Pepperoni, beef, ham & salami",
    price: 11.99,
    sizes: {
      small: 7.99,
      medium: 11.99,
      large: 16.99,
    },
    category: "pizzas",
    image_url:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
    is_featured: false,
    is_available: true,
    spice_level: "medium",
  },

  // 🍔 BURGERS
  {
    id: "p4",
    name: "Chicken Fillet Burger",
    description: "Served with chips, salad & sauce",
    price: 6.49,
    category: "burgers",
    image_url:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
    is_featured: true,
    is_available: true,
  },
  {
    id: "p5",
    name: "Cheeseburger",
    description: "Served with chips, salad & sauce",
    price: 6.49,
    category: "burgers",
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    is_featured: false,
    is_available: true,
  },
  {
    id: "p6",
    name: "Beef Burger",
    description: "Served with chips, salad & sauce",
    price: 5.99,
    category: "burgers",
    is_available: true,
  },

  // 🎉 SPECIAL OFFERS
  {
    id: "p7",
    name: "Offer 1",
    description: '9" pizza (2 toppings) + fries + drink',
    price: 10.99,
    category: "combos",
    is_featured: true,
  },
  {
    id: "p8",
    name: "Offer 2",
    description: '2x 9" pizzas (3 toppings) + 2 fries',
    price: 17.99,
    category: "combos",
  },
  {
    id: "p9",
    name: "Offer 3",
    description: '12" pizza + fries + 2 drinks',
    price: 17.49,
    category: "combos",
  },
  {
    id: "p10",
    name: "Offer 4",
    description: '2x 12" pizzas + large fries + 1.5L drink',
    price: 29.99,
    category: "combos",
  },

  // 🍢 KEBABS & PIRI PIRI
  {
    id: "p11",
    name: "Lamb Donner Kebab",
    description: "Served with salad & sauce",
    price: 7.49,
    category: "kebabs",
  },
  {
    id: "p12",
    name: "Chicken Tikka Kebab",
    description: "Served with salad & sauce",
    price: 7.99,
    category: "kebabs",
  },
  {
    id: "p13",
    name: "Full Piri Piri Chicken",
    description: "With chips, salad & sauce",
    price: 13.99,
    category: "kebabs",
  },

  // 🍟 SIDES
  {
    id: "p14",
    name: "Fries",
    price: 2.9,
    category: "sides",
  },
  {
    id: "p15",
    name: "Potato Wedges",
    price: 3.99,
    category: "sides",
  },
  {
    id: "p16",
    name: "Chicken Wings (10pcs)",
    price: 7.99,
    category: "sides",
  },
  {
    id: "p17",
    name: "Garlic Bread",
    description: "Plain / Cheese / Stuffed",
    price: 3.49,
    category: "sides",
  },

  // 🥤 DRINKS
  {
    id: "p18",
    name: "Soft Drink Can (330ml)",
    description: "Coca-Cola, Sprite, Fanta, Pepsi, 7up",
    price: 1.5,
    category: "drinks",
  },
  {
    id: "p19",
    name: "1.5L Bottle",
    price: 3.5,
    category: "drinks",
  },

  // 🍰 DESSERTS
  {
    id: "p20",
    name: "Chocolate Fudge Cake",
    price: 4.99,
    category: "desserts",
  },
  {
    id: "p21",
    name: "Cheesecake",
    price: 4.99,
    category: "desserts",
  },
];

const FAKE_CATEGORIES = [
  {
    id: "cat1",
    name: "Pizzas",
    description: '(Available in 9", 12", and 16")*',
    icon_emoji: "🍕",
    image_url:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "cat2",
    name: "Burgers",
    description: "Juicy smash burgers & gourmet stacks",
    icon_emoji: "🍔",
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "cat3",
    name: "Special Offers",
    description: "Limited time deals you can't miss",
    icon_emoji: "🎉",
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
    badge: "Hot Deals",
  },
  {
    id: "cat4",
    name: "Sides & Snacks",
    description: "Fries, wings, onion rings and more",
    icon_emoji: "🍟",
    image_url:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    sort_order: 4,
    is_active: true,
  },
  {
    id: "cat5",
    name: "Drinks",
    description: "Refreshing cold drinks & shakes",
    icon_emoji: "🥤",
    image_url:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
    sort_order: 5,
    is_active: true,
  },
  {
    id: "cat6",
    name: "Desserts",
    description: "Sweet treats to end your meal",
    icon_emoji: "🎂",
    image_url:
      "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
    sort_order: 6,
    is_active: true,
  },
];

const FAKE_SUBCATEGORIES = [
  {
    id: "sub1",
    category_id: "cat1",
    name: "Jini's Special",
    description:
      "Cajun chicken, chicken tikka, red onions, green peppers, pineapple & olives. (£8.99 | £12.99 | £16.99)",
    base_price: 13.99,
    image_url:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
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
    category_id: "cat1",
    name: "Margherita 9 inch",
    description: "Served with mozzarella, tomato sauce and fresh basil",
    base_price: 8.99,
    image_url:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
    sort_order: 2,
    is_active: true,
    base_options: [
      {
        group_name: "Crust Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Deep Pan", extra_price: 0 },
          { name: "Thin Crust", extra_price: 0 },
          { name: "Stuffed Crust", extra_price: 1.5 },
        ],
      },
    ],
    topping_groups: [
      {
        group_name: "Extra Toppings",
        max_selections: 4,
        options: [
          { name: "Anchovies", extra_price: 1.0 },
          { name: "Beef", extra_price: 1.5 },
          { name: "Cherry Tomatoes", extra_price: 0.75 },
          { name: "Ham", extra_price: 1.0 },
          { name: "Olives", extra_price: 0.75 },
          { name: "Extra Cheese", extra_price: 1.0 },
        ],
      },
    ],
  },
  {
    id: "sub3",
    category_id: "cat1",
    name: "Pepperoni 16 inch",
    description: "Loaded with pepperoni, mozzarella and oregano",
    base_price: 15.99,
    image_url:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    sort_order: 3,
    is_active: true,
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
          { name: "Extra Beef", extra_price: 2.0 },
          { name: "Cherry Tomatoes", extra_price: 1.0 },
          { name: "Ham", extra_price: 1.5 },
          { name: "Jalapeños", extra_price: 0.5 },
          { name: "Extra Cheese", extra_price: 1.5 },
        ],
      },
    ],
  },
  {
    id: "sub4",
    category_id: "cat2",
    name: "Classic Smash Burger",
    description: "Double patty, melted cheddar, pickles, secret sauce",
    base_price: 9.99,
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    sort_order: 1,
    is_active: true,
    base_options: [
      {
        group_name: "Patty Type",
        required: true,
        select_type: "single",
        options: [
          { name: "Beef", extra_price: 0 },
          { name: "Chicken", extra_price: 0 },
          { name: "Veggie", extra_price: 0 },
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
          { name: "Avocado", extra_price: 1.0 },
          { name: "Fried Egg", extra_price: 1.0 },
          { name: "Jalapeños", extra_price: 0.5 },
        ],
      },
    ],
  },
];

// const FAKE_PRODUCTS = [
//   { id: 'p1', name: 'Classic Smash Burger', description: 'Double patty, melted cheddar, pickles, secret sauce on a brioche bun', price: 9.99, category: 'burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', is_featured: true, is_available: true, spice_level: 'mild', calories: 650, prep_time_mins: 8 },
//   { id: 'p2', name: 'Spicy Chicken Burger', description: 'Crispy chicken fillet, jalapeños, sriracha mayo, coleslaw', price: 10.49, category: 'burgers', image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop', is_featured: false, is_available: true, spice_level: 'hot', calories: 580, prep_time_mins: 10 },
//   { id: 'p3', name: 'BBQ Bacon Burger', description: 'Angus beef, crispy bacon, smoky BBQ sauce, onion rings', price: 12.99, category: 'burgers', image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop', is_featured: true, is_available: true, spice_level: 'medium', calories: 820, prep_time_mins: 12 },
//   { id: 'p4', name: 'Margherita Pizza', description: 'Fresh mozzarella, tomato sauce, basil on thin crust', price: 11.99, category: 'pizzas', image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', is_featured: false, is_available: true, spice_level: 'mild', calories: 720, prep_time_mins: 15 },
//   { id: 'p5', name: 'Pepperoni Pizza', description: 'Loaded pepperoni, mozzarella, oregano, classic tomato base', price: 13.49, category: 'pizzas', image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', is_featured: true, is_available: true, spice_level: 'medium', calories: 860, prep_time_mins: 15 },
//   { id: 'p6', name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce, bacon bits, and chives', price: 5.99, category: 'sides', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', is_featured: false, is_available: true, calories: 450, prep_time_mins: 5 },
//   { id: 'p7', name: 'Chicken Wings (8pc)', description: 'Crispy wings tossed in buffalo sauce, with blue cheese dip', price: 8.99, category: 'sides', image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop', is_featured: true, is_available: true, spice_level: 'extra_hot', calories: 680, prep_time_mins: 12 },
//   { id: 'p8', name: 'Strawberry Milkshake', description: 'Thick creamy milkshake with real strawberries and whipped cream', price: 5.49, category: 'drinks', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', is_featured: true, is_available: true, calories: 420, prep_time_mins: 3 },
//   { id: 'p9', name: 'Coca Cola', description: 'Ice-cold classic Coca Cola, 500ml', price: 2.49, category: 'drinks', image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop', is_featured: false, is_available: true, calories: 200, prep_time_mins: 1 },
//   { id: 'p10', name: 'Chocolate Brownie', description: 'Warm fudge brownie with vanilla ice cream and chocolate sauce', price: 6.99, category: 'desserts', image_url: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop', is_featured: false, is_available: true, calories: 520, prep_time_mins: 5 },
//   { id: 'p11', name: 'Burger Combo', description: 'Classic Smash Burger + Loaded Fries + Drink — save $3!', price: 15.49, category: 'combos', image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop', is_featured: true, is_available: true, spice_level: 'mild', calories: 1100, prep_time_mins: 10 },
//   { id: 'p12', name: 'Onion Rings', description: 'Beer-battered crispy onion rings with ranch dip', price: 4.99, category: 'sides', image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop', is_featured: false, is_available: true, calories: 380, prep_time_mins: 5 },
// ];
//
// const FAKE_CATEGORIES = [
//   { id: 'cat1', name: 'Pizzas', description: 'Freshly baked stone-oven pizzas', icon_emoji: '🍕', image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', sort_order: 1, is_active: true },
//   { id: 'cat2', name: 'Burgers', description: 'Juicy smash burgers & gourmet stacks', icon_emoji: '🍔', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', sort_order: 2, is_active: true },
//   { id: 'cat3', name: 'Special Offers', description: 'Limited time deals you can\'t miss', icon_emoji: '🎉', image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop', sort_order: 3, is_active: true, badge: 'Hot Deals' },
//   { id: 'cat4', name: 'Sides & Snacks', description: 'Fries, wings, onion rings and more', icon_emoji: '🍟', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', sort_order: 4, is_active: true },
//   { id: 'cat5', name: 'Drinks', description: 'Refreshing cold drinks & shakes', icon_emoji: '🥤', image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop', sort_order: 5, is_active: true },
//   { id: 'cat6', name: 'Desserts', description: 'Sweet treats to end your meal', icon_emoji: '🎂', image_url: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop', sort_order: 6, is_active: true },
// ];
//
// const FAKE_SUBCATEGORIES = [
//   { id: 'sub1', category_id: 'cat1', name: 'Margherita 16 inch', description: 'Served with mozzarella, tomato sauce and fresh basil', base_price: 13.99, image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', sort_order: 1, is_active: true, base_options: [{ group_name: 'Crust Type', required: true, select_type: 'single', options: [{ name: 'Deep Pan', extra_price: 0 }, { name: 'Thin Crust', extra_price: 0 }, { name: 'Stuffed Crust', extra_price: 2.0 }] }], topping_groups: [{ group_name: 'Extra Toppings', max_selections: 5, options: [{ name: 'Anchovies', extra_price: 1.5 }, { name: 'Beef', extra_price: 2.0 }, { name: 'Cajun Chicken', extra_price: 2.0 }, { name: 'Cherry Tomatoes', extra_price: 1.0 }, { name: 'Ham', extra_price: 1.5 }, { name: 'Olives', extra_price: 1.0 }, { name: 'Chicken Balti', extra_price: 2.5 }, { name: 'Jalapeños', extra_price: 0.5 }, { name: 'Extra Cheese', extra_price: 1.5 }] }] },
//   { id: 'sub2', category_id: 'cat1', name: 'Margherita 9 inch', description: 'Served with mozzarella, tomato sauce and fresh basil', base_price: 8.99, image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', sort_order: 2, is_active: true, base_options: [{ group_name: 'Crust Type', required: true, select_type: 'single', options: [{ name: 'Deep Pan', extra_price: 0 }, { name: 'Thin Crust', extra_price: 0 }, { name: 'Stuffed Crust', extra_price: 1.5 }] }], topping_groups: [{ group_name: 'Extra Toppings', max_selections: 4, options: [{ name: 'Anchovies', extra_price: 1.0 }, { name: 'Beef', extra_price: 1.5 }, { name: 'Cherry Tomatoes', extra_price: 0.75 }, { name: 'Ham', extra_price: 1.0 }, { name: 'Olives', extra_price: 0.75 }, { name: 'Extra Cheese', extra_price: 1.0 }] }] },
//   { id: 'sub3', category_id: 'cat1', name: 'Pepperoni 16 inch', description: 'Loaded with pepperoni, mozzarella and oregano', base_price: 15.99, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', sort_order: 3, is_active: true, base_options: [{ group_name: 'Crust Type', required: true, select_type: 'single', options: [{ name: 'Deep Pan', extra_price: 0 }, { name: 'Thin Crust', extra_price: 0 }, { name: 'Stuffed Crust', extra_price: 2.0 }] }], topping_groups: [{ group_name: 'Extra Toppings', max_selections: 5, options: [{ name: 'Anchovies', extra_price: 1.5 }, { name: 'Extra Beef', extra_price: 2.0 }, { name: 'Cherry Tomatoes', extra_price: 1.0 }, { name: 'Ham', extra_price: 1.5 }, { name: 'Jalapeños', extra_price: 0.5 }, { name: 'Extra Cheese', extra_price: 1.5 }] }] },
//   { id: 'sub4', category_id: 'cat2', name: 'Classic Smash Burger', description: 'Double patty, melted cheddar, pickles, secret sauce', base_price: 9.99, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', sort_order: 1, is_active: true, base_options: [{ group_name: 'Patty Type', required: true, select_type: 'single', options: [{ name: 'Beef', extra_price: 0 }, { name: 'Chicken', extra_price: 0 }, { name: 'Veggie', extra_price: 0 }] }], topping_groups: [{ group_name: 'Extras', max_selections: 4, options: [{ name: 'Extra Cheese', extra_price: 0.75 }, { name: 'Bacon', extra_price: 1.5 }, { name: 'Avocado', extra_price: 1.0 }, { name: 'Fried Egg', extra_price: 1.0 }, { name: 'Jalapeños', extra_price: 0.5 }] }] },
// ];

const FAKE_STORE_SETTINGS = {
  store_name: "JiniPizza",
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
    try {
      return JSON.parse(localStorage.getItem("bb_user")) || null;
    } catch {
      return null;
    }
  });

  // Data state (fake, in-memory + localStorage)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bb_cart")) || [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bb_wishlist")) || [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bb_orders")) || [];
    } catch {
      return [];
    }
  });
  const [products, setProducts] = useState(FAKE_PRODUCTS);
  const [categories, setCategories] = useState(FAKE_CATEGORIES);
  const [subCategories, setSubCategories] = useState(FAKE_SUBCATEGORIES);
  const [storeSettings, setStoreSettings] = useState(FAKE_STORE_SETTINGS);
  const [groupOrders, setGroupOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bb_groups")) || [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("bb_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("bb_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem("bb_orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    if (currentUser)
      localStorage.setItem("bb_user", JSON.stringify(currentUser));
    else localStorage.removeItem("bb_user");
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem("bb_groups", JSON.stringify(groupOrders));
  }, [groupOrders]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = (email, password) => {
    // Fake auth — admin if email contains 'admin'
    const user = {
      id: "u1",
      email,
      name: email.split("@")[0],
      role: email.includes("admin") ? "admin" : "user",
    };
    setCurrentUser(user);
    return user;
  };
  const signup = (name, email, password) => {
    const user = { id: "u" + Date.now(), email, name, role: "user" };
    setCurrentUser(user);
    return user;
  };
  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
  };

  // ── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing)
        return prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      return [
        ...prev,
        {
          id: "ci" + Date.now(),
          product_id: product.id,
          product_name: product.name,
          product_image: product.image_url,
          price: product.price,
          quantity: qty,
        },
      ];
    });
  };
  const addCustomToCart = (item) => {
    setCart((prev) => [...prev, { id: "ci" + Date.now(), ...item }]);
  };
  const updateCartQty = (id, qty) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  // ── Wishlist ───────────────────────────────────────────────────────────────
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((w) => w.product_id === product.id);
      if (exists) return prev.filter((w) => w.product_id !== product.id);
      return [
        ...prev,
        {
          id: "wi" + Date.now(),
          product_id: product.id,
          product_name: product.name,
          product_image: product.image_url,
          price: product.price,
          category: product.category,
        },
      ];
    });
  };
  const isWishlisted = (productId) =>
    wishlist.some((w) => w.product_id === productId);

  // ── Orders ─────────────────────────────────────────────────────────────────
  const placeOrder = (orderData) => {
    const newOrder = {
      id: "ord" + Date.now(),
      created_date: new Date().toISOString(),
      status: "pending",
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };
  const updateOrderStatus = (orderId, status) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );

  // ── Products (admin) ───────────────────────────────────────────────────────
  const createProduct = (data) => {
    const p = { ...data, id: "p" + Date.now() };
    setProducts((prev) => [...prev, p]);
    return p;
  };
  const updateProduct = (id, data) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
    );
  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  // ── Categories (admin) ─────────────────────────────────────────────────────
  const createCategory = (data) => {
    const c = { ...data, id: "cat" + Date.now() };
    setCategories((prev) => [...prev, c]);
    return c;
  };
  const updateCategory = (id, data) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
    );
  const deleteCategory = (id) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));

  // ── SubCategories (admin) ──────────────────────────────────────────────────
  const createSubCategory = (data) => {
    const s = { ...data, id: "sub" + Date.now() };
    setSubCategories((prev) => [...prev, s]);
    return s;
  };
  const updateSubCategory = (id, data) =>
    setSubCategories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
    );
  const deleteSubCategory = (id) =>
    setSubCategories((prev) => prev.filter((s) => s.id !== id));

  // ── Store settings (admin) ─────────────────────────────────────────────────
  const saveStoreSettings = (data) => setStoreSettings(data);

  // ── Group orders ───────────────────────────────────────────────────────────
  const createGroupOrder = (data) => {
    const g = {
      ...data,
      id: "grp" + Date.now(),
      created_date: new Date().toISOString(),
    };
    setGroupOrders((prev) => [g, ...prev]);
    return g;
  };
  const updateGroupOrder = (id, data) => {
    let updated;
    setGroupOrders((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          updated = { ...g, ...data };
          return updated;
        }
        return g;
      }),
    );
    return updated;
  };
  const findGroupByCode = (code) =>
    groupOrders.find((g) => g.share_code === code.toUpperCase());

  const cartCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <AppContext.Provider
      value={{
        // Auth
        currentUser,
        login,
        signup,
        logout,
        // Cart
        cart,
        cartCount,
        addToCart,
        addCustomToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        // Wishlist
        wishlist,
        toggleWishlist,
        isWishlisted,
        // Orders
        orders,
        placeOrder,
        updateOrderStatus,
        // Data
        products,
        categories,
        subCategories,
        storeSettings,
        // Admin
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        createSubCategory,
        updateSubCategory,
        deleteSubCategory,
        saveStoreSettings,
        // Group
        groupOrders,
        createGroupOrder,
        updateGroupOrder,
        findGroupByCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
