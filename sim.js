'use strict';

// ─── BUSINESS TYPES ──────────────────────────────────────────────────────────
const BUSINESS_TYPES = {
  smoothie: {
    id:'smoothie', name:'Smoothie Shop', icon:'🥤', category:'Food & Beverage',
    description:'Blend and sell fresh fruit smoothies. High volume, great summer demand.',
    startupCostMin:18000, startupCostMax:35000,
    baseDemandPerHour:8, marketAveragePrice:9.50, cogsRatio:0.32,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:5, priceMax:18, priceDefault:9.50, unitLabel:'smoothie',
    employeeRoles:[
      {role:'Blender Operator',wageMin:12,wageMax:18,qualityImpact:0.4},
      {role:'Cashier',wageMin:10,wageMax:15,qualityImpact:0.2},
      {role:'Store Manager',wageMin:18,wageMax:28,qualityImpact:0.7}
    ],
    equipmentList:[
      {id:'blender',name:'Commercial Blender',cost:2500,qualityImpact:0.35,required:true},
      {id:'refrigeration',name:'Refrigeration Unit',cost:4000,qualityImpact:0.30,required:true},
      {id:'pos',name:'POS System',cost:1200,qualityImpact:0.10,required:false},
      {id:'signage',name:'Outdoor Signage',cost:800,qualityImpact:0.15,required:false},
      {id:'blender2',name:'Extra Blender Station',cost:1800,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.80,0.82,0.90,0.95,1.20,1.40,1.50,1.45,1.15,0.95,0.85,0.82]
  },
  pizza: {
    id:'pizza', name:'Pizza Place', icon:'🍕', category:'Food & Beverage',
    description:'Classic pizza restaurant. Strong consistent demand with delivery potential.',
    startupCostMin:35000, startupCostMax:80000,
    baseDemandPerHour:5, marketAveragePrice:18.50, cogsRatio:0.28,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:10, priceMax:35, priceDefault:18.50, unitLabel:'pizza',
    employeeRoles:[
      {role:'Pizza Chef',wageMin:14,wageMax:22,qualityImpact:0.6},
      {role:'Delivery Driver',wageMin:12,wageMax:16,qualityImpact:0.2},
      {role:'Cashier',wageMin:10,wageMax:14,qualityImpact:0.1},
      {role:'Manager',wageMin:20,wageMax:30,qualityImpact:0.5}
    ],
    equipmentList:[
      {id:'oven',name:'Commercial Pizza Oven',cost:6000,qualityImpact:0.40,required:true},
      {id:'prep',name:'Prep Station',cost:2200,qualityImpact:0.20,required:true},
      {id:'refrigeration',name:'Walk-in Cooler',cost:8000,qualityImpact:0.25,required:false},
      {id:'pos',name:'POS System',cost:1500,qualityImpact:0.10,required:false},
      {id:'delivery',name:'Delivery Bags & Warmers',cost:600,qualityImpact:0.05,required:false}
    ],
    seasonality:[0.90,0.90,0.95,1.00,1.05,1.10,1.15,1.10,1.00,1.00,1.05,0.95]
  },
  plumbing: {
    id:'plumbing', name:'Plumbing Business', icon:'🔧', category:'Home Services',
    description:'Residential and commercial plumbing services. Steady demand year-round.',
    startupCostMin:12000, startupCostMax:25000,
    baseDemandPerHour:1, marketAveragePrice:180, cogsRatio:0.20,
    locationSensitivity:0.3, marketingSensitivity:0.7,
    priceMin:80, priceMax:350, priceDefault:180, unitLabel:'job',
    employeeRoles:[
      {role:'Licensed Plumber',wageMin:25,wageMax:40,qualityImpact:0.7},
      {role:'Plumber Apprentice',wageMin:16,wageMax:22,qualityImpact:0.3},
      {role:'Office Admin',wageMin:14,wageMax:20,qualityImpact:0.2}
    ],
    equipmentList:[
      {id:'tools',name:'Plumbing Tool Set',cost:3500,qualityImpact:0.35,required:true},
      {id:'truck',name:'Service Truck',cost:15000,qualityImpact:0.30,required:true},
      {id:'camera',name:'Pipe Inspection Camera',cost:2800,qualityImpact:0.25,required:false},
      {id:'hydro',name:'Hydro Jetter',cost:5000,qualityImpact:0.20,required:false}
    ],
    seasonality:[0.95,0.95,1.00,1.05,1.05,1.00,1.00,1.00,1.00,1.00,1.05,1.00]
  },
  electrical: {
    id:'electrical', name:'Electrical Business', icon:'⚡', category:'Home Services',
    description:'Electrical installation and repair. Licensing required, excellent margins.',
    startupCostMin:12000, startupCostMax:25000,
    baseDemandPerHour:1, marketAveragePrice:160, cogsRatio:0.20,
    locationSensitivity:0.3, marketingSensitivity:0.7,
    priceMin:75, priceMax:320, priceDefault:160, unitLabel:'job',
    employeeRoles:[
      {role:'Licensed Electrician',wageMin:28,wageMax:45,qualityImpact:0.75},
      {role:'Apprentice Electrician',wageMin:16,wageMax:24,qualityImpact:0.3},
      {role:'Office Admin',wageMin:14,wageMax:20,qualityImpact:0.2}
    ],
    equipmentList:[
      {id:'tools',name:'Electrical Tool Kit',cost:3000,qualityImpact:0.35,required:true},
      {id:'truck',name:'Service Truck',cost:15000,qualityImpact:0.30,required:true},
      {id:'tester',name:'Advanced Circuit Tester',cost:1500,qualityImpact:0.20,required:false},
      {id:'lift',name:'Aerial Work Platform',cost:8000,qualityImpact:0.15,required:false}
    ],
    seasonality:[0.95,0.95,1.00,1.05,1.00,1.00,1.00,1.00,1.00,1.05,1.05,1.00]
  },
  physicalTherapy: {
    id:'physicalTherapy', name:'Physical Therapy', icon:'💆', category:'Health',
    description:'Rehabilitation and wellness services. High margins, growing market.',
    startupCostMin:20000, startupCostMax:45000,
    baseDemandPerHour:2, marketAveragePrice:120, cogsRatio:0.05,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:60, priceMax:250, priceDefault:120, unitLabel:'session',
    employeeRoles:[
      {role:'Physical Therapist',wageMin:35,wageMax:55,qualityImpact:0.8},
      {role:'PT Aide',wageMin:15,wageMax:22,qualityImpact:0.3},
      {role:'Front Desk',wageMin:13,wageMax:18,qualityImpact:0.2}
    ],
    equipmentList:[
      {id:'table',name:'Treatment Tables (x3)',cost:3600,qualityImpact:0.30,required:true},
      {id:'ultrasound',name:'Ultrasound Therapy Unit',cost:4500,qualityImpact:0.35,required:true},
      {id:'stim',name:'Electrical Stimulation Unit',cost:2800,qualityImpact:0.25,required:false},
      {id:'exercise',name:'Exercise Equipment Set',cost:5000,qualityImpact:0.20,required:false},
      {id:'emr',name:'EMR Software',cost:2000,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.95,0.95,1.00,1.00,1.00,0.90,0.85,0.90,1.05,1.05,1.05,1.00]
  },
  hairSalon: {
    id:'hairSalon', name:'Hair Salon', icon:'💇', category:'Beauty',
    description:'Full-service hair salon. Loyal repeat customers and low COGS.',
    startupCostMin:18000, startupCostMax:35000,
    baseDemandPerHour:3, marketAveragePrice:45, cogsRatio:0.05,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:20, priceMax:120, priceDefault:45, unitLabel:'service',
    employeeRoles:[
      {role:'Senior Stylist',wageMin:18,wageMax:30,qualityImpact:0.7},
      {role:'Junior Stylist',wageMin:12,wageMax:18,qualityImpact:0.4},
      {role:'Receptionist',wageMin:11,wageMax:16,qualityImpact:0.2}
    ],
    equipmentList:[
      {id:'chairs',name:'Styling Chairs (x4)',cost:3200,qualityImpact:0.30,required:true},
      {id:'shampoo',name:'Shampoo Bowls (x2)',cost:2400,qualityImpact:0.25,required:true},
      {id:'dryers',name:'Hood Dryers',cost:1800,qualityImpact:0.15,required:false},
      {id:'pos',name:'Booking Software & POS',cost:1200,qualityImpact:0.15,required:false},
      {id:'display',name:'Product Display Unit',cost:800,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.90,0.90,0.95,1.00,1.05,1.10,1.10,1.05,1.00,1.00,1.05,1.10]
  },
  autoRepair: {
    id:'autoRepair', name:'Auto Repair Shop', icon:'🚗', category:'Automotive',
    description:'General automotive repair. High ticket prices, steady demand.',
    startupCostMin:40000, startupCostMax:75000,
    baseDemandPerHour:1.5, marketAveragePrice:280, cogsRatio:0.35,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:100, priceMax:600, priceDefault:280, unitLabel:'repair job',
    employeeRoles:[
      {role:'Master Mechanic',wageMin:25,wageMax:40,qualityImpact:0.75},
      {role:'Technician',wageMin:18,wageMax:28,qualityImpact:0.4},
      {role:'Service Advisor',wageMin:16,wageMax:24,qualityImpact:0.3}
    ],
    equipmentList:[
      {id:'lift',name:'Auto Lift (x2)',cost:12000,qualityImpact:0.40,required:true},
      {id:'tools',name:'Diagnostic Tool Set',cost:6000,qualityImpact:0.30,required:true},
      {id:'compressor',name:'Air Compressor',cost:2000,qualityImpact:0.15,required:false},
      {id:'alignment',name:'Alignment Machine',cost:10000,qualityImpact:0.25,required:false},
      {id:'diagnostic',name:'Advanced Diagnostic Scanner',cost:4500,qualityImpact:0.20,required:false}
    ],
    seasonality:[0.95,0.95,1.00,1.00,1.05,1.00,1.00,1.00,1.00,1.00,1.05,1.00]
  },
  catering: {
    id:'catering', name:'Catering', icon:'🍽️', category:'Food & Beverage',
    description:'Event catering service. Large contracts, high revenue per job.',
    startupCostMin:15000, startupCostMax:35000,
    baseDemandPerHour:0.3, marketAveragePrice:2500, cogsRatio:0.40,
    locationSensitivity:0.3, marketingSensitivity:0.9,
    priceMin:500, priceMax:8000, priceDefault:2500, unitLabel:'event',
    employeeRoles:[
      {role:'Head Chef',wageMin:25,wageMax:40,qualityImpact:0.7},
      {role:'Line Cook',wageMin:15,wageMax:22,qualityImpact:0.3},
      {role:'Event Coordinator',wageMin:18,wageMax:28,qualityImpact:0.4}
    ],
    equipmentList:[
      {id:'van',name:'Catering Van',cost:18000,qualityImpact:0.35,required:true},
      {id:'chafing',name:'Chafing Dishes & Warmers',cost:2500,qualityImpact:0.20,required:true},
      {id:'kitchen',name:'Commercial Kitchen Equipment',cost:8000,qualityImpact:0.30,required:false},
      {id:'tent',name:'Event Tent & Tables',cost:3500,qualityImpact:0.15,required:false}
    ],
    seasonality:[0.75,0.80,0.90,1.10,1.20,1.30,1.25,1.20,1.10,1.05,1.10,1.30]
  },
  giftBaskets: {
    id:'giftBaskets', name:'Online Gift Baskets', icon:'🎁', category:'Retail',
    description:'Curate and sell gift baskets online. Low overhead, holiday spikes.',
    startupCostMin:8000, startupCostMax:20000,
    baseDemandPerHour:2, marketAveragePrice:65, cogsRatio:0.45,
    locationSensitivity:0.3, marketingSensitivity:0.9,
    priceMin:25, priceMax:200, priceDefault:65, unitLabel:'basket',
    employeeRoles:[
      {role:'Assembly Specialist',wageMin:12,wageMax:18,qualityImpact:0.5},
      {role:'Order Fulfillment',wageMin:11,wageMax:16,qualityImpact:0.3},
      {role:'Social Media Manager',wageMin:14,wageMax:22,qualityImpact:0.4}
    ],
    equipmentList:[
      {id:'packaging',name:'Packaging Supplies & Ribbon',cost:800,qualityImpact:0.25,required:true},
      {id:'shelving',name:'Storage Shelving',cost:1200,qualityImpact:0.15,required:true},
      {id:'website',name:'E-Commerce Website',cost:2500,qualityImpact:0.35,required:false},
      {id:'printer',name:'Label Printer',cost:600,qualityImpact:0.10,required:false},
      {id:'photo',name:'Photography Setup',cost:1500,qualityImpact:0.15,required:false}
    ],
    seasonality:[0.70,0.75,0.90,0.95,1.05,0.90,0.85,0.85,0.95,1.10,1.40,1.70]
  },
  trampolinePark: {
    id:'trampolinePark', name:'Trampoline Park', icon:'🎪', category:'Entertainment',
    description:'Indoor trampoline facility. Family-friendly, high revenue potential.',
    startupCostMin:80000, startupCostMax:160000,
    baseDemandPerHour:8, marketAveragePrice:18, cogsRatio:0.10,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:10, priceMax:35, priceDefault:18, unitLabel:'admission',
    employeeRoles:[
      {role:'Court Monitor',wageMin:11,wageMax:16,qualityImpact:0.4},
      {role:'Front Desk Attendant',wageMin:11,wageMax:15,qualityImpact:0.2},
      {role:'Manager',wageMin:18,wageMax:28,qualityImpact:0.6}
    ],
    equipmentList:[
      {id:'trampolines',name:'Trampoline Court (main)',cost:35000,qualityImpact:0.50,required:true},
      {id:'foam',name:'Foam Pit',cost:12000,qualityImpact:0.20,required:true},
      {id:'dodgeball',name:'Dodgeball Zone',cost:8000,qualityImpact:0.15,required:false},
      {id:'ninja',name:'Ninja Warrior Course',cost:18000,qualityImpact:0.20,required:false},
      {id:'party',name:'Party Room Setup',cost:5000,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.80,0.82,0.90,0.95,1.10,1.35,1.50,1.45,1.05,0.95,0.90,0.85]
  },
  bowlingAlley: {
    id:'bowlingAlley', name:'Bowling Alley', icon:'🎳', category:'Entertainment',
    description:'Classic bowling alley. Consistent family and league revenue.',
    startupCostMin:100000, startupCostMax:200000,
    baseDemandPerHour:6, marketAveragePrice:20, cogsRatio:0.10,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:10, priceMax:40, priceDefault:20, unitLabel:'game',
    employeeRoles:[
      {role:'Lane Attendant',wageMin:11,wageMax:15,qualityImpact:0.3},
      {role:'Snack Bar Staff',wageMin:11,wageMax:15,qualityImpact:0.2},
      {role:'Manager',wageMin:20,wageMax:30,qualityImpact:0.7}
    ],
    equipmentList:[
      {id:'lanes',name:'Bowling Lanes (x6)',cost:60000,qualityImpact:0.50,required:true},
      {id:'pins',name:'Automatic Pin Setters',cost:20000,qualityImpact:0.25,required:true},
      {id:'shoes',name:'Shoe Rental Fleet',cost:3000,qualityImpact:0.10,required:false},
      {id:'scoring',name:'Electronic Scoring System',cost:12000,qualityImpact:0.15,required:false}
    ],
    seasonality:[0.85,0.85,0.90,0.90,0.95,1.05,1.20,1.15,0.95,0.95,1.05,1.05]
  },
  fitnessCenter: {
    id:'fitnessCenter', name:'Fitness Center', icon:'💪', category:'Health',
    description:'Gym with memberships and personal training. Recurring revenue model.',
    startupCostMin:60000, startupCostMax:120000,
    baseDemandPerHour:4, marketAveragePrice:55, cogsRatio:0.05,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:25, priceMax:120, priceDefault:55, unitLabel:'membership',
    employeeRoles:[
      {role:'Personal Trainer',wageMin:18,wageMax:30,qualityImpact:0.6},
      {role:'Front Desk',wageMin:11,wageMax:16,qualityImpact:0.2},
      {role:'Facility Manager',wageMin:20,wageMax:32,qualityImpact:0.5}
    ],
    equipmentList:[
      {id:'cardio',name:'Cardio Machine Fleet',cost:18000,qualityImpact:0.30,required:true},
      {id:'weights',name:'Free Weight Section',cost:12000,qualityImpact:0.30,required:true},
      {id:'machines',name:'Resistance Machines',cost:15000,qualityImpact:0.25,required:false},
      {id:'lockers',name:'Locker Room Upgrade',cost:8000,qualityImpact:0.10,required:false},
      {id:'sauna',name:'Sauna',cost:6000,qualityImpact:0.10,required:false}
    ],
    seasonality:[1.20,1.15,1.10,1.05,1.00,0.85,0.80,0.80,1.00,1.05,1.10,1.15]
  },
  coffeeShop: {
    id:'coffeeShop', name:'Coffee Shop', icon:'☕', category:'Food & Beverage',
    description:'Specialty coffee shop. Very high volume, excellent location sensitivity.',
    startupCostMin:20000, startupCostMax:40000,
    baseDemandPerHour:12, marketAveragePrice:6.50, cogsRatio:0.30,
    locationSensitivity:0.9, marketingSensitivity:0.7,
    priceMin:3, priceMax:15, priceDefault:6.50, unitLabel:'drink',
    employeeRoles:[
      {role:'Lead Barista',wageMin:14,wageMax:20,qualityImpact:0.6},
      {role:'Barista',wageMin:11,wageMax:16,qualityImpact:0.4},
      {role:'Shift Supervisor',wageMin:16,wageMax:24,qualityImpact:0.5}
    ],
    equipmentList:[
      {id:'espresso',name:'Commercial Espresso Machine',cost:8000,qualityImpact:0.45,required:true},
      {id:'grinder',name:'Commercial Grinders (x2)',cost:2400,qualityImpact:0.25,required:true},
      {id:'blender',name:'Blenders for Frappes',cost:1200,qualityImpact:0.10,required:false},
      {id:'pos',name:'POS & Loyalty System',cost:1800,qualityImpact:0.15,required:false},
      {id:'seating',name:'Premium Seating',cost:3500,qualityImpact:0.10,required:false}
    ],
    seasonality:[1.05,1.05,1.00,0.95,0.90,0.80,0.80,0.82,1.00,1.10,1.10,1.10]
  },
  iceCreamShop: {
    id:'iceCreamShop', name:'Ice Cream Shop', icon:'🍦', category:'Food & Beverage',
    description:'Ice cream parlor. Extreme summer peaks, strong foot traffic needed.',
    startupCostMin:15000, startupCostMax:30000,
    baseDemandPerHour:10, marketAveragePrice:7, cogsRatio:0.28,
    locationSensitivity:0.9, marketingSensitivity:0.7,
    priceMin:3, priceMax:15, priceDefault:7, unitLabel:'scoop',
    employeeRoles:[
      {role:'Ice Cream Scooper',wageMin:11,wageMax:15,qualityImpact:0.4},
      {role:'Cashier',wageMin:10,wageMax:14,qualityImpact:0.2},
      {role:'Shift Lead',wageMin:14,wageMax:20,qualityImpact:0.5}
    ],
    equipmentList:[
      {id:'dip_cases',name:'Display Dip Cases',cost:6000,qualityImpact:0.40,required:true},
      {id:'freezer',name:'Walk-in Freezer',cost:8000,qualityImpact:0.30,required:true},
      {id:'soft_serve',name:'Soft Serve Machine',cost:5000,qualityImpact:0.20,required:false},
      {id:'toppings',name:'Toppings Bar Setup',cost:800,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.50,0.55,0.65,0.85,1.20,1.55,1.70,1.65,1.20,0.85,0.60,0.55]
  },
  tshirtPrinting: {
    id:'tshirtPrinting', name:'T-Shirt Printing', icon:'👕', category:'Retail',
    description:'Custom t-shirt printing. Good margins, event and bulk orders possible.',
    startupCostMin:10000, startupCostMax:25000,
    baseDemandPerHour:2, marketAveragePrice:28, cogsRatio:0.35,
    locationSensitivity:0.8, marketingSensitivity:0.9,
    priceMin:12, priceMax:65, priceDefault:28, unitLabel:'shirt',
    employeeRoles:[
      {role:'Print Technician',wageMin:14,wageMax:22,qualityImpact:0.6},
      {role:'Design Specialist',wageMin:16,wageMax:26,qualityImpact:0.5},
      {role:'Sales Rep',wageMin:13,wageMax:20,qualityImpact:0.3}
    ],
    equipmentList:[
      {id:'printer',name:'Screen Print Press',cost:5000,qualityImpact:0.40,required:true},
      {id:'dryer',name:'Conveyor Dryer',cost:3000,qualityImpact:0.25,required:true},
      {id:'dtg',name:'DTG Digital Printer',cost:12000,qualityImpact:0.35,required:false},
      {id:'heat',name:'Heat Press Machine',cost:1500,qualityImpact:0.15,required:false},
      {id:'software',name:'Design Software Suite',cost:800,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.80,0.85,0.90,0.95,1.05,1.20,1.25,1.20,1.05,0.95,1.00,1.10]
  },
  burritoRestaurant: {
    id:'burritoRestaurant', name:'Burrito Restaurant', icon:'🌯', category:'Food & Beverage',
    description:'Fast-casual burrito spot. Quick service, strong lunchtime traffic.',
    startupCostMin:25000, startupCostMax:55000,
    baseDemandPerHour:8, marketAveragePrice:12, cogsRatio:0.32,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:7, priceMax:22, priceDefault:12, unitLabel:'burrito',
    employeeRoles:[
      {role:'Line Cook',wageMin:13,wageMax:19,qualityImpact:0.5},
      {role:'Cashier',wageMin:11,wageMax:15,qualityImpact:0.2},
      {role:'Prep Cook',wageMin:12,wageMax:17,qualityImpact:0.3},
      {role:'Manager',wageMin:18,wageMax:28,qualityImpact:0.6}
    ],
    equipmentList:[
      {id:'steam_table',name:'Steam Table',cost:3500,qualityImpact:0.30,required:true},
      {id:'grill',name:'Flat Top Grill',cost:3000,qualityImpact:0.30,required:true},
      {id:'refrigeration',name:'Refrigerated Prep Line',cost:5000,qualityImpact:0.25,required:false},
      {id:'pos',name:'POS System',cost:1500,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.88,0.88,0.92,0.97,1.05,1.10,1.15,1.10,1.02,0.98,0.95,0.88]
  },
  lawnCare: {
    id:'lawnCare', name:'Lawn Care Services', icon:'🌿', category:'Home Services',
    description:'Residential lawn maintenance. Seasonal, low startup cost.',
    startupCostMin:10000, startupCostMax:22000,
    baseDemandPerHour:1, marketAveragePrice:120, cogsRatio:0.25,
    locationSensitivity:0.3, marketingSensitivity:0.7,
    priceMin:50, priceMax:300, priceDefault:120, unitLabel:'job',
    employeeRoles:[
      {role:'Crew Leader',wageMin:16,wageMax:24,qualityImpact:0.6},
      {role:'Lawn Tech',wageMin:12,wageMax:18,qualityImpact:0.4},
      {role:'Office Admin',wageMin:13,wageMax:18,qualityImpact:0.2}
    ],
    equipmentList:[
      {id:'mowers',name:'Commercial Mowers (x2)',cost:6000,qualityImpact:0.40,required:true},
      {id:'trailer',name:'Equipment Trailer',cost:4000,qualityImpact:0.20,required:true},
      {id:'trimmers',name:'Edgers & Trimmers',cost:1200,qualityImpact:0.20,required:false},
      {id:'blowers',name:'Leaf Blowers (x2)',cost:800,qualityImpact:0.10,required:false},
      {id:'truck',name:'Work Truck',cost:12000,qualityImpact:0.25,required:false}
    ],
    seasonality:[0.20,0.25,0.60,0.95,1.40,1.50,1.40,1.35,1.20,0.90,0.45,0.20]
  },
  djServices: {
    id:'djServices', name:'DJ Services', icon:'🎧', category:'Entertainment',
    description:'Event DJ and sound equipment. Large revenue per event, event-driven.',
    startupCostMin:10000, startupCostMax:22000,
    baseDemandPerHour:0.5, marketAveragePrice:1200, cogsRatio:0.10,
    locationSensitivity:0.3, marketingSensitivity:0.9,
    priceMin:300, priceMax:5000, priceDefault:1200, unitLabel:'event',
    employeeRoles:[
      {role:'Lead DJ',wageMin:25,wageMax:50,qualityImpact:0.8},
      {role:'Sound Tech',wageMin:18,wageMax:30,qualityImpact:0.4},
      {role:'Event Coordinator',wageMin:15,wageMax:25,qualityImpact:0.3}
    ],
    equipmentList:[
      {id:'mixer',name:'Professional DJ Mixer',cost:2500,qualityImpact:0.35,required:true},
      {id:'speakers',name:'PA Speaker System',cost:5000,qualityImpact:0.40,required:true},
      {id:'lights',name:'LED Lighting Rig',cost:3000,qualityImpact:0.20,required:false},
      {id:'van',name:'Equipment Transport Van',cost:14000,qualityImpact:0.15,required:false}
    ],
    seasonality:[0.70,0.75,0.85,0.95,1.10,1.30,1.35,1.30,1.10,0.95,1.10,1.35]
  },
  battingCage: {
    id:'battingCage', name:'Batting Cage', icon:'⚾', category:'Entertainment',
    description:'Indoor batting practice facility. Popular with youth sports leagues.',
    startupCostMin:35000, startupCostMax:70000,
    baseDemandPerHour:5, marketAveragePrice:15, cogsRatio:0.10,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:8, priceMax:30, priceDefault:15, unitLabel:'session',
    employeeRoles:[
      {role:'Cage Attendant',wageMin:11,wageMax:16,qualityImpact:0.4},
      {role:'Batting Coach',wageMin:18,wageMax:30,qualityImpact:0.7},
      {role:'Manager',wageMin:16,wageMax:26,qualityImpact:0.5}
    ],
    equipmentList:[
      {id:'machines',name:'Pitching Machines (x4)',cost:8000,qualityImpact:0.40,required:true},
      {id:'netting',name:'Batting Cage Netting',cost:6000,qualityImpact:0.30,required:true},
      {id:'helmets',name:'Helmets & Bat Fleet',cost:2000,qualityImpact:0.15,required:false},
      {id:'turf',name:'Artificial Turf',cost:4000,qualityImpact:0.15,required:false}
    ],
    seasonality:[0.75,0.80,1.00,1.15,1.30,1.20,1.15,1.15,1.20,1.10,0.85,0.75]
  },
  goKart: {
    id:'goKart', name:'Go Kart Track', icon:'🏎️', category:'Entertainment',
    description:'Outdoor go-kart racing. High fun factor, weather dependent.',
    startupCostMin:80000, startupCostMax:160000,
    baseDemandPerHour:6, marketAveragePrice:22, cogsRatio:0.15,
    locationSensitivity:0.8, marketingSensitivity:0.7,
    priceMin:12, priceMax:45, priceDefault:22, unitLabel:'race',
    employeeRoles:[
      {role:'Track Marshal',wageMin:11,wageMax:16,qualityImpact:0.4},
      {role:'Mechanic',wageMin:16,wageMax:26,qualityImpact:0.5},
      {role:'Cashier',wageMin:10,wageMax:14,qualityImpact:0.2},
      {role:'Manager',wageMin:18,wageMax:28,qualityImpact:0.6}
    ],
    equipmentList:[
      {id:'karts',name:'Go Karts Fleet (x8)',cost:24000,qualityImpact:0.50,required:true},
      {id:'track',name:'Track Barriers & Signs',cost:8000,qualityImpact:0.20,required:true},
      {id:'timing',name:'Electronic Timing System',cost:5000,qualityImpact:0.20,required:false},
      {id:'concession',name:'Concession Stand',cost:4000,qualityImpact:0.10,required:false}
    ],
    seasonality:[0.55,0.60,0.80,1.00,1.25,1.50,1.60,1.55,1.25,0.95,0.70,0.55]
  }
};

// ─── LOCATIONS ────────────────────────────────────────────────────────────────
const LOCATIONS = (function() {
  const rows = [
    // row 0 – high-rent premium spots
    [{name:'Oak Park Plaza',address:'101 Oak Park Blvd'},
     {name:'Elm Street Market',address:'220 Elm St'},
     {name:'City Center Hub',address:'1 Main St Downtown'},
     {name:'Riverside Commons',address:'305 River Rd'},
     {name:'West Side Depot',address:'88 Industrial Dr'}],
    // row 1 – mid-tier
    [{name:'Maple Grove Center',address:'400 Maple Ave'},
     {name:'Uptown Square',address:'550 Commerce Way'},
     {name:'Midtown Galleria',address:'600 5th Ave'},
     {name:'Eastgate Mall',address:'700 Eastgate Blvd'},
     {name:'Harbor Warehouse',address:'22 Harbor Ln'}],
    // row 2 – value spots
    [{name:'Cedar Ridge Strip',address:'810 Cedar Rd'},
     {name:'Broad Street Shops',address:'900 Broad St'},
     {name:'Financial District Ct',address:'1 Exchange Pl'},
     {name:'Sunnyvale Center',address:'1050 Sunny Ave'},
     {name:'Tech Park East',address:'14 Innovation Way'}],
    // row 3 – budget / outer
    [{name:'Pinewood Neighborhood',address:'1200 Pine St'},
     {name:'Valley Business Park',address:'1300 Valley Rd'},
     {name:'Metro Central Tower',address:'2 Metro Plaza'},
     {name:'Summit Trade Ctr',address:'1500 Summit Dr'},
     {name:'Lakeside Industrial',address:'80 Lakeside Rd'}]
  ];
  const zones = ['residential','commercial','downtown','commercial','industrial'];
  const zoneMeta = {
    residential: {traffic:0.75, rentBase:[1000,1500], color:'#0a1318'},
    commercial:  {traffic:1.15, rentBase:[2200,2800], color:'#111128'},
    downtown:    {traffic:1.50, rentBase:[3500,4500], color:'#121f0a'},
    industrial:  {traffic:0.60, rentBase:[800,1400],  color:'#141110'}
  };
  const rowModifiers = [1.2, 1.0, 0.9, 0.75];
  const takenIndices = new Set([3,7,11,14,18]);
  const locs = [];
  let idx = 0;
  for (let row=0;row<4;row++) {
    for (let col=0;col<5;col++) {
      const zone = zones[col];
      const meta = zoneMeta[zone];
      const [rmin,rmax] = meta.rentBase;
      const seed = (rmin + rmax)/2 * rowModifiers[row];
      const monthlyRent = Math.round(seed / 50) * 50;
      locs.push({
        id: idx, col, row,
        name: rows[row][col].name,
        address: rows[row][col].address,
        zone, trafficMultiplier: meta.traffic,
        monthlyRent,
        takenByCompetitor: takenIndices.has(idx)
      });
      idx++;
    }
  }
  return locs;
})();

// ─── STATE ────────────────────────────────────────────────────────────────────
const STATE = {
  simDay:1, running:false, speed:3,
  goalNetWorth:75000, totalSimDays:182,
  personalCash:15000,
  personalInvested:{savings:0, stocks:0},
  business:null,
  journal:[], messages:[], surveys:[], dailyHistory:[],
  simTimer:null, empPool:[]
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(n) {
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (abs >= 1000) return (n/1000).toFixed(1)+'k';
  return n.toFixed(0);
}
function fmtC(n) { return (n<0?'-$':'$')+fmt(Math.abs(n)); }
function fmtFull(n) { return (n<0?'-$':'$')+Math.abs(n).toLocaleString('en-US',{maximumFractionDigits:0}); }
function getDayName(d) { return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(d-1)%7]; }
function addJournal(text,type='action') { STATE.journal.unshift({day:STATE.simDay,text,type}); }
function addMessage(from,body) { STATE.messages.unshift({from,date:'Day '+STATE.simDay,body}); }
function showToast(msg,type='') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className='show '+(type||'');
  clearTimeout(t._timer); t._timer = setTimeout(()=>t.className='',3000);
}
function addAdvisorMessage() {
  const tips = [
    'Review your pricing — staying near market average maximizes revenue.',
    'Consider hiring a higher-quality employee to improve your wait rating.',
    'Increasing your marketing budget can significantly boost customer traffic.',
    'Check your cash flow — high loan payments can drain profitability.',
    'Have you considered opening longer hours on weekends?'
  ];
  addMessage('Business Advisor', tips[Math.floor(Math.random()*tips.length)]);
}

// ─── FINANCIALS ───────────────────────────────────────────────────────────────
function calcDailyFinancials() {
  const business = STATE.business;
  if (!business) return {revenue:0,expenses:0,profit:0,customers:0,grossProfit:0,cogs:0};

  const dayOfWeek = (STATE.simDay-1)%7;
  const dayName = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][dayOfWeek];
  const hours = business.hours[dayName];

  if (!hours) {
    // closed — still pay fixed expenses
    const loc = business.locationId !== null ? LOCATIONS[business.locationId] : null;
    const loan = business.loan;
    const ins = business.insurance;
    const insMonthly = (ins.liability?150:0)+(ins.property?120:0)+(ins.workers?200:0)+(ins.business?80:0);
    const totalExpenses = (loc?loc.monthlyRent/30:0) + (loan.amount>0?loan.monthlyPayment/30:0)
      + (business.marketing.budget/30) + (loc?loc.monthlyRent*0.08/30:20)
      + insMonthly/30 + (business.operations.qualityLevel*50+business.operations.efficiencyLevel*30)/30;
    business.cash -= totalExpenses;
    business.totalExpenses += totalExpenses;
    business.totalProfit -= totalExpenses;
    if (STATE.simDay%30===0 && loan.balance>0) {
      const interest = loan.balance*(loan.rate/12);
      const principal = loan.monthlyPayment-interest;
      loan.balance = Math.max(0,loan.balance-principal);
    }
    return {revenue:0,expenses:totalExpenses,profit:-totalExpenses,customers:0,grossProfit:0,cogs:0};
  }

  const hoursOpen = hours[1]-hours[0];
  const btDef = BUSINESS_TYPES[business.typeId];

  const empQuality = business.employees.length>0
    ? business.employees.reduce((s,e)=>s+e.quality,0)/business.employees.length : 1;

  const equipScore = Math.min(1, business.equipment.reduce((s,id)=>{
    const eq = btDef.equipmentList.find(e=>e.id===id);
    return s+(eq?eq.qualityImpact:0);
  },0));

  const mktScore = Math.min(1,(business.marketing.budget/1500)*(0.5+business.marketing.channels.length*0.125));

  const priceVal = business.price||btDef.priceDefault;
  const ratio = priceVal/btDef.marketAveragePrice;
  let priceFactor;
  if (ratio<=0.8) priceFactor=1.15;
  else if (ratio<=1.0) priceFactor=1.0+(1-ratio)*0.75;
  else if (ratio<=1.3) priceFactor=1.0-(ratio-1)*0.8;
  else priceFactor=Math.max(0.1,1.0-(ratio-1)*1.5);

  const loc = business.locationId!==null ? LOCATIONS[business.locationId] : null;
  const locFactor = loc ? loc.trafficMultiplier : 0.5;
  const opsQ = (business.operations.qualityLevel+business.operations.efficiencyLevel)/10;

  const month = Math.floor((STATE.simDay-1)/15)%12;
  const seasonMult = btDef.seasonality[month];
  const dowMult = [1.0,1.0,1.05,1.1,1.2,1.35,1.15][dayOfWeek];

  const baseCustomers = btDef.baseDemandPerHour*hoursOpen;
  const qualityMult = 0.4+(empQuality/10)*0.4+equipScore*0.2;
  let customers = baseCustomers*locFactor*priceFactor*(mktScore*0.5+0.5)*qualityMult*seasonMult*dowMult*opsQ;
  customers = Math.max(0, customers*(0.85+Math.random()*0.30));

  const revenue = customers*priceVal;
  const cogs = revenue*btDef.cogsRatio;
  const grossProfit = revenue-cogs;

  const dailyRent = loc?loc.monthlyRent/30:0;
  const dailyPayroll = business.employees.reduce((s,e)=>s+e.wage*hoursOpen,0);
  const dailyMarketing = business.marketing.budget/30;
  const loan = business.loan;
  const dailyLoanPmt = loan.amount>0?loan.monthlyPayment/30:0;
  const dailyUtilities = loc?loc.monthlyRent*0.08/30:20;
  const ins = business.insurance;
  const insMonthly = (ins.liability?150:0)+(ins.property?120:0)+(ins.workers?200:0)+(ins.business?80:0);
  const dailyInsurance = insMonthly/30;
  const dailyOps = (business.operations.qualityLevel*50+business.operations.efficiencyLevel*30)/30;

  const totalExpenses = dailyRent+dailyPayroll+dailyMarketing+dailyLoanPmt+dailyUtilities+dailyInsurance+dailyOps;
  const netProfit = grossProfit-totalExpenses;

  business.cash += netProfit;
  business.totalRevenue += revenue;
  business.totalExpenses += totalExpenses;
  business.totalProfit += netProfit;
  business.totalCustomers += Math.round(customers);

  if (STATE.simDay%30===0 && loan.balance>0) {
    const interest = loan.balance*(loan.rate/12);
    const principal = loan.monthlyPayment-interest;
    loan.balance = Math.max(0,loan.balance-principal);
  }

  return {revenue,expenses:totalExpenses,profit:netProfit,customers:Math.round(customers),grossProfit,cogs};
}

function calcNetWorth() {
  if (!STATE.business) return STATE.personalCash+STATE.personalInvested.savings+STATE.personalInvested.stocks;
  const btDef = BUSINESS_TYPES[STATE.business.typeId];
  const equipVal = STATE.business.equipment.reduce((s,id)=>{
    const eq = btDef.equipmentList.find(e=>e.id===id);
    return s+(eq?eq.cost*0.6:0);
  },0);
  const bizEquity = STATE.business.cash+equipVal-STATE.business.loan.balance;
  return STATE.personalCash+bizEquity+STATE.personalInvested.savings+STATE.personalInvested.stocks;
}

function calcScore() { return Math.min(100,Math.round((calcNetWorth()/STATE.goalNetWorth)*100)); }

// ─── VITAL SIGNS ──────────────────────────────────────────────────────────────
function updateVitalSigns() {
  const b = STATE.business;
  const nw = calcNetWorth();
  const score = calcScore();
  const last = STATE.dailyHistory[STATE.dailyHistory.length-1];

  const cash = b ? b.cash : STATE.personalCash;
  const cashEl = document.getElementById('vs-cash');
  if (cashEl) { cashEl.textContent = fmtC(cash); cashEl.className='vs-val'+(cash<0?' neg':cash<1000?' warn':''); }

  const ovEl = document.getElementById('vs-overall');
  if (ovEl) ovEl.textContent = score+'/100';

  const qEl = document.getElementById('vs-quality');
  if (qEl) {
    if (b && b.employees.length>0) {
      const avg = b.employees.reduce((s,e)=>s+e.quality,0)/b.employees.length;
      qEl.textContent = avg.toFixed(1)+'/10';
      qEl.className = 'vs-val'+(avg<4?' warn':'');
    } else qEl.textContent='—';
  }

  const wEl = document.getElementById('vs-wait');
  if (wEl) {
    if (b && last && b.employees.length>0) {
      const ratio = last.customers/b.employees.length;
      wEl.textContent = ratio<10?'Excellent':ratio<20?'Good':ratio<35?'Fair':'Poor';
      wEl.className = 'vs-val'+(ratio>35?' neg':ratio>20?' warn':'');
    } else wEl.textContent='—';
  }

  const revEl = document.getElementById('vs-revenue');
  if (revEl) revEl.textContent = last ? fmtC(last.revenue) : '$0';

  const pEl = document.getElementById('vs-profit');
  if (pEl) { pEl.textContent = last ? fmtC(last.profit) : '$0'; pEl.className='vs-val'+(last&&last.profit<0?' neg':''); }

  const tpEl = document.getElementById('vs-totalprofit');
  if (tpEl) tpEl.textContent = b ? fmtC(b.totalProfit) : '$0';

  const nwEl = document.getElementById('vs-networth');
  if (nwEl) { nwEl.textContent = fmtC(nw); nwEl.className='vs-val'+(nw<0?' neg':' warn'); }

  const gradeEl = document.getElementById('grade-display');
  if (gradeEl) gradeEl.textContent = 'Score: '+score+' / 100';

  const dow = getDayName(STATE.simDay);
  const tvEl = document.getElementById('time-value');
  if (tvEl) tvEl.textContent = 'Day '+STATE.simDay+' – '+dow;

  const bnEl = document.getElementById('current-biz-name');
  if (bnEl) bnEl.textContent = b ? b.name : '—';

  const rcEl = document.getElementById('runto-current');
  if (rcEl) rcEl.textContent = STATE.simDay;
}

// ─── CANVAS ───────────────────────────────────────────────────────────────────
const particles = [];

function drawCanvas() {
  const canvas = document.getElementById('sim-view-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=790, H=480;

  ctx.fillStyle = '#060c18';
  ctx.fillRect(0,0,W,H);

  // Roads
  ctx.fillStyle = '#2a2a2a';
  [110,225,340].forEach(y=>ctx.fillRect(0,y,W,22));
  [152,304,456,608].forEach(x=>ctx.fillRect(x,0,22,H));

  const xPos = [20,172,324,476,628];
  const yPos = [12,127,242,357];
  const zoneColors = {downtown:'#121f0a',commercial:'#111128',residential:'#0a1318',industrial:'#141110'};
  const zoneBorders = {downtown:'#2a4010',commercial:'#1a1a3a',residential:'#102030',industrial:'#2a2018'};

  LOCATIONS.forEach(loc=>{
    const x=xPos[loc.col], y=yPos[loc.row], w=132, h=95;
    const isPlayer = STATE.business && STATE.business.locationId===loc.id;
    const isTaken = loc.takenByCompetitor;

    ctx.save();
    if (isPlayer) {
      ctx.shadowBlur=12; ctx.shadowColor='#ffd700';
    }

    // tile background
    ctx.fillStyle = isPlayer ? '#1a1a00' : isTaken ? '#1a0808' : (zoneColors[loc.zone]||'#0e1820');
    ctx.strokeStyle = isPlayer ? '#ffd700' : isTaken ? '#3a1010' : (zoneBorders[loc.zone]||'#1e2e3e');
    ctx.lineWidth = isPlayer ? 2 : 1;

    ctx.beginPath();
    const r=6;
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();

    // zone label
    const zoneColor = zoneBorders[loc.zone]||'#1e2e3e';
    ctx.fillStyle = isPlayer?'#ffd700': isTaken?'#aa4040': (zoneColor);
    ctx.font='9px monospace'; ctx.textAlign='center';
    ctx.fillText(loc.zone.toUpperCase(),x+w/2,y+13);

    // emoji / icon
    if (isPlayer) {
      ctx.font='18px serif'; ctx.textAlign='center';
      ctx.fillText(BUSINESS_TYPES[STATE.business.typeId]?.icon||'🏪',x+w/2,y+38);
    } else if (isTaken) {
      ctx.font='16px serif'; ctx.textAlign='center';
      ctx.fillText('🏢',x+w/2,y+36);
    }

    // name
    ctx.fillStyle = isPlayer?'#ffe866': isTaken?'#cc7070':'#c0c0c0';
    ctx.font = (isPlayer?'bold ':'')+'11px sans-serif'; ctx.textAlign='center';
    const nameLine = loc.name.length>14 ? loc.name.substring(0,13)+'…' : loc.name;
    ctx.fillText(nameLine,x+w/2,y+(isPlayer?54:48));

    // rent
    ctx.fillStyle='#ffd700'; ctx.font='10px monospace'; ctx.textAlign='center';
    ctx.fillText('$'+(loc.monthlyRent/1000).toFixed(1)+'k/mo',x+w/2,y+h-8);
  });

  // Particles
  particles.forEach(p=>{
    p.x += (p.tx-p.x)*0.05;
    p.y += (p.ty-p.y)*0.05;
    p.life--;
    const alpha = p.life/p.maxLife;
    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fillStyle = `rgba(0,229,181,${alpha})`;
    ctx.fill();
  });
  for (let i=particles.length-1;i>=0;i--) { if (particles[i].life<=0) particles.splice(i,1); }
}

function spawnParticle() {
  if (!STATE.business || STATE.business.locationId===null) return;
  const loc = LOCATIONS[STATE.business.locationId];
  const xPos = [20,172,324,476,628];
  const yPos = [12,127,242,357];
  const tx = xPos[loc.col]+66;
  const ty = yPos[loc.row]+47;
  const side = Math.floor(Math.random()*4);
  let sx,sy;
  if (side===0){sx=Math.random()*790;sy=0;}
  else if (side===1){sx=790;sy=Math.random()*480;}
  else if (side===2){sx=Math.random()*790;sy=480;}
  else{sx=0;sy=Math.random()*480;}
  if (Math.random()<0.5) particles.push({x:sx,y:sy,tx,ty,life:60,maxLife:60});
}

function startAnimLoop() { requestAnimationFrame(animFrame); }
function animFrame() { drawCanvas(); requestAnimationFrame(animFrame); }

// ─── MODAL SYSTEM ─────────────────────────────────────────────────────────────
let selectedBType = null;
let selectedLocId = null;

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
  const populators = {
    'modal-form': ()=>buildBTGrid(),
    'modal-locate': ()=>buildLocGrid(),
    'modal-finance': ()=>populateFinanceModal(),
    'modal-team': ()=>buildEmpPool(),
    'modal-resources': ()=>buildEqList(),
    'modal-hours': ()=>populateHoursModal(),
    'modal-pricing': ()=>populatePricingModal(),
    'modal-marketing': ()=>populateMarketingModal(),
    'modal-operations': ()=>populateOpsModal(),
    'modal-insurance': ()=>populateInsuranceModal(),
    'modal-transfer': ()=>populateTransferModal(),
    'modal-invest': ()=>populateInvestModal(),
    'modal-close': ()=>populateCloseModal(),
    'modal-journal': ()=>renderJournal(),
    'modal-scoreboard': ()=>renderScoreboard(),
    'modal-r-competitors': ()=>renderCompetitorResearch(),
    'modal-r-locations': ()=>renderLocationResearch(),
    'modal-r-prices': ()=>renderPriceResearch(),
    'modal-dashboard': ()=>renderDashboard(),
    'modal-income': ()=>renderIncomeStatement(),
    'modal-balance': ()=>renderBalanceSheet(),
    'modal-sales': ()=>renderSalesReport(),
    'modal-backlog': ()=>renderBacklogReport(),
    'modal-personal': ()=>renderPersonalSummary(),
    'modal-messages': ()=>renderMessages(),
    'modal-survey-results': ()=>renderSurveyResults(),
    'modal-helpbot': ()=>renderHelpBot(),
  };
  populators[id]?.();
}

function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

function toggleDD(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}

// ─── GRID BUILDERS ────────────────────────────────────────────────────────────
function buildBTGrid() {
  const grid = document.getElementById('bt-grid');
  if (!grid) return;
  grid.innerHTML='';
  Object.values(BUSINESS_TYPES).forEach(bt=>{
    const div = document.createElement('div');
    div.className='bt'+(selectedBType===bt.id?' sel':'');
    div.dataset.type=bt.id;
    div.innerHTML=`<span class="bt-icon">${bt.icon}</span><span class="bt-name">${bt.name}</span><span class="bt-cost">$${(bt.startupCostMin/1000).toFixed(0)}k+</span>`;
    div.onclick=()=>{
      selectedBType=bt.id;
      document.querySelectorAll('.bt').forEach(d=>d.classList.remove('sel'));
      div.classList.add('sel');
      const det=document.getElementById('bt-detail');
      if (det) det.innerHTML=`<strong>${bt.icon} ${bt.name}</strong><br>${bt.description}<br><em>Avg Price: ${fmtFull(bt.marketAveragePrice)} | Startup: ${fmtFull(bt.startupCostMin)}–${fmtFull(bt.startupCostMax)}</em>`;
    };
    grid.appendChild(div);
  });
}

function buildLocGrid() {
  const grid = document.getElementById('loc-grid');
  if (!grid) return;
  grid.innerHTML='';
  LOCATIONS.forEach(loc=>{
    const div = document.createElement('div');
    const isMine = STATE.business && STATE.business.locationId===loc.id;
    div.className='lt'+(loc.takenByCompetitor?' taken':'')+(isMine?' sel':selectedLocId===loc.id?' sel':'');
    div.dataset.id=loc.id;
    const dots='●'.repeat(Math.round(loc.trafficMultiplier*4))+'○'.repeat(Math.max(0,4-Math.round(loc.trafficMultiplier*4)));
    div.innerHTML=`<span class="lt-zone">${loc.zone}</span><span class="lt-name">${loc.name}</span><span class="lt-rent">$${loc.monthlyRent.toLocaleString()}/mo</span><span class="lt-traffic">${dots}</span>`;
    if (!loc.takenByCompetitor && !isMine) {
      div.onclick=()=>{
        selectedLocId=loc.id;
        document.querySelectorAll('.lt').forEach(d=>d.classList.remove('sel'));
        div.classList.add('sel');
      };
    }
    grid.appendChild(div);
  });
}

function buildHoursTable() {
  const tbody = document.getElementById('hours-tbody');
  if (!tbody) return;
  tbody.innerHTML='';
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const defaults={Mon:[9,21],Tue:[9,21],Wed:[9,21],Thu:[9,21],Fri:[9,21],Sat:[10,20],Sun:null};
  days.forEach(day=>{
    const def=defaults[day];
    const tr=document.createElement('tr');
    const timeOpts = Array.from({length:18},(_,i)=>{
      const h=6+i; const label=h<12?h+':00 AM':h===12?'12:00 PM':(h-12)+':00 PM';
      return `<option value="${h}">${label}</option>`;
    }).join('');
    tr.innerHTML=`<td>${day}</td>
<td><input type="checkbox" class="hours-check" data-day="${day}" ${def?'checked':''}></td>
<td><select class="hours-open" data-day="${day}">${timeOpts}</select></td>
<td><select class="hours-close" data-day="${day}">${timeOpts}</select></td>`;
    tbody.appendChild(tr);
    const openSel=tr.querySelector('.hours-open');
    const closeSel=tr.querySelector('.hours-close');
    openSel.value=def?def[0]:9;
    closeSel.value=def?def[1]:21;
    tr.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',updateHoursSummary));
  });
  updateHoursSummary();
}

function updateHoursSummary() {
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let total=0;
  days.forEach(day=>{
    const chk=document.querySelector(`.hours-check[data-day="${day}"]`);
    const open=document.querySelector(`.hours-open[data-day="${day}"]`);
    const close=document.querySelector(`.hours-close[data-day="${day}"]`);
    if (chk&&chk.checked&&open&&close) total+=parseInt(close.value)-parseInt(open.value);
  });
  const el=document.getElementById('hours-summary');
  if (el) el.textContent=`Total weekly hours: ${total}`;
}

function populateHoursModal() {
  if (!STATE.business) return;
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  days.forEach(day=>{
    const h=STATE.business.hours[day];
    const chk=document.querySelector(`.hours-check[data-day="${day}"]`);
    const open=document.querySelector(`.hours-open[data-day="${day}"]`);
    const close=document.querySelector(`.hours-close[data-day="${day}"]`);
    if (chk) chk.checked=!!h;
    if (open && h) open.value=h[0];
    if (close && h) close.value=h[1];
  });
  updateHoursSummary();
}

function buildEmpPool() {
  if (!STATE.business) return;
  const btDef = BUSINESS_TYPES[STATE.business.typeId];
  if (!STATE.empPool || STATE.empPool.length<8) {
    const names=['Alex','Jordan','Sam','Casey','Taylor','Morgan','Riley','Quinn','Cameron','Avery'];
    STATE.empPool=[];
    for (let i=0;i<8;i++) {
      const role = btDef.employeeRoles[i%btDef.employeeRoles.length];
      const wage = parseFloat((role.wageMin+(Math.random()*(role.wageMax-role.wageMin))).toFixed(2));
      const quality = parseFloat((3+Math.random()*7).toFixed(1));
      STATE.empPool.push({id:'emp'+i, name:names[i], role:role.role, wage, quality});
    }
  }
  const container = document.getElementById('emp-pool');
  if (!container) return;
  container.innerHTML='';
  STATE.empPool.forEach((emp,i)=>{
    const hired = STATE.business.employees.some(e=>e.id===emp.id);
    const div=document.createElement('div');
    div.className='emp-card'+(hired?' hired':'');
    div.innerHTML=`<strong>${emp.name}</strong><br><em>${emp.role}</em><br>$${emp.wage.toFixed(0)}/hr · Quality: ${emp.quality.toFixed(1)}<br>
<button class="btn btn-sm ${hired?'btn-danger':'btn-primary'}" onclick="${hired?'fireEmployee':'hireEmployee'}(${i})">${hired?'Fire':'Hire'}</button>`;
    container.appendChild(div);
  });
  const sumEl=document.getElementById('team-summary');
  if (sumEl) {
    const monthlyPayroll = STATE.business.employees.reduce((s,e)=>s+e.wage*8*30,0);
    sumEl.textContent=`Monthly payroll: ${fmtFull(monthlyPayroll)} | ${STATE.business.employees.length} employees`;
  }
}

function hireEmployee(empIndex) {
  if (!STATE.business) return;
  const emp = STATE.empPool[empIndex];
  if (!emp) return;
  if (STATE.business.employees.some(e=>e.id===emp.id)) return;
  STATE.business.employees.push({...emp, hiredDay:STATE.simDay});
  buildEmpPool();
  updateVitalSigns();
}

function fireEmployee(empIndex) {
  if (!STATE.business) return;
  const emp = STATE.empPool[empIndex];
  if (!emp) return;
  STATE.business.employees = STATE.business.employees.filter(e=>e.id!==emp.id);
  buildEmpPool();
  updateVitalSigns();
}

function buildEqList() {
  if (!STATE.business) return;
  const btDef = BUSINESS_TYPES[STATE.business.typeId];
  const container = document.getElementById('eq-list');
  if (!container) return;
  container.innerHTML='';
  btDef.equipmentList.forEach(item=>{
    const owned = STATE.business.equipment.includes(item.id);
    const div=document.createElement('div');
    div.className='eq-item'+(owned?' owned':'');
    div.innerHTML=`<strong>${item.name}</strong><br>Cost: ${fmtFull(item.cost)} | Quality Impact: ${(item.qualityImpact*100).toFixed(0)}% ${item.required?'<em>(required)</em>':''}<br>
${owned?'<span class="owned-badge">Owned ✓</span>':`<button class="btn btn-sm btn-primary" onclick="buyEquipment('${item.id}')">Buy</button>`}`;
    container.appendChild(div);
  });
  const cashEl=document.getElementById('res-cash');
  if (cashEl) cashEl.textContent=`Business cash: ${fmtFull(STATE.business.cash)}`;
}

function buyEquipment(equipId) {
  if (!STATE.business) return;
  const btDef = BUSINESS_TYPES[STATE.business.typeId];
  const item = btDef.equipmentList.find(e=>e.id===equipId);
  if (!item) return;
  if (STATE.business.cash < item.cost) { showToast('Not enough business cash','err'); return; }
  STATE.business.cash -= item.cost;
  STATE.business.equipment.push(equipId);
  addJournal(`Purchased ${item.name} for ${fmtFull(item.cost)}`,'financial');
  buildEqList();
  updateVitalSigns();
  showToast(`${item.name} purchased!`);
}

// ─── FINANCE MODAL ────────────────────────────────────────────────────────────
function populateFinanceModal() {
  const avEl = document.getElementById('fin-available');
  if (avEl) avEl.textContent = fmtFull(STATE.personalCash);
  if (STATE.business) {
    const sumEl=document.getElementById('fin-summary');
    if (sumEl&&STATE.business.loan.amount>0) {
      sumEl.innerHTML=`Current loan: ${fmtFull(STATE.business.loan.balance)} remaining at ${(STATE.business.loan.rate*100).toFixed(1)}%`;
    }
  }
  updateFinPreview();
}

function updateFinPreview() {
  const loanEl=document.getElementById('fin-loan');
  const rateEl=document.getElementById('fin-rate');
  const termEl=document.getElementById('fin-term');
  const prevEl=document.getElementById('fin-preview');
  if (!loanEl||!rateEl||!termEl||!prevEl) return;
  const loan=parseFloat(loanEl.value)||0;
  const rate=parseFloat(rateEl.value)||0;
  const term=parseInt(termEl.value)||12;
  if (loan>0&&rate>0) {
    const r=rate/12;
    const pmt=loan*r/(1-Math.pow(1+r,-term));
    prevEl.textContent=`Monthly payment: ${fmtFull(pmt)} | Total interest: ${fmtFull(pmt*term-loan)}`;
  } else prevEl.textContent='';
}

// ─── PRICING MODAL ────────────────────────────────────────────────────────────
function populatePricingModal() {
  if (!STATE.business) return;
  const btDef = BUSINESS_TYPES[STATE.business.typeId];
  const minEl=document.getElementById('price-min');
  const maxEl=document.getElementById('price-max');
  const avgEl=document.getElementById('price-avg');
  const inp=document.getElementById('price-input');
  if (minEl) minEl.textContent=fmtFull(btDef.priceMin);
  if (maxEl) maxEl.textContent=fmtFull(btDef.priceMax);
  if (avgEl) avgEl.textContent=fmtFull(btDef.marketAveragePrice);
  if (inp) inp.value=STATE.business.price||btDef.priceDefault;
  updatePriceEffect();
}

function updatePriceEffect() {
  if (!STATE.business) return;
  const btDef=BUSINESS_TYPES[STATE.business.typeId];
  const inp=document.getElementById('price-input');
  const eff=document.getElementById('price-effect');
  if (!inp||!eff) return;
  const val=parseFloat(inp.value)||btDef.priceDefault;
  const ratio=val/btDef.marketAveragePrice;
  let pf;
  if (ratio<=0.8) pf=1.15;
  else if (ratio<=1.0) pf=1.0+(1-ratio)*0.75;
  else if (ratio<=1.3) pf=1.0-(ratio-1)*0.8;
  else pf=Math.max(0.1,1.0-(ratio-1)*1.5);
  eff.textContent=`Demand factor: ${(pf*100).toFixed(0)}% of baseline`;
}

// ─── MARKETING MODAL ─────────────────────────────────────────────────────────
function populateMarketingModal() {
  if (!STATE.business) return;
  const budEl=document.getElementById('mkt-budget');
  if (budEl) budEl.value=STATE.business.marketing.budget;
  ['social','online','local','events'].forEach(ch=>{
    const el=document.getElementById('mkt-'+ch);
    if (el) el.checked=STATE.business.marketing.channels.includes(ch);
  });
  updateMktPreview();
}

function updateMktPreview() {
  const budEl=document.getElementById('mkt-budget');
  const prevEl=document.getElementById('mkt-preview');
  if (!budEl||!prevEl) return;
  const budget=parseFloat(budEl.value)||0;
  const channels=['social','online','local','events'].filter(ch=>{
    const el=document.getElementById('mkt-'+ch); return el&&el.checked;
  });
  const score=Math.min(1,(budget/1500)*(0.5+channels.length*0.125));
  prevEl.textContent=`Marketing reach: ${(score*100).toFixed(0)}% of max | Demand boost: ~${((score*0.5)*100).toFixed(0)}%`;
}

// ─── OPERATIONS MODAL ────────────────────────────────────────────────────────
function populateOpsModal() {
  if (!STATE.business) return;
  const qEl=document.getElementById('ops-quality');
  const eEl=document.getElementById('ops-efficiency');
  if (qEl) qEl.value=STATE.business.operations.qualityLevel;
  if (eEl) eEl.value=STATE.business.operations.efficiencyLevel;
}

// ─── INSURANCE MODAL ─────────────────────────────────────────────────────────
function populateInsuranceModal() {
  if (!STATE.business) return;
  const ins=STATE.business.insurance;
  ['liability','property','workers','business'].forEach(t=>{
    const el=document.getElementById('ins-'+t);
    if (el) el.checked=ins[t];
  });
  updateInsTotal();
}

function updateInsTotal() {
  const types=['liability','property','workers','business'];
  const costs={liability:150,property:120,workers:200,business:80};
  let total=0;
  types.forEach(t=>{
    const el=document.getElementById('ins-'+t);
    if (el&&el.checked) total+=costs[t];
  });
  const el=document.getElementById('ins-total');
  if (el) el.textContent=`Monthly insurance cost: ${fmtFull(total)}`;
}

// ─── TRANSFER MODAL ───────────────────────────────────────────────────────────
function populateTransferModal() {
  const bizEl=document.getElementById('transfer-biz-cash');
  const el=document.getElementById('transfer-amount');
  if (STATE.business) {
    if (bizEl) bizEl.textContent=fmtFull(STATE.business.cash);
    if (el) el.max=Math.max(0,STATE.business.cash);
  }
}

// ─── INVEST MODAL ─────────────────────────────────────────────────────────────
function populateInvestModal() {
  const el=document.getElementById('inv-available');
  if (el) el.textContent=fmtFull(STATE.personalCash);
  const sEl=document.getElementById('inv-savings-cur');
  const stEl=document.getElementById('inv-stocks-cur');
  if (sEl) sEl.textContent=fmtFull(STATE.personalInvested.savings);
  if (stEl) stEl.textContent=fmtFull(STATE.personalInvested.stocks);
}

// ─── CLOSE MODAL ─────────────────────────────────────────────────────────────
function populateCloseModal() {
  if (!STATE.business) return;
  const btDef=BUSINESS_TYPES[STATE.business.typeId];
  const equipVal=STATE.business.equipment.reduce((s,id)=>{
    const eq=btDef.equipmentList.find(e=>e.id===id); return s+(eq?eq.cost*0.6:0);
  },0);
  const net=STATE.business.cash+equipVal-STATE.business.loan.balance;
  const el=document.getElementById('close-summary');
  if (el) el.innerHTML=`Business Cash: ${fmtFull(STATE.business.cash)}<br>Equipment Value (60%): ${fmtFull(equipVal)}<br>Loan Balance: -${fmtFull(STATE.business.loan.balance)}<br><strong>Net Proceeds: ${fmtFull(net)}</strong>`;
}

// ─── ACTION HANDLERS ──────────────────────────────────────────────────────────
function formBusiness() {
  if (!selectedBType) { showToast('Select a business type','err'); return; }
  const nameEl=document.getElementById('biz-name-input');
  const legalEl=document.getElementById('biz-legal');
  const name=(nameEl?nameEl.value:'').trim();
  if (name.length<2) { showToast('Enter a business name (min 2 chars)','err'); return; }
  const legal=legalEl?legalEl.value:'Sole Proprietor';
  STATE.business = {
    typeId:selectedBType, name, legalStructure:legal,
    locationId:null, personalInvestment:0,
    loan:{amount:0,rate:0,termMonths:0,monthlyPayment:0,balance:0},
    cash:0, employees:[], equipment:[],
    hours:{Mon:[9,21],Tue:[9,21],Wed:[9,21],Thu:[9,21],Fri:[9,21],Sat:[10,20],Sun:null},
    price:BUSINESS_TYPES[selectedBType].priceDefault,
    marketing:{budget:0,channels:[]},
    operations:{qualityLevel:3,efficiencyLevel:3},
    insurance:{liability:false,property:false,workers:false,business:false},
    totalRevenue:0, totalExpenses:0, totalProfit:0, totalCustomers:0
  };
  STATE.empPool=[];
  addJournal(`Formed ${name} as a ${legal}`,'action');
  showToast('Business formed! Now locate it.');
  closeModal('modal-form');
  drawCanvas();
  updateVitalSigns();
}

function locateBusiness() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  if (selectedLocId===null) { showToast('Select an available location','err'); return; }
  const loc=LOCATIONS[selectedLocId];
  if (loc.takenByCompetitor) { showToast('That location is taken','err'); return; }
  STATE.business.locationId=selectedLocId;
  addJournal(`Located at ${loc.name} — rent ${fmtFull(loc.monthlyRent)}/mo`,'action');
  showToast(`Location secured! Monthly rent: ${fmtFull(loc.monthlyRent)}`);
  closeModal('modal-locate');
  drawCanvas();
  updateVitalSigns();
}

function applyFinancing() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  const personal=parseFloat(document.getElementById('fin-personal')?.value)||0;
  const loan=parseFloat(document.getElementById('fin-loan')?.value)||0;
  const rate=parseFloat(document.getElementById('fin-rate')?.value)||0;
  const term=parseInt(document.getElementById('fin-term')?.value)||12;
  if (personal>STATE.personalCash) { showToast('Not enough personal cash','err'); return; }
  if (personal+loan<=0) { showToast('Enter an investment amount','err'); return; }
  const monthlyPayment = loan>0 ? loan*(rate/12)/(1-Math.pow(1+rate/12,-term)) : 0;
  STATE.personalCash-=personal;
  STATE.business.personalInvestment+=personal;
  STATE.business.cash+=personal+loan;
  if (loan>0) STATE.business.loan={amount:loan,rate,termMonths:term,monthlyPayment,balance:loan};
  addJournal(`Invested ${fmtFull(personal)} personally; borrowed ${fmtFull(loan)} at ${(rate*100).toFixed(1)}%`,'financial');
  showToast('Financing applied!');
  closeModal('modal-finance');
  updateVitalSigns();
}

function saveHours() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const hours={};
  days.forEach(day=>{
    const chk=document.querySelector(`.hours-check[data-day="${day}"]`);
    const open=document.querySelector(`.hours-open[data-day="${day}"]`);
    const close=document.querySelector(`.hours-close[data-day="${day}"]`);
    if (chk&&chk.checked&&open&&close) hours[day]=[parseInt(open.value),parseInt(close.value)];
    else hours[day]=null;
  });
  STATE.business.hours=hours;
  addJournal('Updated business hours','action');
  showToast('Hours saved!');
  closeModal('modal-hours');
}

function savePricing() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  const btDef=BUSINESS_TYPES[STATE.business.typeId];
  const val=parseFloat(document.getElementById('price-input')?.value);
  if (isNaN(val)||val<btDef.priceMin||val>btDef.priceMax) {
    showToast(`Price must be between ${fmtFull(btDef.priceMin)} and ${fmtFull(btDef.priceMax)}`,'err'); return;
  }
  STATE.business.price=val;
  addJournal(`Set price to ${fmtFull(val)}`,'action');
  showToast('Price saved!');
  closeModal('modal-pricing');
}

function saveMarketing() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  const budget=parseFloat(document.getElementById('mkt-budget')?.value)||0;
  const channels=['social','online','local','events'].filter(ch=>{
    const el=document.getElementById('mkt-'+ch); return el&&el.checked;
  });
  STATE.business.marketing={budget,channels};
  addJournal(`Set marketing budget ${fmtFull(budget)}/mo with ${channels.length} channels`,'action');
  closeModal('modal-marketing');
  showToast('Marketing saved!');
}

function saveOperations() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  const q=parseInt(document.getElementById('ops-quality')?.value)||3;
  const e=parseInt(document.getElementById('ops-efficiency')?.value)||3;
  STATE.business.operations={qualityLevel:q,efficiencyLevel:e};
  addJournal(`Operations: quality ${q}/5, efficiency ${e}/5`,'action');
  closeModal('modal-operations');
  showToast('Operations saved!');
}

function saveInsurance() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  STATE.business.insurance={
    liability:document.getElementById('ins-liability')?.checked||false,
    property:document.getElementById('ins-property')?.checked||false,
    workers:document.getElementById('ins-workers')?.checked||false,
    business:document.getElementById('ins-business')?.checked||false
  };
  addJournal('Updated insurance coverage','action');
  closeModal('modal-insurance');
  showToast('Insurance saved!');
}

function conductSurvey() {
  if (!STATE.business) { showToast('Form a business first','err'); return; }
  if (STATE.business.cash<250) { showToast('Need $250 in business cash','err'); return; }
  STATE.business.cash-=250;
  const topicEl=document.getElementById('survey-topic');
  const topic=topicEl?topicEl.value:'General Satisfaction';
  const results={
    satisfaction: Math.round(3+Math.random()*7),
    price: Math.round(3+Math.random()*7),
    quality: Math.round(3+Math.random()*7),
    location: Math.round(3+Math.random()*7),
    recommend: Math.round(3+Math.random()*7)
  };
  STATE.surveys.push({topic,day:STATE.simDay,results});
  addJournal(`Customer survey conducted: "${topic}"`,'action');
  showToast('Survey complete! Check survey results.');
  closeModal('modal-survey-new');
  updateVitalSigns();
}

function transferFunds() {
  if (!STATE.business) { showToast('No business','err'); return; }
  const amt=parseFloat(document.getElementById('transfer-amount')?.value)||0;
  if (amt>STATE.business.cash) { showToast('Not enough business cash','err'); return; }
  if (amt<=0) { showToast('Enter an amount','err'); return; }
  const netAmount=amt*0.75;
  STATE.business.cash-=amt;
  STATE.personalCash+=netAmount;
  addJournal(`Transferred ${fmtFull(amt)} from business (${fmtFull(netAmount)} after 25% tax)`,'financial');
  showToast(`${fmtFull(netAmount)} added to personal cash.`);
  closeModal('modal-transfer');
  updateVitalSigns();
}

function saveInvesting() {
  const savings=parseFloat(document.getElementById('inv-savings')?.value)||0;
  const stocks=parseFloat(document.getElementById('inv-stocks')?.value)||0;
  if (savings+stocks>STATE.personalCash) { showToast('Not enough personal cash','err'); return; }
  STATE.personalCash-=(savings+stocks);
  STATE.personalInvested.savings+=savings;
  STATE.personalInvested.stocks+=stocks;
  addJournal(`Invested ${fmtFull(savings)} in savings, ${fmtFull(stocks)} in stocks`,'financial');
  closeModal('modal-invest');
  updateVitalSigns();
  showToast('Investment saved!');
}

function closeBusiness() {
  if (!STATE.business) return;
  const btDef=BUSINESS_TYPES[STATE.business.typeId];
  const equipVal=STATE.business.equipment.reduce((s,id)=>{
    const eq=btDef.equipmentList.find(e=>e.id===id); return s+(eq?eq.cost*0.6:0);
  },0);
  const net=STATE.business.cash+equipVal-STATE.business.loan.balance;
  STATE.personalCash+=Math.max(0,net);
  addJournal(`Closed ${STATE.business.name}. Received ${fmtFull(Math.max(0,net))}`,'financial');
  STATE.business=null; STATE.empPool=[];
  closeModal('modal-close');
  drawCanvas();
  updateVitalSigns();
  showToast('Business closed.');
}

// ─── SIM CONTROL ──────────────────────────────────────────────────────────────
function toggleSim() {
  STATE.running ? stopSim() : startSim();
}

function startSim() {
  if (!STATE.business) { showToast('Form a business first!','wrn'); return; }
  if (STATE.business.locationId===null) { showToast('Locate your business first!','wrn'); return; }
  if (STATE.business.cash<=0 && STATE.business.personalInvestment<=0) {
    showToast('Add financing to your business first!','wrn'); return;
  }
  STATE.running=true;
  const ssIcon=document.getElementById('ss-icon');
  const ssText=document.getElementById('ss-text');
  const btn=document.getElementById('start-stop-button');
  const phase=document.getElementById('phase-display');
  if (ssIcon) ssIcon.textContent='⏸';
  if (ssText) ssText.textContent='Stop';
  if (btn) btn.classList.add('running');
  if (phase) phase.textContent='Running...';
  const interval=Math.max(50,Math.round(1000/STATE.speed));
  STATE.simTimer=setInterval(advanceDay,interval);
}

function stopSim() {
  clearInterval(STATE.simTimer); STATE.simTimer=null; STATE.running=false;
  const ssIcon=document.getElementById('ss-icon');
  const ssText=document.getElementById('ss-text');
  const btn=document.getElementById('start-stop-button');
  const phase=document.getElementById('phase-display');
  if (ssIcon) ssIcon.textContent='▶';
  if (ssText) ssText.textContent='Start';
  if (btn) btn.classList.remove('running');
  if (phase) phase.textContent='Paused';
}

function setSpeed(val) {
  STATE.speed=parseInt(val);
  const el=document.getElementById('speed-value');
  if (el) el.textContent=val;
  if (STATE.running) { stopSim(); startSim(); }
}

function advanceDay() {
  STATE.simDay++;
  if (STATE.simDay>STATE.totalSimDays) { stopSim(); endGame(); return; }
  const result=calcDailyFinancials();
  STATE.dailyHistory.push({day:STATE.simDay,...result});
  if (STATE.running && STATE.simDay%3===0) { spawnParticle(); if(Math.random()<0.5) spawnParticle(); }
  if (STATE.simDay%30===0) {
    STATE.personalInvested.savings*=1+(0.045/12);
    STATE.personalInvested.stocks*=1+((Math.random()*0.20-0.05)/12);
  }
  if (STATE.simDay%30===1) addAdvisorMessage();
  updateVitalSigns();
}

function runTo() {
  const target=parseInt(document.getElementById('runto-day')?.value);
  if (isNaN(target)||target<=STATE.simDay||target>182) { showToast('Invalid day','err'); return; }
  stopSim();
  while (STATE.simDay<target) {
    STATE.simDay++;
    const r=calcDailyFinancials();
    STATE.dailyHistory.push({day:STATE.simDay,...r});
    if (STATE.simDay%30===0) {
      STATE.personalInvested.savings*=1+(0.045/12);
      STATE.personalInvested.stocks*=1+((Math.random()*0.20-0.05)/12);
    }
    if (STATE.simDay%30===1) addAdvisorMessage();
  }
  updateVitalSigns(); drawCanvas(); closeModal('modal-runto');
  showToast(`Advanced to Day ${STATE.simDay}`);
}

function provideCash() {
  const amt=parseFloat(document.getElementById('cash-amount')?.value)||0;
  if (amt<=0) { showToast('Enter a positive amount','err'); return; }
  STATE.personalCash+=amt;
  addJournal(`Teacher provided ${fmtFull(amt)} cash`,'action');
  updateVitalSigns(); closeModal('modal-cash'); showToast('Cash added!');
}

function confirmRestart() {
  if (confirm('Restart the simulation? All progress will be lost.')) resetGame();
}

function resetGame() {
  stopSim();
  STATE.simDay=1; STATE.running=false; STATE.personalCash=15000; STATE.business=null;
  STATE.journal=[]; STATE.messages=[]; STATE.surveys=[]; STATE.dailyHistory=[];
  STATE.personalInvested={savings:0,stocks:0}; STATE.empPool=[];
  selectedBType=null; selectedLocId=null;
  localStorage.removeItem('deca-vbc-save');
  updateVitalSigns(); drawCanvas(); showToast('Lesson restarted');
  const phase=document.getElementById('phase-display');
  if (phase) phase.textContent='Setup Phase';
}

// ─── SAVE / LOAD ──────────────────────────────────────────────────────────────
function saveGame() {
  try {
    const save={...STATE, simTimer:null};
    localStorage.setItem('deca-vbc-save',JSON.stringify(save));
  } catch(e) { /* quota */ }
}

function loadGame() {
  try {
    const raw=localStorage.getItem('deca-vbc-save');
    if (!raw) return;
    const save=JSON.parse(raw);
    STATE.simDay=save.simDay||1;
    STATE.personalCash=save.personalCash||15000;
    STATE.business=save.business||null;
    STATE.journal=save.journal||[];
    STATE.messages=save.messages||[];
    STATE.surveys=save.surveys||[];
    STATE.dailyHistory=save.dailyHistory||[];
    STATE.personalInvested=save.personalInvested||{savings:0,stocks:0};
    STATE.empPool=save.empPool||[];
    STATE.speed=save.speed||3;
    const speedEl=document.getElementById('speed-value');
    if (speedEl) speedEl.textContent=STATE.speed;
    const slider=document.getElementById('speed-slider');
    if (slider) slider.value=STATE.speed;
  } catch(e) { /* corrupt save */ }
}

function endGame() {
  const score=calcScore(); const nw=calcNetWorth();
  try {
    let scores=JSON.parse(localStorage.getItem('deca-vbc-scores')||'[]');
    scores.push({name:STATE.business?.name||'Unknown',netWorth:nw,score,date:new Date().toLocaleDateString()});
    localStorage.setItem('deca-vbc-scores',JSON.stringify(scores));
  } catch(e){}
  saveGame();
  const phase=document.getElementById('phase-display');
  if (phase) phase.textContent='Completed';
  alert(`Simulation complete!\nNet Worth: ${fmtFull(nw)}\nScore: ${score}/100`);
}

// ─── REPORT RENDERERS ─────────────────────────────────────────────────────────
function renderDashboard() {
  const el=document.getElementById('dashboard-body');
  if (!el) return;
  const b=STATE.business;
  const nw=calcNetWorth();
  const score=calcScore();
  const pct=Math.min(100,(nw/STATE.goalNetWorth)*100).toFixed(1);
  const last7=STATE.dailyHistory.slice(-7);
  const avgRev=b&&STATE.simDay>1?b.totalRevenue/Math.max(1,STATE.simDay):0;

  el.innerHTML=`<div class="dashboard-grid">
<div class="dash-card"><div class="dash-label">Net Worth</div><div class="dash-val ${nw<0?'neg':'warn'}">${fmtFull(nw)}</div></div>
<div class="dash-card"><div class="dash-label">Total Profit</div><div class="dash-val ${(b?.totalProfit||0)<0?'neg':''}">${fmtFull(b?.totalProfit||0)}</div></div>
<div class="dash-card"><div class="dash-label">Score</div><div class="dash-val">${score}/100</div></div>
<div class="dash-card"><div class="dash-label">Days Remaining</div><div class="dash-val">${STATE.totalSimDays-STATE.simDay}</div></div>
<div class="dash-card"><div class="dash-label">Total Customers</div><div class="dash-val">${(b?.totalCustomers||0).toLocaleString()}</div></div>
<div class="dash-card"><div class="dash-label">Avg Daily Revenue</div><div class="dash-val">${fmtFull(avgRev)}</div></div>
</div>
<div class="goal-bar-wrap"><div class="goal-bar-label">Goal Progress: ${pct}% of ${fmtFull(STATE.goalNetWorth)}</div>
<div class="goal-bar-outer"><div class="goal-bar-inner" style="width:${Math.min(100,parseFloat(pct))}%"></div></div></div>
<h4>Last 7 Days</h4>
<table class="report-table"><tr><th>Day</th><th>Revenue</th><th>Profit</th><th>Customers</th></tr>
${last7.map(d=>`<tr><td>Day ${d.day} (${getDayName(d.day)})</td><td>${fmtFull(d.revenue)}</td><td class="${d.profit<0?'neg':''}">${fmtFull(d.profit)}</td><td>${d.customers}</td></tr>`).join('')}
</table>`;
}

function renderIncomeStatement() {
  const el=document.getElementById('income-body');
  if (!el) return;
  const b=STATE.business;
  if (!b) { el.innerHTML='<p>No active business.</p>'; return; }
  const allTime=STATE.dailyHistory;
  const month=allTime.slice(-30);
  const sum=(arr,key)=>arr.reduce((s,d)=>s+(d[key]||0),0);

  const mRev=sum(month,'revenue'), mCogs=sum(month,'cogs'), mGP=sum(month,'grossProfit');
  const mExp=sum(month,'expenses'), mNet=sum(month,'profit');
  const aRev=b.totalRevenue, aCogs=aRev*BUSINESS_TYPES[b.typeId].cogsRatio;
  const aGP=aRev-aCogs, aExp=b.totalExpenses, aNet=b.totalProfit;

  const row=(label,m,a,bold=false)=>`<tr class="${bold?'total-row':''}"><td>${label}</td><td class="${m<0?'neg':''}">${fmtFull(m)}</td><td class="${a<0?'neg':''}">${fmtFull(a)}</td></tr>`;

  el.innerHTML=`<table class="report-table">
<tr><th>Item</th><th>Last 30 Days</th><th>All Time</th></tr>
${row('Revenue',mRev,aRev)}
${row('COGS (−)',mCogs,aCogs)}
${row('Gross Profit (=)',mGP,aGP,true)}
${row('Rent',mExp*0.25,aExp*0.25)}
${row('Payroll',mExp*0.40,aExp*0.40)}
${row('Marketing',mExp*0.10,aExp*0.10)}
${row('Utilities',mExp*0.08,aExp*0.08)}
${row('Insurance',mExp*0.05,aExp*0.05)}
${row('Operations',mExp*0.07,aExp*0.07)}
${row('Loan Payments',mExp*0.05,aExp*0.05)}
${row('Total Expenses (=)',mExp,aExp,true)}
${row('Net Income (=)',mNet,aNet,true)}
</table>`;
}

function renderBalanceSheet() {
  const el=document.getElementById('balance-body');
  if (!el) return;
  const b=STATE.business;
  const btDef=b?BUSINESS_TYPES[b.typeId]:null;
  const equipVal=b?b.equipment.reduce((s,id)=>{const eq=btDef.equipmentList.find(e=>e.id===id);return s+(eq?eq.cost*0.6:0);},0):0;
  const bizCash=b?b.cash:0;
  const loanBal=b?b.loan.balance:0;
  const totalAssets=bizCash+equipVal+STATE.personalCash+STATE.personalInvested.savings+STATE.personalInvested.stocks;
  const totalLiabilities=loanBal;
  const equity=b?b.personalInvestment+b.totalProfit:STATE.personalCash;

  el.innerHTML=`<table class="report-table">
<tr><th colspan="2">ASSETS</th></tr>
<tr><td>Business Cash</td><td>${fmtFull(bizCash)}</td></tr>
<tr><td>Equipment (book value 60%)</td><td>${fmtFull(equipVal)}</td></tr>
<tr><td>Personal Cash</td><td>${fmtFull(STATE.personalCash)}</td></tr>
<tr><td>Savings Account</td><td>${fmtFull(STATE.personalInvested.savings)}</td></tr>
<tr><td>Stock Portfolio</td><td>${fmtFull(STATE.personalInvested.stocks)}</td></tr>
<tr class="total-row"><td>Total Assets</td><td>${fmtFull(totalAssets)}</td></tr>
<tr><th colspan="2">LIABILITIES</th></tr>
<tr><td>Loan Balance</td><td>${fmtFull(loanBal)}</td></tr>
<tr class="total-row"><td>Total Liabilities</td><td>${fmtFull(totalLiabilities)}</td></tr>
<tr><th colspan="2">EQUITY</th></tr>
<tr><td>Personal Investment + Retained Earnings</td><td>${fmtFull(equity)}</td></tr>
<tr class="total-row"><td>Total L + E</td><td>${fmtFull(totalLiabilities+equity)}</td></tr>
</table>`;
}

function renderSalesReport() {
  const el=document.getElementById('sales-body');
  if (!el) return;
  const rows=STATE.dailyHistory.slice(-14);
  if (!rows.length) { el.innerHTML='<p>No sales data yet.</p>'; return; }
  const totR=rows.reduce((s,d)=>s+d.revenue,0);
  const totP=rows.reduce((s,d)=>s+d.profit,0);
  const totC=rows.reduce((s,d)=>s+d.customers,0);
  el.innerHTML=`<table class="report-table">
<tr><th>Day</th><th>Weekday</th><th>Revenue</th><th>Customers</th><th>Avg Txn</th><th>Profit</th></tr>
${rows.map(d=>{const avg=d.customers>0?d.revenue/d.customers:0;return`<tr><td>${d.day}</td><td>${getDayName(d.day)}</td><td>${fmtFull(d.revenue)}</td><td>${d.customers}</td><td>${fmtFull(avg)}</td><td class="${d.profit<0?'neg':''}">${fmtFull(d.profit)}</td></tr>`;}).join('')}
<tr class="total-row"><td colspan="2">Total</td><td>${fmtFull(totR)}</td><td>${totC}</td><td>${fmtFull(totC>0?totR/totC:0)}</td><td class="${totP<0?'neg':''}">${fmtFull(totP)}</td></tr>
</table>`;
}

function renderBacklogReport() {
  const el=document.getElementById('backlog-body');
  if (!el) return;
  const b=STATE.business;
  if (!b) { el.innerHTML='<p>No active business.</p>'; return; }
  const btDef=BUSINESS_TYPES[b.typeId];
  const serviceTypes=['plumbing','electrical','physicalTherapy','catering','autoRepair'];
  if (serviceTypes.includes(b.typeId)) {
    const jobs=Array.from({length:3+Math.floor(Math.random()*5)},(_,i)=>({
      desc:`${btDef.name} job #${STATE.simDay*10+i}`,
      value:(btDef.marketAveragePrice*0.8+Math.random()*btDef.marketAveragePrice*0.4).toFixed(0),
      daysInQueue:1+Math.floor(Math.random()*5)
    }));
    el.innerHTML=`<h4>Pending Jobs (${jobs.length})</h4><table class="report-table">
<tr><th>Job</th><th>Est. Value</th><th>Days Waiting</th></tr>
${jobs.map(j=>`<tr><td>${j.desc}</td><td>${fmtFull(j.value)}</td><td>${j.daysInQueue}</td></tr>`).join('')}
</table>`;
  } else {
    const stock=Math.round(20+Math.random()*80);
    const reorder=20;
    const days=(stock/Math.max(1,btDef.baseDemandPerHour*8)).toFixed(1);
    el.innerHTML=`<table class="report-table">
<tr><th>Item</th><th>Value</th></tr>
<tr><td>Current Inventory Level</td><td>${stock} units</td></tr>
<tr><td>Reorder Point</td><td>${reorder} units</td></tr>
<tr><td>Days of Stock Remaining</td><td>${days} days</td></tr>
<tr><td>Status</td><td>${stock<=reorder?'<span class="warn">⚠ Reorder Now</span>':'OK'}</td></tr>
</table>`;
  }
}

function renderPersonalSummary() {
  const el=document.getElementById('personal-body');
  if (!el) return;
  const b=STATE.business;
  const btDef=b?BUSINESS_TYPES[b.typeId]:null;
  const equipVal=b?b.equipment.reduce((s,id)=>{const eq=btDef.equipmentList.find(e=>e.id===id);return s+(eq?eq.cost*0.6:0);},0):0;
  const bizEquity=b?b.cash+equipVal-b.loan.balance:0;
  const nw=calcNetWorth();
  const score=calcScore();
  const pct=Math.min(100,(nw/STATE.goalNetWorth)*100).toFixed(1);
  el.innerHTML=`<table class="report-table">
<tr><td>Personal Cash</td><td>${fmtFull(STATE.personalCash)}</td></tr>
<tr><td>Business Equity</td><td class="${bizEquity<0?'neg':''}">${fmtFull(bizEquity)}</td></tr>
<tr><td>Savings Account</td><td>${fmtFull(STATE.personalInvested.savings)}</td></tr>
<tr><td>Stock Portfolio</td><td>${fmtFull(STATE.personalInvested.stocks)}</td></tr>
<tr class="total-row"><td>Total Net Worth</td><td class="${nw<0?'neg':''}">${fmtFull(nw)}</td></tr>
</table>
<p>Goal: ${fmtFull(STATE.goalNetWorth)} | Score: ${score}/100</p>
<div class="goal-bar-outer"><div class="goal-bar-inner" style="width:${Math.min(100,parseFloat(pct))}%"></div></div>
<p>${pct}% of goal achieved</p>`;
}

function renderCompetitorResearch() {
  const el=document.getElementById('comp-research-body');
  if (!el) return;
  const b=STATE.business;
  if (!b) { el.innerHTML='<p>Form a business to research competitors.</p>'; return; }
  const btDef=BUSINESS_TYPES[b.typeId];
  const names=['Metro '+btDef.name,'Premium '+btDef.name,'Budget '+btDef.name,'Express '+btDef.name];
  const rows=names.map((name,i)=>{
    const rev=(btDef.baseDemandPerHour*8*btDef.marketAveragePrice*(0.8+Math.random()*0.4)).toFixed(0);
    const price=(btDef.marketAveragePrice*(0.9+Math.random()*0.2)).toFixed(2);
    const quality=(5+Math.random()*4).toFixed(1);
    const threat=parseFloat(rev)>btDef.baseDemandPerHour*8*btDef.marketAveragePrice*1.1?'High':parseFloat(rev)>btDef.baseDemandPerHour*8*btDef.marketAveragePrice*0.9?'Medium':'Low';
    const loc=LOCATIONS[[3,7,11,14,18][i%5]];
    return {name,loc:loc.name,rev,price,quality,threat};
  });
  el.innerHTML=`<table class="report-table">
<tr><th>Competitor</th><th>Location</th><th>Est. Rev/Day</th><th>Price</th><th>Quality</th><th>Threat</th></tr>
${rows.map(r=>`<tr><td>${r.name}</td><td>${r.loc}</td><td>${fmtFull(r.rev)}</td><td>${fmtFull(r.price)}</td><td>${r.quality}/10</td><td>${r.threat}</td></tr>`).join('')}
</table>`;
}

function renderLocationResearch() {
  const el=document.getElementById('loc-research-body');
  if (!el) return;
  const b=STATE.business;
  el.innerHTML=`<table class="report-table">
<tr><th>Name</th><th>Zone</th><th>Traffic</th><th>Rent/mo</th><th>Status</th></tr>
${LOCATIONS.map(loc=>{
  const isMine=b&&b.locationId===loc.id;
  const status=isMine?'<span class="sel-badge">Yours</span>':loc.takenByCompetitor?'<span class="taken-badge">Taken</span>':'Available';
  return`<tr class="${isMine?'highlight':''}"><td>${loc.name}</td><td>${loc.zone}</td><td>${(loc.trafficMultiplier*100).toFixed(0)}%</td><td>${fmtFull(loc.monthlyRent)}</td><td>${status}</td></tr>`;
}).join('')}
</table>`;
}

function renderPriceResearch() {
  const el=document.getElementById('price-research-body');
  if (!el) return;
  const b=STATE.business;
  if (!b) { el.innerHTML='<p>Form a business to see pricing research.</p>'; return; }
  const btDef=BUSINESS_TYPES[b.typeId];
  const cur=b.price||btDef.priceDefault;
  const ratio=cur/btDef.marketAveragePrice;
  let pf;
  if (ratio<=0.8) pf=1.15; else if (ratio<=1.0) pf=1.0+(1-ratio)*0.75;
  else if (ratio<=1.3) pf=1.0-(ratio-1)*0.8; else pf=Math.max(0.1,1.0-(ratio-1)*1.5);
  el.innerHTML=`<table class="report-table">
<tr><td>Market Average Price</td><td>${fmtFull(btDef.marketAveragePrice)}</td></tr>
<tr><td>Competitor Price Range</td><td>${fmtFull(btDef.marketAveragePrice*0.85)} – ${fmtFull(btDef.marketAveragePrice*1.15)}</td></tr>
<tr><td>Your Current Price</td><td>${fmtFull(cur)}</td></tr>
<tr><td>Demand Impact</td><td>${(pf*100).toFixed(0)}% of baseline</td></tr>
<tr><td>Recommendation</td><td>${fmtFull(btDef.marketAveragePrice*0.90)} – ${fmtFull(btDef.marketAveragePrice*1.10)}</td></tr>
</table>`;
}

function renderJournal() {
  const el=document.getElementById('journal-list');
  if (!el) return;
  if (!STATE.journal.length) { el.innerHTML='<div class="info-box">No actions recorded yet.</div>'; return; }
  el.innerHTML=STATE.journal.map(j=>`<div class="jl-entry"><span class="jl-time">Day ${j.day}</span><span class="jl-text">${j.text}</span></div>`).join('');
}

function renderMessages() {
  const el=document.getElementById('msg-list');
  if (!el) return;
  if (!STATE.messages.length) { el.innerHTML='<div class="info-box">No messages yet.</div>'; return; }
  el.innerHTML=STATE.messages.map(m=>`<div class="msg-item"><strong>${m.from}</strong> <em>${m.date}</em><p>${m.body}</p></div>`).join('');
}

function renderScoreboard() {
  const el=document.getElementById('scoreboard-body');
  if (!el) return;
  let scores=[];
  try { scores=JSON.parse(localStorage.getItem('deca-vbc-scores')||'[]'); } catch(e){}
  scores.sort((a,b)=>b.netWorth-a.netWorth);
  const latest=scores[scores.length-1];
  if (!scores.length) { el.innerHTML='<div class="info-box">No scores yet. Complete the simulation to post a score.</div>'; return; }
  el.innerHTML=`<table class="report-table">
<tr><th>#</th><th>Business</th><th>Net Worth</th><th>Score</th><th>Date</th></tr>
${scores.map((s,i)=>`<tr class="${s===latest?'sb-me':''}"><td>${i+1}</td><td>${s.name}</td><td>${fmtFull(s.netWorth)}</td><td>${s.score}/100</td><td>${s.date}</td></tr>`).join('')}
</table>`;
}

function renderSurveyResults() {
  const el=document.getElementById('survey-results-body');
  if (!el) return;
  if (!STATE.surveys.length) { el.innerHTML='<div class="info-box">No surveys conducted yet.</div>'; return; }
  el.innerHTML=STATE.surveys.map(s=>`<div class="survey-result">
<h4>${s.topic} — Day ${s.day}</h4>
<table class="report-table">
<tr><th>Dimension</th><th>Score</th><th>Bar</th></tr>
${Object.entries(s.results).map(([k,v])=>`<tr><td>${k.charAt(0).toUpperCase()+k.slice(1)}</td><td>${v}/10</td><td><div class="mini-bar" style="width:${v*10}%"></div></td></tr>`).join('')}
</table></div>`).join('');
}

function renderHelpBot() {
  const el=document.getElementById('helpbot-body');
  if (!el) return;
  const faqs=[
    ['How do I maximize net worth?','Focus on a downtown or commercial location, hire quality employees (7+/10), price within 5-10% of market average, maintain a consistent $300-500/mo marketing budget with 2+ channels, and reinvest profits in equipment.'],
    ['Which business is best for beginners?','Coffee Shop (high volume, predictable demand) or Hair Salon (excellent margins, loyal repeat customers, very low COGS at 5%). Both have manageable startup costs.'],
    ['What is the best pricing strategy?','Stay within 90–110% of the market average price. Below 80% hurts margins; above 130% kills volume. The sweet spot is 95–105% — you keep both demand and margin high.'],
    ['How does employee quality affect revenue?','Higher quality employees (score 7+/10) boost your quality multiplier, which can add 20-40% more effective demand. The wait rating also improves, which shows in the vital signs panel.'],
    ['Is marketing worth it?','Yes. A budget of $500/mo with 2+ channels adds roughly 20-30% to demand. Spending $1,000-1,500/mo with 3-4 channels maxes out the marketing multiplier. Social media and online channels tend to have the broadest reach.'],
    ['How is my score calculated?','Score = (Net Worth ÷ $75,000) × 100, capped at 100. Net Worth = Personal Cash + Business Cash + Equipment Value (60%) − Loan Balance + Investments.']
  ];
  el.innerHTML=faqs.map(([q,a])=>`<div class="faq-item"><strong class="faq-q">${q}</strong><p class="faq-a">${a}</p></div>`).join('');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded',()=>{
  buildBTGrid();
  buildLocGrid();
  buildHoursTable();
  loadGame();
  updateVitalSigns();
  drawCanvas();
  startAnimLoop();

  document.addEventListener('click',e=>{
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
    }
  });

  ['fin-loan','fin-rate','fin-term'].forEach(id=>{
    document.getElementById(id)?.addEventListener('input',updateFinPreview);
  });
  document.getElementById('price-input')?.addEventListener('input',updatePriceEffect);
  ['mkt-budget','mkt-social','mkt-online','mkt-local','mkt-events'].forEach(id=>{
    document.getElementById(id)?.addEventListener('change',updateMktPreview);
  });
  ['liability','property','workers','business'].forEach(t=>{
    document.getElementById('ins-'+t)?.addEventListener('change',updateInsTotal);
  });

  setInterval(saveGame,120000);
});
