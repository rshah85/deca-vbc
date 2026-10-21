/* ==========================================================================
   config.js — tunable lesson parameters (edit freely; see README "Customizing")
   ========================================================================== */
globalThis.VBC_CONFIG = {
  lessonTitle: "DECA VBC: Entrepreneurship Track",
  goalDifficultyLevel: 3,        // 1 (easy) .. 5 (hard). Default 3, like the official lesson.
  simDays: 735,                  // [OBS] practice lesson runs Jun 30 2052 → Jul 5 2054
  startDate: [2052, 5, 30],      // [year, monthIndex, day]  (practice lesson showed "Jun 30 2052")
  startPersonalCash: 50000,      // [OBS] Savings showed $49,900 available after the $100 sole-prop setup fee
  gradeScale: 100,               // 100 or 300 (display only)
  maxTeamSize: 3,                // informational (DECA teams are 1-3 students)

  // Which options the lesson allows (the practice lesson greys the others out).
  enabledBusinesses: ['electrical', 'catering'],
  enabledForms: ['sole', 'partner'],

  // Net-worth goal by difficulty level. Grade = progress from start NW to this goal.
  // (recalibrated by test/calibrate.js; see README)
  goalNetWorthByLevel: { 1: 150000, 2: 250000, 3: 400000, 4: 600000, 5: 850000 },

  // Economy knobs
  passThruTaxRate: 0.18,         // sole prop / partnership: tax on positive monthly profit
  corpTaxRate: 0.21,             // corporation: tax on positive monthly profit
  dividendTaxRate: 0.15,         // corporation: tax on money paid out to the owner
  overdraftDailyRate: 0.0005,    // interest on negative business cash (per day)
  // Bank credit tiers. [OBS] High Risk $25,000 @20% and Moderate Risk $50,000 @15% (2-year terms).
  // The tiers above Moderate are [EST]: earned by a profitable track record.
  creditTiers: [
    { name: 'High Risk', amount: 25000, rate: 0.20 },
    { name: 'Moderate Risk', amount: 50000, rate: 0.15 },
    { name: 'Low Risk', amount: 150000, rate: 0.11 },
    { name: 'Very Low Risk', amount: 400000, rate: 0.08 }
  ],
  loanTermMonths: 24,            // [OBS]
  equityMinOperatingDays: 60,    // [EST] Equity / Venture Capital is greyed out until the business has a track record
  equipmentLifeMonths: 60,       // straight-line depreciation
  resaleFraction: 0.40,          // equipment resale value vs. book cost
  rentDepositWeeks: 2,           // security deposit, in weeks of rent

  // Rival teams on the local scoreboard
  rivalCount: 12,

  // Teacher / designer tools
  teacherCashLimit: 250000,      // max single "Provide Cash"
  designerMode: false
};
/* ==========================================================================
   data.js — business definitions (v2, rebuilt from the practice-lesson screenshots).

   SOURCE KEY  (what is observed vs. assumed — see README "Fidelity"):
     [OBS]  read directly from the practice-lesson screenshots
     [EST]  estimated by this project (not visible in the screenshots)

   Per business:
     products   [{name, low, med, high, share, hrs, req[], uses{}}]
                low/med/high  = Price Survey Report values            [OBS for 8 businesses, EST for the rest]
                share         = fraction of weekly revenue            [EST]
                hrs           = labor hours per unit (derived)        [EST]
     equip      durable equipment [{id,name,cost,req,quality}]
     supplies   consumable lots   [{id,name,lot}]  (cost per "Add Storage" lot)
     roles      job roles [{key,name,tier,wage,speed}] tier 2=senior, 1=mid, 0=junior
   Which businesses/ownership forms students may pick is set in config.js
   (enabledBusinesses / enabledForms) — the practice lesson greys the others out.
   ========================================================================== */
(function () {
  const SEASON = {
    flat: [1,1,1,1,1,1,1,1,1,1,1,1],
    summer: [.75,.78,.9,1,1.1,1.25,1.35,1.3,1.05,.9,.8,.75],
    winter: [1.2,1.15,1.05,.95,.9,.85,.82,.85,.95,1.05,1.15,1.25],
    holiday: [.8,.85,.9,.9,1.05,.9,.85,.9,.95,1.1,1.45,1.6],
    school: [.9,.9,.95,1,1,.8,.8,1.2,1.25,1.1,1,.9],
    lawn: [.4,.5,.8,1.2,1.4,1.4,1.3,1.3,1.15,.9,.5,.35],
    fitness: [1.4,1.2,1,.95,.9,.85,.8,.8,.95,1,.95,.9]
  };
  const DOW = { // Sun..Sat
    food: [.95,.85,.9,.95,1,1.2,1.15], fun: [1.3,.7,.7,.8,.9,1.4,1.6],
    work: [.2,1.2,1.2,1.15,1.15,1,.5], event: [1.5,.5,.6,.7,.9,1.8,1.9], even: [1,1,1,1,1,1,1]
  };
  const r2 = x => Math.round(x * 100) / 100;
  const X = (name, low, med, high, share, req) => ({ name, low, med, high, share, req: req || 'all' });          // exact survey prices
  const G = (name, med, share, req) => X(name, r2(med * 0.53), med, r2(med * 1.46), share, req);              // estimated spread (matches observed ratios)

  const RAW = [
    { key: 'smoothie', name: 'Smoothie Shop', kind: 'walkin', sqft: 1200, rev: 9000, build: 14000, cogs: .30, season: 'summer', dow: 'food', sens: 1, stars: 1, aud: 'young',
      roles: [['barista', 'Smoothie Maker', 1, 13, 1], ['lead', 'Shift Lead', 2, 16, 1.1]],
      products: [X('Chocolate Peanut Banana Smoothie', 3.41, 6.33, 9.24, .2), X('Banana Berry Smoothie', 3.53, 6.46, 9.39, .2), X('Caramel Macchiato Smoothie', 3.38, 6.14, 8.91, .2), X('Banana Orange Mango Smoothie', 3.58, 6.23, 8.89, .2), X('Strawberry Shortcake Smoothie', 3.24, 6.19, 9.15, .2)],
      equip: ['Blender Station', 'Premium Display & Fresh-Fruit Bar', 'Delivery Bike & Sidewalk Sign'], sup: ['Fruit & Produce', 'Cups, Lids & Add-ins'],
      desc: 'Fresh blended drinks for walk-in customers. Hot summers, slow winters.' },
    { key: 'pizza', name: 'Pizza Place', kind: 'walkin', sqft: 2500, rev: 16000, build: 28000, cogs: .32, season: 'flat', dow: 'food', sens: 1, stars: 2, aud: 'family',
      roles: [['cook', 'Pizza Cook', 1, 14, 1], ['counter', 'Counter Staff', 0, 11, .9], ['mgr', 'Manager', 2, 19, 1.1]],
      products: [X('Cheese Pizza', 7.12, 13.28, 19.44, .24), X('Pepperoni Pizza', 8.16, 14.84, 21.52, .26), X('Veggie Pizza', 7.43, 13.95, 20.47, .16), X('Meat Lovers Special Pizza', 10.88, 19.5, 28.12, .2), X('Hawaiian Special Pizza', 9.16, 16.89, 24.61, .14)],
      equip: ['Pizza Oven', 'Dough Sheeter & Walk-in Cooler', 'Delivery Scooter'], sup: ['Dough & Cheese', 'Toppings & Boxes'],
      desc: 'Dine-in and take-out pizza with steady demand and strong weekends.' },
    { key: 'plumbing', name: 'Plumbing Business', kind: 'appointment', sqft: 3000, rev: 15000, build: 22000, cogs: .18, season: 'flat', dow: 'work', sens: .4, stars: 2, aud: 'homeowner', needSenior: true,
      roles: [['master', 'Master Plumber', 2, 34, 1.2], ['journey', 'Journeyman Plumber', 1, 26, 1], ['app', 'Apprentice Plumber', 0, 16, .7]],
      products: [X('Repair of Leaky Pipe', 152, 268, 384, .12), X('Kitchen Sink Replacement', 357, 617, 877, .16), X('Clearing of Slow/Clogged Drain', 79, 143, 208, .08), X('Full Bathroom Remodel', 1113, 2186, 3260, .24), X('Plumbing Installation, New Home', 5188, 9016, 12845, .4)],
      equip: ['Service Van', 'Pipe Camera & Specialty Tools', 'Truck Lettering & Website'], sup: ['Pipe & Fittings', 'Fixtures & Supplies'],
      desc: 'Residential service calls kept in a backlog. Weekdays busiest.' },
    { key: 'electrical', name: 'Electrical Business', kind: 'appointment', sqft: 4000, rev: 18000, build: 24000, cogs: .2, season: 'flat', dow: 'work', sens: .4, stars: 2, aud: 'homeowner', needSenior: true, observedKit: true,
      roles: [['master', 'Master Electrician', 2, 34, 1.2], ['journey', 'Journeyman Electrician', 1, 26, 1], ['app', 'Apprentice Electrician', 0, 16, .7]],
      products: [X('Light/Switch Circuit Repair', 131, 243, 355, .12, [0, 1, 3]), X('Wiring for Full Kitchen Remodel', 1003, 1730, 2457, .33, [0, 2, 3]), X('Wiring Installation for New Home', 5543, 10351, 15160, .55, [0, 2, 3])],
      desc: 'Licensed electrical jobs with high ticket and long job times.' },
    { key: 'pt', name: 'Physical Therapy', kind: 'appointment', sqft: 3500, rev: 14000, build: 38000, cogs: .06, season: 'flat', dow: 'work', sens: .5, stars: 3, aud: 'professional', needSenior: true,
      roles: [['pt', 'Physical Therapist', 2, 38, 1.1], ['pta', 'PT Assistant', 1, 24, .9], ['aide', 'PT Aide', 0, 15, .7]],
      products: [X('Physical Therapy Evaluation', 81, 149, 216, .12), X('Movement/Strength PT Session', 42, 78, 113, .28), X('Balance Therapy Session', 46, 80, 114, .2), X('Electrostimulation PT Session', 33, 60, 87, .22), X('Hot/Cold Therapy Session', 21, 39, 57, .18)],
      equip: ['Treatment Tables', 'Therapy Equipment Suite', 'Referral Marketing Kit'], sup: ['Therapy Supplies'],
      desc: 'Appointment-based clinic; skilled (expensive) staff and strong repeat patients.' },
    { key: 'salon', name: 'Hair Salon', kind: 'appointment', sqft: 2000, rev: 9000, build: 16000, cogs: .12, season: 'flat', dow: 'event', sens: .8, stars: 1, aud: 'young',
      roles: [['stylist', 'Stylist', 1, 20, 1], ['senior', 'Senior Stylist', 2, 28, 1.15], ['assist', 'Salon Assistant', 0, 12, .8]],
      products: [X("Men's Hair Cut", 19, 35, 50, .2), X("Women's Hair Cut", 29, 58, 87, .26), X('Hair Texturing', 57, 100, 144, .14), X('Hair Coloring', 51, 87, 123, .24), X('Manicure/Pedicure', 25, 44, 63, .16)],
      equip: ['Styling Stations', 'Premium Color Bar', 'Booking App & Signage'], sup: ['Hair Care Products', 'Color & Nail Supplies'],
      desc: 'Booked cuts and color; Saturdays are huge.' },
    { key: 'auto', name: 'Auto Repair Shop', kind: 'appointment', sqft: 5000, rev: 20000, build: 40000, cogs: .35, season: 'flat', dow: 'work', sens: .7, stars: 3, aud: 'professional', needSenior: true,
      roles: [['master', 'Master Mechanic', 2, 30, 1.2], ['tech', 'Technician', 1, 22, 1], ['lube', 'Lube Technician', 0, 14, .8]],
      products: [X('Oil Change', 30, 58, 85, .12), X('4-Wheel Car Alignment', 70, 126, 182, .12), X('Automobile Heating & A/C Repair', 281, 492, 704, .2), X('Automobile Brake Service', 215, 395, 575, .22), X('Auto Transmission Replacement', 1898, 3218, 4539, .34)],
      equip: ['Vehicle Lift Bay', 'Diagnostic Computer', 'Tow Truck & Signage'], sup: ['Parts & Fluids', 'Brake & Transmission Parts'],
      desc: 'Repair jobs with parts costs. Needs lifts before you can open.' },
    { key: 'catering', name: 'Catering', kind: 'appointment', sqft: 3500, rev: 14000, build: 20000, cogs: .38, season: 'holiday', dow: 'event', sens: .2, stars: 2, aud: 'professional',
      roles: [['chef', 'Executive Chef', 2, 30, 1.1], ['cook', 'Catering Cook', 1, 18, 1], ['server', 'Server / Runner', 0, 12, .8]],
      products: [X('Company Lunch for 30 People', 233, 433, 633, .2), X('Social/School Dinner for 50 People', 632, 1210, 1789, .28), X('Corporate Banquet for 100 People', 1734, 3297, 4860, .26), X('Wedding for 150 People', 3428, 6445, 9461, .26)],
      equip: ['Commercial Kitchen Line', 'Chafing & Staging Equipment', 'Catering Van & Website'], sup: ['Food & Ingredients', 'Linens & Disposables'],
      desc: 'Event catering — weekends and holidays. Orders queue as bookings.' },
    { key: 'gifts', name: 'Online Gift Baskets', kind: 'online', sqft: 2500, rev: 8000, build: 9000, cogs: .45, season: 'holiday', dow: 'even', sens: .1, stars: 1, aud: 'family',
      roles: [['packer', 'Basket Packer', 1, 15, 1], ['lead', 'Fulfillment Lead', 2, 20, 1.1]],
      products: [G('Classic Gift Basket', 62, 1)], equip: ['Packing Station', 'Shrink-wrap & Label Printer', 'Online Store & Ad Pixel'], sup: ['Basket Goods', 'Packaging'], desc: 'E-commerce; location barely matters, advertising and holidays do.' },
    { key: 'trampoline', name: 'Trampoline Park', kind: 'walkin', sqft: 14000, rev: 40000, build: 65000, cogs: .08, season: 'winter', dow: 'fun', sens: 1, stars: 3, aud: 'family',
      roles: [['monitor', 'Floor Monitor', 1, 13, 1], ['mgr', 'Park Manager', 2, 22, 1.1]],
      products: [G('Open Jump (1 hour)', 22, 1)], equip: ['Trampoline Courts', 'Foam Pit & Ninja Course', 'Party Room & Signage'], sup: ['Grip Socks & Supplies'], desc: 'Big build-out, big weekends, indoor-season boost.' },
    { key: 'bowling', name: 'Bowling Alley', kind: 'walkin', sqft: 22000, rev: 45000, build: 85000, cogs: .06, season: 'winter', dow: 'fun', sens: 1, stars: 3, aud: 'family',
      roles: [['attendant', 'Lane Attendant', 1, 13, 1], ['mgr', 'Alley Manager', 2, 22, 1.1]],
      products: [G('Bowling Game (per person)', 16, 1)], equip: ['Bowling Lanes', 'Arcade & Snack Bar', 'League Night Marketing'], sup: ['Shoes, Wax & Snacks'], desc: 'Capital intensive entertainment venue with league nights.' },
    { key: 'fitness', name: 'Fitness Center', kind: 'walkin', sqft: 9000, rev: 30000, build: 60000, cogs: .04, season: 'fitness', dow: 'even', sens: .9, stars: 3, aud: 'young',
      roles: [['trainer', 'Personal Trainer', 2, 24, 1.1], ['desk', 'Front Desk', 1, 14, 1]],
      products: [G('Day Pass', 38, 1)], equip: ['Cardio & Weight Floor', 'Group Fitness Studio', 'Signage & Referral Program'], sup: ['Towels & Cleaning'], desc: 'Memberships priced per visit-equivalent; January rush.' },
    { key: 'coffee', name: 'Coffee Shop', kind: 'walkin', sqft: 1500, rev: 9000, build: 18000, cogs: .28, season: 'winter', dow: 'food', sens: 1, stars: 1, aud: 'professional',
      roles: [['barista', 'Barista', 1, 13, 1], ['lead', 'Shift Lead', 2, 16, 1.1]],
      products: [G('Latte', 5.5, 1)], equip: ['Espresso Machine', 'Pastry Case & Roaster', 'Drive-thru Sign / Mobile Order'], sup: ['Coffee & Milk', 'Cups & Pastries'], desc: 'High-volume low-ticket sales; morning rush.' },
    { key: 'icecream', name: 'Ice Cream Shop', kind: 'walkin', sqft: 1200, rev: 8000, build: 12000, cogs: .3, season: 'summer', dow: 'fun', sens: 1, stars: 1, aud: 'family',
      roles: [['scooper', 'Scooper', 1, 12, 1], ['lead', 'Shift Lead', 2, 15, 1.1]],
      products: [G('Two-Scoop Cone', 6, 1)], equip: ['Dipping Cabinet', 'Soft-Serve Machine', 'Ice-Cream Cart & Signage'], sup: ['Ice Cream & Toppings', 'Cones & Cups'], desc: 'Seasonal treat shop — summer is everything.' },
    { key: 'tshirt', name: 'T-Shirt Printing', kind: 'appointment', sqft: 2500, rev: 8000, build: 14000, cogs: .42, season: 'school', dow: 'work', sens: .4, stars: 1, aud: 'young',
      roles: [['printer', 'Print Technician', 1, 15, 1], ['designer', 'Designer', 2, 20, 1.1]],
      products: [G('Custom Team Shirts (order)', 85, 1)], equip: ['Screen-Print Press', 'Embroidery Machine', 'Online Design Tool & Booth'], sup: ['Blank Shirts', 'Inks & Transfers'], desc: 'Custom orders for teams and clubs; back-to-school rush.' },
    { key: 'burrito', name: 'Burrito Restaurant', kind: 'walkin', sqft: 2200, rev: 16000, build: 24000, cogs: .33, season: 'flat', dow: 'food', sens: 1, stars: 2, aud: 'young',
      roles: [['cook', 'Line Cook', 1, 13, 1], ['cashier', 'Cashier', 0, 11, .9], ['mgr', 'Manager', 2, 18, 1.1]],
      products: [G('Burrito', 11, 1)], equip: ['Cooking Line', 'Salsa Bar & Cooler', 'Catering Cart & Signage'], sup: ['Meats & Produce', 'Tortillas & Packaging'], desc: 'Fast-casual restaurant with lunch and dinner peaks.' },
    { key: 'lawn', name: 'Lawn Care Services', kind: 'appointment', sqft: 3000, rev: 9000, build: 15000, cogs: .1, season: 'lawn', dow: 'work', sens: .3, stars: 1, aud: 'homeowner',
      roles: [['tech', 'Lawn Technician', 1, 15, 1], ['crew', 'Crew Leader', 2, 20, 1.1]],
      products: [G('Weekly Lawn Service', 70, 1)], equip: ['Mowers & Trailer', 'Aerator & Spreader', 'Truck Wrap & Yard Signs'], sup: ['Fuel & Fertilizer'], desc: 'Seasonal route work: spring/summer heavy, winter dead.' },
    { key: 'dj', name: 'DJ Services', kind: 'appointment', sqft: 2500, rev: 6000, build: 12000, cogs: .08, season: 'summer', dow: 'event', sens: .2, stars: 2, aud: 'professional',
      roles: [['dj', 'DJ / Tech', 2, 22, 1.1], ['roadie', 'Roadie', 0, 12, .8]],
      products: [G('Event DJ Package', 650, 1)], equip: ['DJ Rig & Speakers', 'Lighting & Photo Booth', 'Wedding-Show Booth & Website'], sup: ['Cables & Consumables'], desc: 'Event bookings, mostly weekends; high margin, limited capacity.' },
    { key: 'batting', name: 'Batting Cages', kind: 'walkin', sqft: 6000, rev: 15000, build: 30000, cogs: .03, season: 'summer', dow: 'fun', sens: 1, stars: 2, aud: 'family',
      roles: [['attendant', 'Cage Attendant', 1, 12, 1], ['coach', 'Hitting Coach', 2, 22, 1.1]],
      products: [G('Cage Token (20 pitches)', 12, 1)], equip: ['Pitching Machines & Cages', 'Pro Machine & Radar Gun', 'Team-Package Marketing'], sup: ['Balls & Netting'], desc: 'Sports practice facility; spring/summer, evenings.' },
    { key: 'gokart', name: 'Go Kart Track', kind: 'walkin', sqft: 20000, rev: 35000, build: 75000, cogs: .1, season: 'summer', dow: 'fun', sens: 1, stars: 3, aud: 'family',
      roles: [['marshal', 'Track Marshal', 1, 13, 1], ['mgr', 'Track Manager', 2, 22, 1.1]],
      products: [G('Race (10 laps)', 18, 1)], equip: ['Kart Fleet', 'Timing System & Pit Lounge', 'Billboard & Group Packages'], sup: ['Fuel & Tires'], desc: 'Thrill attraction with large capital outlay and weather exposure.' }
  ];

  /* ---- builder: turn RAW rows into full definitions ---- */
  const BUSINESS_ROWS = RAW.map(b => {
    const roles = b.roles.map(([key, name, tier, wage, speed]) => ({ key, name, tier, wage, speed }));
    const senior = roles.filter(r => r.tier === 2).sort((a, c) => c.wage - a.wage)[0] || roles[0];
    const avgWage = (senior.wage + roles[0].wage) / 2;
    let equip;
    if (b.observedKit) { // [OBS] electrician equipment costs from the practice lesson
      equip = [{ id: 'truck', name: 'Electrician Truck', cost: 25000, req: 'all', quality: false }, { id: 'meter', name: 'Multimeter', cost: 500, req: 'some', quality: false }, { id: 'fish', name: 'Fish Tape', cost: 250, req: 'some', quality: false }, { id: 'tools', name: 'Assorted Tools', cost: 600, req: 'all', quality: false }];
    } else { // [EST]
      equip = b.equip.map((name, i) => ({ id: 'e' + i, name, cost: Math.round(b.build * [0.35, 0.15, 0.05][i] / 50) * 50, req: i === 0 ? 'all' : i === 1 ? 'top' : 'none', quality: i > 0 }));
    }
    let supplies;
    if (b.observedKit) { // [OBS] lot costs
      supplies = [{ id: 'wire', name: 'Wire', lot: 3600 }, { id: 'conduit', name: 'Conduit', lot: 2016 }, { id: 'outlets', name: 'Outlets/Switches', lot: 768 }, { id: 'breaker', name: 'Breaker Panels', lot: 2400 }, { id: 'fixtures', name: 'Light Fixtures', lot: 4800 }];
    } else { // [EST] ≈ 3 weeks of stock per lot
      const n = b.sup.length; supplies = b.sup.map((name, i) => ({ id: 's' + i, name, lot: Math.max(100, Math.round(b.cogs * b.rev * 3 / n / 50) * 50) }));
    }
    const sorted = b.products.map(p => p.med).sort((a, c) => a - c), medCut = sorted[Math.floor(sorted.length / 2)];
    const products = b.products.map((p, i) => {
      const hrs = Math.max(0.01, 0.28 * p.med / avgWage);                       // [EST] labor hours/unit ≈ 28% of price at average wage
      let req = p.req;
      if (req === 'all') req = equip.map((e, k) => e.req === 'all' || (e.req === 'top' && p.med >= medCut) ? k : -1).filter(k => k >= 0);
      const uses = {};
      if (b.observedKit) { // [EST] supply usage per job (lot fractions) sized to ≈20% COGS
        Object.assign(uses, [{ outlets: .01, fixtures: .008 }, { wire: .04, conduit: .03, breaker: .03, fixtures: .01, outlets: .03 }, { wire: .25, conduit: .2, breaker: .2, fixtures: .1, outlets: .25 }][i]);
      } else supplies.forEach(s => uses[s.id] = (b.cogs * p.med / supplies.length) / s.lot);
      return { key: 'p' + i, name: p.name, low: p.low, med: p.med, high: p.high, share: p.share, hrs, req, uses, perDay: (b.rev / 7) * p.share / p.med };
    });
    return Object.assign({}, b, {
      roles, products, equip, supplies, ticket: products.reduce((s, p) => s + p.med * p.share, 0), seasonName: b.season,
      season: SEASON[b.season], dowName: b.dow, dow: DOW[b.dow], size: b.sqft / 3000, role: senior.name,
      observedPrices: b.products.length > 1 || !!b.observedKit      // true for the 8 businesses whose Price Survey was visible
    });
  });

  const FORMS = { // [OBS] from the "Form New Business" screen
    sole:    { name: 'Sole Proprietorship', owners: '1', liability: 'High', capital: 'Low', taxes: 'Pass-Thru', fee: 100, capMult: 0.8, lossMult: 1.0, investors: false },
    partner: { name: 'Partnership', owners: '2 to many', liability: 'Low', capital: 'Medium', taxes: 'Pass-Thru', fee: 1000, capMult: 1.2, lossMult: 0.6, investors: true },
    corp:    { name: 'Corporation', owners: '1 to millions', liability: 'Low', capital: 'Medium to High', taxes: 'Corp & Dividend', fee: 3000, capMult: 1.6, lossMult: 0.6, investors: true }
  };

  const SURNAMES = ['Obert', 'Sacco', 'Costa', 'Beane', 'Kamal', 'Josh', 'Syed', 'Bart', 'Francis', 'Mendez', 'Park', 'Dolan', 'Ruiz', 'Hale', 'Ibarra', 'Novak'];
  const FIRST = ['Alex','Jordan','Priya','Mateo','Sofia','Liam','Aaliyah','Noah','Mei','Omar','Grace','Diego','Hannah','Ethan','Zara','Kai','Luca','Nia','Ravi','Tessa','Marcus','Ines','Jun','Carla'];
  const LAST = ['Rivera','Patel','Kim','Johnson','Nguyen','Garcia','Brown','Singh','Lopez','Chen','Williams','Ahmed','Martin','Davis','Cohen','Okafor','Silva','Young','Reyes','Hughes','Keaton','Moreau','Tanaka','Ellis'];
  const UNIS = ['Robert Floyd University', 'Lakeshore State', 'Tri-County Technical College', 'Hartwell Institute', 'Cedar Valley College', 'Northgate Community College'];
  const RIVALS = ['Blue Falcons','Summit Eagles','Metro Moguls','Capital Sharks','Lone Star Ventures','Pioneer Peak','Harbor Hustlers','Golden Gate Gurus','Bay State Bosses','Prairie Profits','Mountain Makers','Liberty Launchpad','Delta Dynamos','Coastal Closers'];
  const AUDIENCES = { young: 'Students & young adults', family: 'Families', homeowner: 'Homeowners', professional: 'Working professionals', all: 'Everyone nearby' };

  globalThis.VBC_DATA = { BUSINESS_ROWS, FORMS, SURNAMES, FIRST, LAST, UNIS, RIVALS, AUDIENCES, SEASON, DOW };
})();
/* ==========================================================================
   engine.js — DOM-free simulation engine v2 (runs in browser and Node).
   Rebuilt to follow the structure of the practice-lesson sim:
     products with per-product prices (Price Survey low/med/high) · weekly rent & map locations ·
     durable equipment + consumable supplies · role-based applicants with resumes ·
     written social-media ads · Sole Prop / Partnership / Corporation.
   Modules on globalThis.VBC:  market · team · ops · fin · act · sim
   [OBS]/[EST] tags mark what comes from screenshots vs. project estimates (see data.js, README).
   ========================================================================== */
(function () {
  const CFG0 = globalThis.VBC_CONFIG, D = globalThis.VBC_DATA, FORMS = D.FORMS;
  const TYPES = Object.fromEntries(D.BUSINESS_ROWS.map(t => [t.key, t]));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const sum = (a, f) => a.reduce((s, x) => s + (f ? f(x) : x), 0);
  const round2 = x => Math.round(x * 100) / 100;
  const usd = x => (x < 0 ? '-$' : '$') + Math.abs(Math.round(x)).toLocaleString('en-US');
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---------- rng ---------- */
  function rnd(S) { // mulberry32, state kept in S.seed
    S.seed = (S.seed + 0x6D2B79F5) | 0;
    let t = Math.imul(S.seed ^ (S.seed >>> 15), 1 | S.seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const rr = (S, a, b) => a + (b - a) * rnd(S);
  const pick = (S, arr) => arr[Math.floor(rnd(S) * arr.length)];
  const gauss = S => { let u = 0, v = 0; while (!u) u = rnd(S); while (!v) v = rnd(S); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  /* ---------- state ---------- */
  function newState(cfg, opts) {
    cfg = Object.assign({}, CFG0, cfg || {}); opts = opts || {};
    const S = {
      v: 2, cfg, seed: opts.seed != null ? opts.seed : (Date.now() ^ 0x5bd1e995) | 0,
      tryNo: opts.tryNo || 1, day: 0, status: 'running-setup',
      personal: { cash: cfg.startPersonalCash, provided: 0, positions: { savings: 0, bonds: 0, index: 0 }, cost: { savings: 0, bonds: 0, index: 0 }, spentOther: 0 },
      startNW: cfg.startPersonalCash, economy: 1, effects: [], biz: null,
      journal: [], messages: [], surveys: [], nextId: 1, submitted: null, step: 1
    };
    journal(S, 'Lesson started (try #' + S.tryNo + '). Difficulty level ' + cfg.goalDifficultyLevel + '.');
    return S;
  }
  const nid = S => S.nextId++;
  const dateOf = (S, day) => new Date(Date.UTC(S.cfg.startDate[0], S.cfg.startDate[1], S.cfg.startDate[2] + (day == null ? S.day : day)));
  function journal(S, text) { S.journal.push({ day: S.day, text }); if (S.journal.length > 1500) S.journal.shift(); }
  function msg(S, type, text) { S.messages.push({ day: S.day, type, text }); if (S.messages.length > 400) S.messages.shift(); }
  const goalNW = S => S.cfg.goalNetWorthByLevel[S.cfg.goalDifficultyLevel] || 400000;
  const ok = m => ({ ok: true, msg: m || '' }), fail = m => ({ ok: false, msg: m });

  /* ---------- ledger (fin) ---------- */
  const EXP = ['cogs', 'wages', 'rent', 'utilities', 'marketing', 'insurance', 'depreciation', 'interest', 'taxes', 'other'];
  const blankLed = () => Object.fromEntries(['rev', ...EXP].map(k => [k, 0]));
  function book(B, f, a) { B.led.cur[f] += a; B.led.tot[f] += a; }
  function pay(B, f, a) { B.cash -= a; book(B, f, a); }
  const netIncome = L => L.rev - sum(EXP, k => L[k]);
  const totalLoans = B => sum(B.loans, l => l.balance);
  const nbv = B => sum(B.assets, a => a.cost - a.accDep);
  const invValue = B => sum(Object.values(B.invVal));
  const equity = B => B.cash + nbv(B) + B.deposit + invValue(B) - totalLoans(B);
  const investorShare = B => clamp(B.investorShare || 0, 0, 0.6);

  function netWorth(S) {
    let nw = S.personal.cash + sum(Object.values(S.personal.positions));
    const B = S.biz; if (B && B.status !== 'closed') nw += equity(B) * (1 - investorShare(B));
    return nw;
  }
  const scoredNW = S => netWorth(S) - S.personal.provided;
  function grade(S) {
    const g = (scoredNW(S) - S.startNW) / (goalNW(S) - S.startNW);
    return clamp(Math.round(g * S.cfg.gradeScale * 10) / 10, 0, S.cfg.gradeScale);
  }
  function balanceSheet(S) {
    const B = S.biz; if (!B) return null;
    const assets = { cash: B.cash, inventory: invValue(B), equipment: sum(B.assets, a => a.cost), accDep: -sum(B.assets, a => a.accDep), deposit: B.deposit };
    const total = assets.cash + assets.inventory + assets.equipment + assets.accDep + assets.deposit, liab = totalLoans(B);
    const retained = B.led.tot.rev - sum(EXP, k => B.led.tot[k]) - B.distrib;
    return { assets, totalAssets: total, loans: liab, contrib: B.contrib, retained, equity: total - liab, check: total - liab - B.contrib - retained };
  }

  /* ---------- market model ---------- */
  /** Demand multiplier for a product priced at ratio r = price/med, from the Price Survey low/med/high anchors. [EST curve shape] */
  function priceFactor(lo, hi, r) {
    if (!(r > 0)) return 0;
    if (r <= lo) return Math.min(2.6, 1.9 * Math.pow(lo / r, 0.9));
    if (r <= 1) return 1 + 0.9 * (1 - r) / (1 - lo);
    if (r <= hi) return 1 - 0.88 * (r - 1) / (hi - 1);
    const z = hi * 1.35; return r >= z ? 0 : 0.12 * (z - r) / (z - hi);
  }
  const PF_AVG = r => priceFactor(0.53, 1.46, r);
  const attract = (q, r) => Math.pow(q / 60, 0.8) * PF_AVG(r);
  const SUPPLIER = [{ n: 'Budget', c: 0.85, q: -5 }, { n: 'Standard', c: 1, q: 0 }, { n: 'Premium', c: 1.2, q: 8 }];
  const INS = [{ n: 'None', p: 0, cov: 0 }, { n: 'Basic', p: 0.004, cov: 0.5 }, { n: 'Standard', p: 0.008, cov: 0.8 }, { n: 'Premium', p: 0.013, cov: 0.95 }];
  const MKT_CAP = 3000;

  const roleOf = (B, s) => B.type.roles.find(r => r.key === s.role) || B.type.roles[0];
  const empQuality = e => e.skill * (0.7 + 0.3 * e.morale / 100);
  const avgEmpQ = B => B.staff.length ? sum(B.staff, empQuality) / B.staff.length : 0;
  const hoursOf = B => Math.max(0, B.close - B.open);
  const ownsEquip = (B, i) => !!B.equip[B.type.equip[i].id];
  const sellable = (B, p) => (B.prices[p.key] || 0) > 0 && p.req.every(i => ownsEquip(B, i));
  const sellableProducts = B => B.type.products.filter(p => sellable(B, p));
  const storageCap = B => B.loc ? Math.max(2, Math.floor(B.loc.sqft / (B.type.sqft / 10))) : 0;
  const storageUsed = B => sum(B.type.supplies, s => Math.ceil((B.inv[s.id] || 0) - 1e-9));
  const lotCost = (B, s) => Math.round(s.lot * SUPPLIER[B.ops.supplier].c);

  function serviceQuality(B) {
    const q = sum(B.type.equip, e => e.quality && B.equip[e.id] ? 6 : 0);
    const senior = B.staff.some(s => roleOf(B, s).tier === 2) ? 6 : 0;      // senior staff drives quality perception [OBS: master electrician text]
    return clamp(52 + SUPPLIER[B.ops.supplier].q + Math.min(12, q) + 3 * B.ops.qa + 0.3 * (avgEmpQ(B) - 50) + senior + (B.ops.loyalty ? 2 : 0), 10, 100);
  }
  function yourPriceRatio(B) {
    let w = 0, r = 0;
    for (const p of B.type.products) { const pr = B.prices[p.key] || 0; if (pr > 0) { r += p.share * pr / p.med; w += p.share; } }
    return w ? r / w : 1;
  }
  function marketShare(S, B) {
    const you = attract(serviceQuality(B), yourPriceRatio(B) / B.loc.priceIdx);
    const comp = sum(B.loc.competitors, c => attract(c.quality, c.priceRatio / B.loc.priceIdx));
    return you / (you + comp);
  }
  /** Productive labor hours per open day. Senior-required businesses need >=1 senior; juniors work at most 2x senior hours. [EST, from "master electrician can supervise any job" text] */
  function laborHours(B) {
    const h = hoursOf(B), t = B.type; let sen = 0, mid = 0, jun = 0;
    for (const s of B.staff) {
      const r = roleOf(B, s), eff = h * r.speed * (0.6 + 0.8 * empQuality(s) / 100);
      if (r.tier === 2) sen += eff; else if (r.tier === 1) mid += eff; else jun += eff;
    }
    if (t.needSenior) return sen > 0 ? sen + mid + Math.min(jun, 2 * sen) : 0;
    return sen + mid + jun;
  }
  function canOpen(B) {
    const why = [];
    if (!B.loc) why.push('Choose a location (Actions ▸ Locate Business).');
    if (!B.type.products.some(p => p.req.every(i => ownsEquip(B, i)))) why.push('Buy the required equipment (Actions ▸ Acquire Resources).');
    else if (!sellableProducts(B).length) why.push('Set a price above $0 for a product you can make (Actions ▸ Pricing).');
    if (!B.staff.length) why.push('Hire at least one employee (Actions ▸ Build Your Team).');
    else if (B.type.needSenior && !B.staff.some(s => roleOf(B, s).tier === 2)) why.push('Hire a ' + B.type.role + ' — junior staff cannot work alone.');
    if (hoursOf(B) <= 0 || !B.days.some(Boolean)) why.push('Set business hours (Actions ▸ Business Hours).');
    return why;
  }

  /* ---------- actions ---------- */
  const act = {};
  act.formBusiness = (S, { type, name, form }) => {
    if (S.biz && S.biz.status !== 'closed') return fail('You already operate a business. Close it first.');
    const t = TYPES[type]; if (!t) return fail('Pick a business type.');
    if (S.cfg.enabledBusinesses && !S.cfg.enabledBusinesses.includes(type)) return fail(t.name + ' is not available in this lesson.');
    const F = FORMS[form]; if (!F) return fail('Choose a form of ownership.');
    if (S.cfg.enabledForms && !S.cfg.enabledForms.includes(form)) return fail(F.name + ' is not available in this lesson.');
    name = String(name || '').trim().slice(0, 40); if (!name) return fail('Please enter a name for your business.');
    if (F.fee > S.personal.cash) return fail('Not enough personal cash for the $' + F.fee + ' setup cost.');
    S.personal.cash -= F.fee; S.personal.spentOther += F.fee;
    const letters = 'ABCDEFGHIJK', baseName = t.name.replace(/ (Business|Services|Shop|Place)$/, '');
    const locs = Array.from({ length: 11 }, (_, i) => {
      const sqft = Math.round(t.sqft * pick(S, [0.75, 1, 1, 1.25, 1.5, 2]) / 100) * 100;
      const minutes = 12 + Math.floor(rnd(S) * 29), closeness = clamp(1 - (minutes - 10) / 35, 0, 1);
      const rentWk = Math.round(sqft * (1.62 - 0.028 * minutes) * rr(S, 0.9, 1.12));
      const nc = pick(S, [0, 1, 1, 2, 2, 3, 4]);
      return {
        id: i, letter: letters[i], name: 'Location ' + letters[i], sqft, minutes, closeness, rentWk, priceIdx: round2(rr(S, 0.92, 1.1)), x: round2(rr(S, .08, .92)), y: round2(rr(S, .1, .9)),
        competitors: Array.from({ length: nc }, () => ({ name: pick(S, D.SURNAMES) + "'s " + baseName, quality: Math.round(rr(S, 46, 70)), priceRatio: round2(rr(S, 0.85, 1.15)) }))
      };
    });
    S.biz = {
      type: t, key: t.key, name, form, status: 'forming', startDay: S.day,
      loc: null, cash: 0, deposit: 0, assets: [], equip: {}, inv: {}, invVal: {}, autoReorder: false,
      staff: [], applicants: {}, loans: [], contrib: 0, distrib: 0, investorShare: 0,
      open: 8, close: 17, days: t.dow.map(v => v >= 0.9), prices: Object.fromEntries(t.products.map(p => [p.key, 0])),
      ads: [], awareness: 8, ops: { supplier: 1, qa: 0, loyalty: false }, insurance: 0,
      overall: 50, wait: 100, queue: [], negDays: 0,
      led: { cur: blankLed(), tot: blankLed(), history: [] }, daily: [], locations: locs, comments: [], lastDay: null
    };
    genApplicants(S);
    journal(S, 'Formed "' + name + '" (' + t.name + ') as a ' + F.name + '. Setup cost $' + F.fee.toLocaleString() + '.');
    msg(S, 'info', 'Business formed. Next: financing, a location, your team, equipment and supplies, then prices.');
    S.step = Math.max(S.step, 5);
    return ok('Business formed.');
  };

  act.personalInvest = (S, amt) => {
    const B = S.biz; if (!B) return fail('Form a business first.');
    amt = Math.floor(amt); if (!(amt > 0)) return fail('Enter an amount.');
    if (amt > S.personal.cash) return fail('Not enough personal cash.');
    S.personal.cash -= amt; B.cash += amt; B.contrib += amt;
    journal(S, 'Invested $' + amt.toLocaleString() + ' of personal cash in the business.'); return ok('Invested.');
  };
  /** Credit rating. [OBS] 0 invested → High Risk ($25k @ 20%); all savings invested → Moderate Risk ($50k @ 15%), 2-year terms.
   *  [EST] Low / Very Low Risk tiers are earned with a profitable operating history. */
  act.credit = S => {
    const B = S.biz, T = S.cfg.creditTiers; let i = 0;
    if (B) {
      const frac = B.contrib / Math.max(1, S.startNW);
      if (frac >= 0.5) i = 1;
      const months = B.led.history.length, cum = B.led.tot.rev - sum(EXP, k => B.led.tot[k]);
      if (i >= 1 && months >= 6 && cum > 25000) i = 2;
      if (i >= 2 && months >= 12 && cum > 150000) i = 3;
    }
    return Object.assign({ level: i }, T[i]);
  };
  act.loanLimit = S => { const B = S.biz; if (!B) return 0; return Math.max(0, act.credit(S).amount - totalLoans(B)); };
  act.loanRate = S => act.credit(S).rate;
  act.takeLoan = (S, amt) => {
    const B = S.biz; if (!B || B.status === 'closed') return fail('No active business.');
    amt = Math.floor(amt); const months = S.cfg.loanTermMonths;
    if (!(amt >= 1000)) return fail('Minimum loan is $1,000.');
    if (amt > act.loanLimit(S)) return fail('The bank will lend up to $' + Math.floor(act.loanLimit(S)).toLocaleString() + ' at your credit rating (' + act.credit(S).name + '). Investing more of your own savings improves your rating.');
    const rate = act.loanRate(S), i = rate / 12, pmt = amt * i / (1 - Math.pow(1 + i, -months));
    B.loans.push({ id: nid(S), principal: amt, balance: amt, rate, months, left: months, pmt });
    B.cash += amt; journal(S, 'Bank loan $' + amt.toLocaleString() + ' @ ' + (rate * 100).toFixed(0) + '% for ' + (months / 12) + ' years (pmt $' + Math.round(pmt) + '/mo).'); return ok('Loan approved.');
  };
  act.repayLoan = (S, id) => {
    const B = S.biz, l = B && B.loans.find(x => x.id === id); if (!l) return fail('Loan not found.');
    if (B.cash < l.balance) return fail('Not enough business cash to pay off ' + usd(l.balance));
    B.cash -= l.balance; B.loans = B.loans.filter(x => x !== l); journal(S, 'Paid off loan early (' + usd(l.balance) + ').'); return ok('Loan paid off.');
  };
  act.investorPreview = (S, amt) => {
    const B = S.biz; if (!B) return 0;
    const pre = 1.5 * Math.max(equity(B) * (1 - investorShare(B)), 10000) + 6 * Math.max(0, netIncome(B.led.cur));
    return 1 - (1 - investorShare(B)) * pre / (pre + amt);
  };
  act.equityWhy = S => { const B = S.biz; if (!B) return 'Form a business first.'; if (!FORMS[B.form].investors) return 'A ' + FORMS[B.form].name + ' cannot sell equity. Choose a Partnership or Corporation.'; if (B.openedDay == null || S.day - B.openedDay < S.cfg.equityMinOperatingDays) return 'Investors want to see a track record first — equity financing opens after about ' + S.cfg.equityMinOperatingDays + ' days of operation.'; return ''; };
  act.equityAvailable = S => !act.equityWhy(S);
  act.addInvestor = (S, amt) => {
    const B = S.biz; if (!B) return fail('Form a business first.');
    if (!act.equityAvailable(S)) return fail(act.equityWhy(S));
    amt = Math.floor(amt); if (!(amt >= 5000 && amt <= 150000)) return fail('Investors fund $5,000–$150,000.');
    const newS = act.investorPreview(S, amt); if (newS > 0.6) return fail('Investors would own more than 60%.');
    B.investorShare = newS; B.cash += amt; B.contrib += amt;
    journal(S, 'Investor funded $' + amt.toLocaleString() + ' for ' + (newS * 100).toFixed(1) + '% total investor ownership.'); return ok('Investor deal closed — they now own ' + (newS * 100).toFixed(1) + '%.');
  };

  act.fitCost = (B, loc) => Math.round(0.45 * B.type.build * (loc.sqft / B.type.sqft) / 50) * 50;
  act.chooseLocation = (S, id) => {
    const B = S.biz; if (!B || B.status === 'closed') return fail('No active business.');
    const loc = B.locations.find(l => l.id === id); if (!loc) return fail('Unknown location.');
    if (B.loc && B.loc.id === id) return fail('You are already at this location.');
    const fit = act.fitCost(B, loc), deposit = loc.rentWk * S.cfg.rentDepositWeeks, avail = B.cash + B.deposit;
    if (avail < fit + deposit) return fail('Signing needs ' + usd(fit + deposit) + ' (build-out ' + usd(fit) + ' + ' + S.cfg.rentDepositWeeks + '-week deposit ' + usd(deposit) + '). Business cash: ' + usd(B.cash) + '. Arrange Financing first.');
    if (B.loc) { const lost = sum(B.assets.filter(a => a.kind === 'fitout'), a => a.cost - a.accDep); B.assets = B.assets.filter(a => a.kind !== 'fitout'); book(B, 'other', lost); B.cash += B.deposit; B.deposit = 0; }
    B.cash -= fit + deposit; B.deposit = deposit; B.assets.push({ kind: 'fitout', name: 'Build-out at ' + loc.name, cost: fit, accDep: 0 });
    B.loc = loc; if (B.status === 'forming') B.status = 'setup';
    journal(S, 'Leased ' + loc.name + ' (' + loc.sqft.toLocaleString() + ' sq ft, ' + usd(loc.rentWk) + '/wk, deposit ' + usd(deposit) + ', build-out ' + usd(fit) + ').'); S.step = Math.max(S.step, 7); return ok('Lease signed at ' + loc.name + '.');
  };
  act.closeBusiness = S => {
    const B = S.biz; if (!B || B.status === 'closed') return fail('No active business.');
    const bk = nbv(B) + invValue(B), proceeds = nbv(B) * S.cfg.resaleFraction + invValue(B) * 0.3;
    B.cash += proceeds; book(B, 'other', bk - proceeds); B.assets = []; B.invVal = {}; B.inv = {};
    B.cash += B.deposit; B.deposit = 0; B.cash -= totalLoans(B); B.loans = [];
    const gross = B.cash * (1 - investorShare(B)), out = B.form === 'corp' ? gross * (1 - S.cfg.dividendTaxRate) : gross;
    S.personal.cash += out; B.distrib += B.cash; B.cash = 0; B.status = 'closed'; B.closedDay = S.day;
    journal(S, 'Closed business. ' + usd(out) + ' returned to personal cash.'); msg(S, 'info', 'Your business has closed. Personal cash: ' + usd(S.personal.cash)); return ok('Business closed.');
  };

  /* ---- team: applicants with resumes ---- */
  const EDU = [{ n: 'High School Diploma', b: 0 }, { n: 'Trade Certificate', b: 5 }, { n: "Associate's Degree", b: 8 }, { n: "Bachelor's Degree", b: 12 }];
  function genApplicant(S, B, role) {
    const edu = pick(S, EDU), exp = role.tier === 2 ? 4 + Math.floor(rnd(S) * 12) : role.tier === 1 ? 2 + Math.floor(rnd(S) * 7) : Math.floor(rnd(S) * 4);
    const skill = Math.round(clamp(30 + 3.2 * exp + edu.b + (role.tier === 2 ? 6 : 0) + 8 * gauss(S), 20, 98));
    const ask = round2(clamp(role.wage * (0.72 + 0.6 * skill / 100) * rr(S, 0.95, 1.08), 8.25, 60.25));
    const jobs = []; let end = dateOf(S).getUTCFullYear() * 12 + dateOf(S).getUTCMonth() - 1 - Math.floor(rnd(S) * 5), left = Math.max(1, exp);
    while (left > 0 && jobs.length < 4) {
      const len = Math.min(left, 1 + Math.floor(rnd(S) * 5)), start = end - len * 12 - Math.floor(rnd(S) * 3);
      jobs.push({ title: role.name, employer: pick(S, D.SURNAMES) + "'s " + B.type.name, from: MONTHS[start % 12] + ' ' + Math.floor(start / 12), to: MONTHS[end % 12] + ' ' + Math.floor(end / 12) });
      end = start - 1; left -= len;
    }
    return { id: nid(S), role: role.key, name: pick(S, D.FIRST) + ' ' + pick(S, D.LAST), edu: edu.n, school: pick(S, D.UNIS), exp, skill, ask, jobs };
  }
  function genApplicants(S) { const B = S.biz; B.applicants = {}; for (const r of B.type.roles) B.applicants[r.key] = Array.from({ length: 6 }, () => genApplicant(S, B, r)); }
  act.hire = (S, aid, wage) => {
    const B = S.biz; if (!B || B.status === 'closed') return fail('No active business.');
    if (B.staff.length >= 12) return fail('Maximum team size is 12.');
    let a, role; for (const r of B.type.roles) { const f = (B.applicants[r.key] || []).find(x => x.id === aid); if (f) { a = f; role = r; } }
    if (!a) return fail('Applicant unavailable.');
    wage = round2(Number(wage) || a.ask);
    if (wage < a.ask * 0.95) return fail(a.name + ' declined — the salary requirement is ' + usd(a.ask) + '/hr.');
    B.applicants[role.key] = B.applicants[role.key].filter(x => x !== a);
    B.staff.push({ id: nid(S), role: role.key, name: a.name, skill: a.skill, wage, ask: a.ask, morale: clamp(70 + (wage / a.ask - 1) * 100, 0, 90), hired: S.day, trained: 0 });
    journal(S, 'Hired ' + a.name + ' as ' + role.name + ' (skill ' + a.skill + ') at $' + wage.toFixed(2) + '/hr.'); S.step = Math.max(S.step, 8); return ok(a.name + ' joined the team.');
  };
  act.rejectApplicant = (S, aid) => { const B = S.biz; for (const r of B.type.roles) B.applicants[r.key] = (B.applicants[r.key] || []).filter(x => x.id !== aid); return ok('Applicant rejected.'); };
  act.fire = (S, eid) => { const B = S.biz, e = B && B.staff.find(x => x.id === eid); if (!e) return fail('Employee not found.'); B.staff = B.staff.filter(x => x !== e); B.staff.forEach(s => s.morale = Math.max(0, s.morale - 3)); journal(S, 'Let go of ' + e.name + '.'); return ok(e.name + ' was let go.'); };
  act.setWage = (S, eid, wage) => {
    const B = S.biz, e = B && B.staff.find(x => x.id === eid); if (!e) return fail('Employee not found.');
    wage = round2(Number(wage)); if (!(wage >= 8.25)) return fail('Minimum wage is $8.25.');
    e.morale = clamp(e.morale + (wage - e.wage) / e.ask * 120, 0, 100); e.wage = wage; journal(S, 'Set ' + e.name + "'s wage to $" + wage.toFixed(2) + '/hr.'); return ok('Wage updated.');
  };
  act.train = (S, eid) => {
    const B = S.biz, e = B && B.staff.find(x => x.id === eid); if (!e) return fail('Employee not found.');
    if (B.cash < 300) return fail('Training costs $300 — not enough business cash.'); if (e.skill >= 98) return fail(e.name + ' is already highly skilled.');
    pay(B, 'other', 300); e.skill = Math.min(100, e.skill + 6 + Math.floor(rnd(S) * 4)); e.morale = Math.min(100, e.morale + 5); e.trained++;
    journal(S, 'Trained ' + e.name + ' ($300). Skill now ' + e.skill + '.'); return ok('Training complete.');
  };

  /* ---- resources: durable equipment & consumable supplies ---- */
  act.buyEquip = (S, i) => {
    const B = S.biz; if (!B || B.status === 'closed') return fail('No active business.');
    const e = B.type.equip[i]; if (!e) return fail('Unknown item.'); if (B.equip[e.id]) return fail('You already own the ' + e.name + '.');
    if (B.cash < e.cost) return fail('Needs ' + usd(e.cost) + '; business cash ' + usd(B.cash) + '.');
    B.cash -= e.cost; B.equip[e.id] = 1; B.assets.push({ kind: 'equip', id: e.id, name: e.name, cost: e.cost, accDep: 0 });
    journal(S, 'Bought ' + e.name + ' for ' + usd(e.cost) + '.'); S.step = Math.max(S.step, 9); return ok('Purchased ' + e.name + '.');
  };
  act.sellEquip = (S, i) => {
    const B = S.biz, e = B && B.type.equip[i]; if (!e || !B.equip[e.id]) return fail('Nothing to sell.');
    const k = B.assets.findIndex(a => a.id === e.id), a = B.assets[k], bv = a.cost - a.accDep, pr = bv * S.cfg.resaleFraction;
    B.assets.splice(k, 1); delete B.equip[e.id]; B.cash += pr; book(B, 'other', bv - pr); journal(S, 'Sold ' + e.name + ' for ' + usd(pr) + '.'); return ok('Sold for ' + usd(pr) + '.');
  };
  function buyLot(S, B, s, quiet) {
    const c = lotCost(B, s); if (!B.loc) return fail('Choose a location first (you need storage space).');
    if (storageUsed(B) + 1 > storageCap(B) && Math.ceil(B.inv[s.id] || 0) === (B.inv[s.id] || 0)) return fail('Storage is full (' + storageCap(B) + ' lots). A bigger location holds more.');
    if (B.cash < c) return fail('A lot of ' + s.name + ' costs ' + usd(c) + '.');
    B.cash -= c; B.inv[s.id] = (B.inv[s.id] || 0) + 1; B.invVal[s.id] = (B.invVal[s.id] || 0) + c; if (!quiet) journal(S, 'Stocked ' + s.name + ' (' + usd(c) + ').'); return ok('Stocked ' + s.name + '.');
  }
  act.addStorage = (S, sid) => { const B = S.biz; if (!B) return fail('Form a business first.'); const s = B.type.supplies.find(x => x.id === sid); return s ? buyLot(S, B, s) : fail('Unknown supply.'); };
  act.setAutoReorder = (S, on) => { const B = S.biz; if (!B) return fail('Form a business first.'); B.autoReorder = !!on; journal(S, 'Auto-reorder of supplies ' + (on ? 'on' : 'off') + '.'); return ok('Saved.'); };

  /* ---- settings ---- */
  act.setHours = (S, { open, close, days }) => {
    const B = S.biz; if (!B) return fail('Form a business first.'); open = +open; close = +close;
    if (!(close > open) || open < 0 || close > 24) return fail('Closing time must be after opening time.');
    B.open = open; B.close = close; B.days = days.map(Boolean); journal(S, 'Hours set: ' + open + ':00–' + close + ':00, ' + B.days.filter(Boolean).length + ' days/week.'); return ok('Hours saved.');
  };
  act.setPrice = (S, key, price) => {
    const B = S.biz; if (!B) return fail('Form a business first.'); const p = B.type.products.find(x => x.key === key); if (!p) return fail('Unknown product.');
    price = Math.max(0, round2(+price || 0)); B.prices[key] = price; journal(S, 'Price of "' + p.name + '" set to $' + price.toLocaleString() + '.'); S.step = Math.max(S.step, 10); return ok('Price saved.');
  };
  act.setPrices = (S, map) => { const B = S.biz; if (!B) return fail('Form a business first.'); for (const [k, v] of Object.entries(map)) B.prices[k] = Math.max(0, round2(+v || 0)); journal(S, 'Updated product prices.'); S.step = Math.max(S.step, 10); return ok('Prices saved.'); };
  act.setPricesRatio = (S, ratio) => { const B = S.biz; if (!B) return fail('Form a business first.'); for (const p of B.type.products) B.prices[p.key] = round2(p.med * ratio); return ok('Prices set.'); };
  /** Create/replace the single social-media ad. Relevance is scored like the lesson's "Heads Up": business name + exact product name + an image. */
  act.setAd = (S, ad) => {
    const B = S.biz; if (!B) return fail('Form a business first.');
    const text = ((ad.headline || '') + ' ' + (ad.text || '')).toLowerCase();
    const hasName = text.includes(B.name.toLowerCase()), hasProduct = B.type.products.some(p => text.includes(p.name.toLowerCase())), hasImage = !!ad.image;
    const budget = clamp(Math.round(+ad.budget || 0), 0, MKT_CAP);
    B.ads = budget > 0 ? [{ id: nid(S), headline: String(ad.headline || '').slice(0, 80), text: String(ad.text || '').slice(0, 300), image: hasImage ? ad.image : '', fb: !!ad.fb, ig: !!ad.ig, aud: ad.aud || 'all', budget, hasName, hasProduct }] : [];
    journal(S, 'Social-media ad ' + (budget ? 'launched: $' + budget + '/week, audience ' + (D.AUDIENCES[ad.aud] || 'everyone') + '.' : 'turned off.')); S.step = Math.max(S.step, 10);
    return ok(budget ? 'Ad running' + (hasName && hasProduct && hasImage ? '.' : ' (tip: include your business name, the exact name of a product, and an image).') : 'Ad turned off.');
  };
  act.setOps = (S, o) => { const B = S.biz; if (!B) return fail('Form a business first.'); B.ops = { supplier: clamp(+o.supplier, 0, 2), qa: clamp(+o.qa, 0, 3), loyalty: !!o.loyalty }; journal(S, 'Operations: ' + SUPPLIER[B.ops.supplier].n + ' supplier, QA level ' + B.ops.qa + ', loyalty ' + (B.ops.loyalty ? 'on' : 'off') + '.'); return ok('Operations saved.'); };
  act.setInsurance = (S, lvl) => { const B = S.biz; if (!B) return fail('Form a business first.'); B.insurance = clamp(+lvl, 0, 3); journal(S, 'Insurance: ' + INS[B.insurance].n + '.'); return ok('Insurance updated.'); };

  act.surveyCost = { price: 250, quality: 250, awareness: 150 };
  act.runSurvey = (S, kind) => {
    const B = S.biz; if (!B || !B.loc) return fail('Locate your business before surveying customers.');
    const cost = act.surveyCost[kind]; if (cost == null) return fail('Unknown survey.'); if (B.cash < cost) return fail('Survey costs $' + cost + '.');
    pay(B, 'other', cost); S.surveys.push({ id: nid(S), kind, orderedDay: S.day, readyDay: S.day + 3, done: false });
    journal(S, 'Ordered ' + kind + ' survey ($' + cost + '). Results in 3 days.'); return ok('Survey ordered — results arrive in 3 days.');
  };
  function resolveSurveys(S) {
    const B = S.biz; if (!B) return;
    for (const s of S.surveys) if (!s.done && S.day >= s.readyDay) {
      s.done = true;
      if (s.kind === 'price') s.result = B.type.products.map(p => ({ name: p.name, med: p.med, curve: [0.7, 0.85, 1, 1.15, 1.3, 1.5].map(r => ({ r, buy: clamp(Math.round(100 * priceFactor(p.low / p.med, p.high / p.med, r / B.loc.priceIdx) / 1.9 * (1 + 0.06 * gauss(S))), 0, 100) })) }));
      else if (s.kind === 'quality') s.result = { importance: { 'Fast turnaround': clamp(Math.round(60 + 8 * gauss(S)), 10, 98), 'Skilled, senior staff': Math.round(75 + 8 * gauss(S)), 'Quality of materials': Math.round(62 + 9 * gauss(S)), 'Low price': Math.round(55 + 9 * gauss(S)) } };
      else s.result = { awareness: clamp(Math.round(B.awareness + 4 * gauss(S)), 0, 100), best: B.ads.length ? (B.ads[0].hasName && B.ads[0].hasProduct ? 'Your ad names your business and a product — that helps.' : 'Your ad should name the business AND an exact product.') : 'You are not running any ads.' };
      msg(S, 'survey', 'Your ' + s.kind + ' survey results are ready (Actions ▸ Survey Results).');
    }
  }

  /* personal finance */
  act.transferOut = (S, amt) => {
    const B = S.biz; if (!B) return fail('No business.'); amt = Math.floor(amt); if (!(amt > 0)) return fail('Enter an amount.');
    if (amt > B.cash) return fail('Business cash is only ' + usd(B.cash) + '.');
    const gross = amt * (1 - investorShare(B)), mine = B.form === 'corp' ? gross * (1 - S.cfg.dividendTaxRate) : gross;
    B.cash -= amt; B.distrib += amt; S.personal.cash += mine; journal(S, 'Transferred ' + usd(amt) + ' out of the business (you receive ' + usd(mine) + (B.form === 'corp' ? ' after dividend tax' : '') + ').'); return ok('Transferred.');
  };
  const FUNDS = { savings: { n: 'Savings account', apy: 0.03, vol: 0 }, bonds: { n: 'Bond fund', apy: 0.045, vol: 0.04 }, index: { n: 'Stock index fund', apy: 0.08, vol: 0.16 } };
  act.invest = (S, fund, amt) => {
    const P = S.personal; if (!FUNDS[fund]) return fail('Unknown fund.'); amt = Math.floor(amt); if (!amt) return fail('Enter an amount.');
    if (amt > 0) { if (amt > P.cash) return fail('Not enough personal cash.'); P.cash -= amt; P.positions[fund] += amt; P.cost[fund] += amt; }
    else { const a = Math.min(-amt, P.positions[fund]); if (a <= 0) return fail('Nothing to sell.'); P.cost[fund] *= (1 - a / P.positions[fund]); P.positions[fund] -= a; P.cash += a; }
    journal(S, (amt > 0 ? 'Invested $' : 'Sold $') + Math.abs(amt).toLocaleString() + ' ' + (amt > 0 ? 'in ' : 'of ') + FUNDS[fund].n + '.'); return ok('Done.');
  };
  act.provideCash = (S, amt) => {
    amt = Math.floor(amt); if (!(amt > 0) || amt > S.cfg.teacherCashLimit) return fail('Enter 1–' + S.cfg.teacherCashLimit.toLocaleString() + '.');
    S.personal.cash += amt; S.personal.provided += amt; journal(S, '[Teacher] Provided $' + amt.toLocaleString() + ' cash (excluded from score).'); return ok('Added $' + amt.toLocaleString() + ' (does not count toward grade).');
  };

  /* ---------- simulation step ---------- */
  function addEffect(S, key, days, o) { S.effects.push(Object.assign({ key, until: S.day + days }, o)); }
  const effMult = (S, f) => S.effects.reduce((m, e) => m * (e[f] || 1), 1);
  const blankDay = S => ({ day: S.day, rev: 0, served: 0, demand: 0, lost: 0, cap: 0, wage: 0, cogs: 0, backlog: 0, wait: 100, open: false, note: '', dbg: {}, byProduct: {} });

  function consume(B, p, units) {
    let cost = 0;
    for (const [sid, per] of Object.entries(p.uses)) {
      const lots = per * units, have = B.inv[sid] || 0; if (have <= 1e-12) continue;
      const take = Math.min(lots, have), c = (B.invVal[sid] / have) * take;
      B.inv[sid] = have - take; B.invVal[sid] -= c; cost += c;
    }
    return cost;
  }
  const stockLimit = (B, p) => { let m = Infinity; for (const [sid, per] of Object.entries(p.uses)) m = Math.min(m, (B.inv[sid] || 0) / per); return m; };
  const queueHours = B => sum(B.queue, q => q.n * B.type.products.find(p => p.key === q.p).hrs);

  function serveQueue(S, B, d, Lh, closedDay) {
    const t = B.type; let served = 0, rev = 0, cogs = 0, hrsLeft = Lh; const patience = t.kind === 'online' ? 6 : 14;
    if (!closedDay) for (const q of B.queue) {
      if (hrsLeft <= 0) break; const p = t.products.find(x => x.key === q.p); if (!sellable(B, p)) continue;
      const take = Math.min(q.n, hrsLeft / p.hrs, stockLimit(B, p)); if (take <= 0) continue;
      q.n -= take; hrsLeft -= take * p.hrs; served += take; rev += take * B.prices[p.key]; cogs += consume(B, p, take); d.byProduct[p.key] = (d.byProduct[p.key] || 0) + take;
    }
    let lost = 0; B.queue = B.queue.filter(q => { if (q.age > patience) { lost += q.n; return false; } return q.n > 1e-6; }); d.lost += lost;
    return { served, rev, cogs };
  }

  function bizDay(S, B) {
    const d = blankDay(S), dt = dateOf(S), dow = dt.getUTCDay(), month = dt.getUTCMonth(), t = B.type;
    // ---- advertising -> awareness ----
    let gain = 0, spend = 0;
    for (const ad of B.ads) {
      const rel = 0.15 + 0.35 * (ad.hasName ? 1 : 0) + 0.35 * (ad.hasProduct ? 1 : 0) + 0.15 * (ad.image ? 1 : 0);
      const audM = ad.aud === t.aud ? 1.3 : ad.aud === 'all' ? 1 : 0.8, platM = (ad.fb || ad.ig) ? (ad.fb && ad.ig ? 1.1 : 1) : 0;
      const s = ad.budget / 7; spend += platM ? s : 0; gain += s * rel * audM * platM / 60 * (1 - B.awareness / 100);
    }
    if (spend > 0) pay(B, 'marketing', spend);
    B.awareness = clamp(B.awareness * 0.988 + gain + 0.3 * (B.overall - 50) / 50, 0, 100);

    const why = canOpen(B);
    if (why.length) { d.note = 'Not open: ' + why[0]; B.status = B.loc ? 'setup' : B.status; }
    else if (!B.days[dow]) { d.note = 'Closed today'; B.status = 'open'; B.wait = Math.min(100, B.wait + 5); if (t.kind !== 'walkin') serveQueue(S, B, d, 0, true); }
    else {
      B.status = 'open'; d.open = true; if (B.openedDay == null) B.openedDay = S.day;
      const h = hoursOf(B), sq = serviceQuality(B), share = marketShare(S, B), Lh = laborHours(B); d.cap = Lh;
      const trafficEff = 1 + (B.loc.closeness - 0.5) * 1.2 * t.sens, hoursF = Math.min(1.35, Math.sqrt(h / 8)), awF = 0.5 + 0.7 * B.awareness / 100;
      const noise = Math.exp(0.12 * gauss(S)), balk = 0.75 + 0.25 * B.wait / 100;
      const common = trafficEff * t.season[month] * t.dow[dow] * hoursF * Math.pow(share / 0.25, 0.35) * awF * S.economy * effMult(S, 'demandMult') * noise * (B.ops.loyalty ? 1.06 : 1) * (0.8 + 0.4 * B.overall / 100);
      const arr = {}; let demand = 0;
      for (const p of sellableProducts(B)) {
        const r = B.prices[p.key] / p.med / B.loc.priceIdx;
        arr[p.key] = p.perDay * priceFactor(p.low / p.med, p.high / p.med, r) * common; demand += arr[p.key];
      }
      d.demand = demand;
      let served = 0, rev = 0, cogsDay = 0, pressure = 0;
      if (t.kind === 'walkin') {
        const need = sum(Object.keys(arr), k => arr[k] * balk * t.products.find(p => p.key === k).hrs); pressure = Lh > 0 ? need / Lh : 9;
        const scale = need > 0 ? Math.min(1, Lh / need) : 1;
        for (const p of sellableProducts(B)) { const want = arr[p.key] * balk * scale, u = Math.min(want, stockLimit(B, p)); if (u > 0) { served += u; rev += u * B.prices[p.key]; cogsDay += consume(B, p, u); d.byProduct[p.key] = u; } }
        d.lost = demand - served;
      } else {
        for (const q of B.queue) q.age++;
        for (const p of sellableProducts(B)) B.queue.push({ p: p.key, n: arr[p.key] * balk, age: 0 });
        const arrHrs = sum(sellableProducts(B), p => arr[p.key] * balk * p.hrs), backHrs = Math.max(0, queueHours(B) - arrHrs);
        pressure = Lh > 0 ? (arrHrs + 0.12 * backHrs) / Lh : 9;      // today's arrivals + a share of the waiting backlog
        const r = serveQueue(S, B, d, Lh, false); served = r.served; rev = r.rev; cogsDay = r.cogs; d.lost += demand - sum(Object.values(arr)) * balk;
      }
      book(B, 'rev', rev); B.cash += rev; book(B, 'cogs', cogsDay);
      if (B.ops.loyalty) pay(B, 'other', rev * 0.015); if (B.ops.qa) pay(B, 'other', 60 * B.ops.qa / 7);
      let wages = 0; for (const s of B.staff) wages += Math.min(h, 8) * s.wage + Math.max(0, h - 8) * s.wage * 1.5; pay(B, 'wages', wages);
      const waitRating = clamp(100 - Math.max(0, pressure - 0.7) * 110, 0, 100); B.wait = B.wait * 0.6 + waitRating * 0.4;
      d.rev = rev; d.served = served; d.wage = wages; d.cogs = cogsDay; d.wait = B.wait;
      d.dbg = { share: +share.toFixed(3), sq: +sq.toFixed(1), pressure: +pressure.toFixed(2), awF: +awF.toFixed(2), trafficEff: +trafficEff.toFixed(2), noise: +noise.toFixed(2), util: +Math.min(1, pressure).toFixed(2), laborHours: +Lh.toFixed(1) };
      if (served > 0 || demand > 0) {
        const valueScore = clamp(100 - (yourPriceRatio(B) / B.loc.priceIdx - 1) * 110, 20, 100);
        const sat = 0.38 * B.wait + 0.42 * sq + 0.2 * valueScore + (B.ops.loyalty ? 3 : 0) - (d.lost > served * 0.3 ? 4 : 0);
        B.overall = clamp(B.overall * 0.96 + clamp(sat, 0, 100) * 0.04, 0, 100);
      }
      const over = clamp(pressure - 1, 0, 1.5);
      for (const s of B.staff) { const target = clamp(62 + (s.wage / s.ask - 1) * 90 - over * 35 - Math.max(0, h - 9) * 4 + (B.ops.qa ? 3 : 0), 0, 100); s.morale += (target - s.morale) * 0.06; }
      if (rnd(S) < 0.25) addComment(S, B, pressure > 1.1 ? 'wait' : (sq >= 62 && B.wait > 65 ? 'good' : (yourPriceRatio(B) / B.loc.priceIdx > 1.2 ? 'price' : 'ok')));
    }
    if (B.autoReorder && B.loc) for (const s of t.supplies) if ((B.inv[s.id] || 0) < 0.3) buyLot(S, B, s, true);
    for (const s of B.staff.slice()) if (s.morale < 22 && rnd(S) < 0.025) { B.staff = B.staff.filter(x => x !== s); msg(S, 'warn', s.name + ' quit — morale was too low. Consider raising pay or hiring help.'); journal(S, s.name + ' quit.'); }
    if (rnd(S) < 0.006) { // random incident
      const F = FORMS[B.form], loss = t.build * rr(S, 0.02, 0.2) * F.lossMult, out = loss * (1 - INS[B.insurance].cov);
      const what = pick(S, ['A worker was injured on a job', 'Equipment broke down', 'Thieves broke in', 'A client disputed a job and sued', 'A vehicle was damaged']);
      pay(B, 'other', out); msg(S, 'event', what + '. Damage ' + usd(loss) + '; insurance (' + INS[B.insurance].n + ') covered ' + usd(loss - out) + '. You paid ' + usd(out) + '.'); journal(S, 'Incident: ' + what + ' (you paid ' + usd(out) + ').');
    }
    if (B.cash < 0) {
      pay(B, 'interest', -B.cash * S.cfg.overdraftDailyRate); B.negDays++;
      if (B.negDays === 1) msg(S, 'warn', 'Business cash is NEGATIVE — overdraft interest applies. Add financing or cut costs.');
      if (B.negDays >= 21 && B.cash < -3000) { msg(S, 'warn', 'The bank forced your business to close (21+ days overdrawn).'); act.closeBusiness(S); B.forced = true; }
    } else B.negDays = 0;
    B.lastDay = d; B.daily.push({ day: d.day, rev: d.rev, served: d.served, demand: d.demand, lost: d.lost, wait: B.wait, cash: B.cash, backlog: queueHours(B), cap: d.cap }); if (B.daily.length > 800) B.daily.shift();
  }
  const COMMENTS = {
    wait: ['"Way too long a wait. I may go elsewhere."', '"They were booked out for weeks."', '"Great work, but I waited forever for the appointment."'],
    good: ['"Fast, professional, and worth every penny!"', '"The senior staff really knows their stuff."', '"I will hire them again."'],
    price: ['"A bit pricey compared to the competition."', '"Prices seem high for what you get."'],
    ok: ['"Decent. Nothing special."', '"Fine experience overall."', '"Good value, average service."']
  };
  function addComment(S, B, kind) { B.comments.push({ day: S.day, text: pick(S, COMMENTS[kind]), kind }); if (B.comments.length > 200) B.comments.shift(); }

  function weekStart(S, B) { if (B.loc) pay(B, 'rent', B.loc.rentWk); genApplicants(S); }
  function monthStart(S, B) {
    const pretax = netIncome(B.led.cur), rate = B.form === 'corp' ? S.cfg.corpTaxRate : S.cfg.passThruTaxRate;
    if (pretax > 0) pay(B, 'taxes', pretax * rate);
    const profit = netIncome(B.led.cur);
    if (investorShare(B) > 0 && profit > 0 && B.cash > 0) { const div = Math.min(B.cash, profit * 0.5 * investorShare(B)); B.cash -= div; B.distrib += div; msg(S, 'info', 'Paid investors a dividend of ' + usd(div) + '.'); }
    B.led.history.push(Object.assign({ day: S.day, profit }, B.led.cur)); if (B.led.history.length > 36) B.led.history.shift(); B.led.cur = blankLed();
    if (B.status !== 'forming') {
      pay(B, 'utilities', B.loc ? B.loc.sqft * 0.25 : 0); pay(B, 'insurance', B.type.build * INS[B.insurance].p);
      let dep = 0; for (const a of B.assets) { const m = Math.min(a.cost / S.cfg.equipmentLifeMonths, a.cost - a.accDep); a.accDep += m; dep += m; } book(B, 'depreciation', dep);
      for (const l of B.loans.slice()) { const interest = l.balance * l.rate / 12, principal = Math.min(l.balance, l.pmt - interest); pay(B, 'interest', interest); B.cash -= principal; l.balance -= principal; l.left--; if (l.left <= 0 || l.balance < 1) B.loans = B.loans.filter(x => x !== l); }
    }
    msg(S, 'report', 'Month closed. Profit last month: ' + usd(profit) + '. Business cash: ' + usd(B.cash) + '.');
  }

  function step(S) {
    if (S.status === 'finished') return false;
    S.day++; const dt = dateOf(S), dow = dt.getUTCDay();
    if (S.day % 14 === 0) S.economy = clamp(S.economy + (1 - S.economy) * 0.2 + rr(S, -0.025, 0.025), 0.88, 1.12);
    S.effects = S.effects.filter(e => e.until > S.day);
    for (const k of Object.keys(FUNDS)) if (S.personal.positions[k] > 0) { const f = FUNDS[k]; S.personal.positions[k] *= 1 + f.apy / 365 + (f.vol ? f.vol / Math.sqrt(365) * gauss(S) : 0); }
    const B = S.biz;
    if (B && B.status !== 'closed') {
      if (dt.getUTCDate() === 1) monthStart(S, B);
      if (dow === 1) weekStart(S, B);
      if (B.loc && rnd(S) < 0.012) {
        const ev = pick(S, [
          () => { B.awareness = Math.min(100, B.awareness + 8); return ['event', 'A local blogger raved about your business! Awareness jumped.']; },
          () => { addEffect(S, 'boom', 7, { demandMult: 1.25 }); return ['event', 'A building boom nearby boosts demand for a week.']; },
          () => { addEffect(S, 'slow', 10, { demandMult: 0.85 }); return ['event', 'Road construction is slowing traffic for about 10 days.']; },
          () => { addEffect(S, 'supplier', 30, { cogsMult: 1.08 }); return ['event', 'Your suppliers raised prices ~8% for the next month.']; },
          () => { if (!B.loc.competitors.length) return ['event', 'A new competitor looked at your area but decided against it.']; const c = pick(S, B.loc.competitors); c.priceRatio = round2(Math.max(0.75, c.priceRatio - 0.06)); return ['event', c.name + ' cut its prices.']; }
        ])();
        msg(S, ev[0], ev[1]);
      }
      bizDay(S, B); resolveSurveys(S);
    }
    if (S.day >= S.cfg.simDays) finish(S, false);
    return true;
  }
  function finish(S, early) {
    if (S.status === 'finished') return; S.status = 'finished';
    S.submitted = { early: !!early, day: S.day, nw: scoredNW(S), grade: grade(S), profit: S.biz ? S.biz.led.tot.rev - sum(EXP, k => S.biz.led.tot[k]) : 0 };
    journal(S, (early ? 'Submitted early' : 'Simulation period ended') + '. Net worth ' + usd(S.submitted.nw) + ', grade ' + S.submitted.grade + '/' + S.cfg.gradeScale + '.');
  }
  act.finish = (S, early) => { finish(S, early); return ok('Submitted.'); };

  const totalProfit = S => S.biz ? netIncome(S.biz.led.tot) : 0;
  function diagnose(S) {
    const B = S.biz, out = [];
    if (S.status === 'finished') return [{ sev: 'info', text: 'This try is finished. Use File ▸ Restart Lesson for another try.' }];
    if (!B || B.status === 'closed') return [{ sev: 'todo', text: 'Form a business: Actions ▸ Form Business.' }];
    if (!B.loc && B.cash + totalLoans(B) < 1000) out.push({ sev: 'todo', text: 'Fund the business: Actions ▸ Financing (personal investment, bank loan, or investor).' });
    out.push(...canOpen(B).map(x => ({ sev: 'todo', text: x })));
    if (B.loc && sellableProducts(B).length) {
      const miss = sellableProducts(B).filter(p => Object.keys(p.uses).some(s => (B.inv[s] || 0) < 0.05));
      if (miss.length) out.push({ sev: 'warn', text: 'Out of supplies for ' + miss.map(p => p.name).join(', ') + '. Add storage (Acquire Resources ▸ Consumable Supplies) or turn on auto-reorder.' });
    }
    if (B.lastDay && B.lastDay.open) {
      if (B.cash < 0) out.push({ sev: 'bad', text: 'Cash is negative. Get financing, adjust prices or cut staff/marketing.' });
      if (B.wait < 55) out.push({ sev: 'warn', text: 'Wait rating is low (' + (B.wait / 20).toFixed(1) + ' of 5). Hire more staff, extend hours, or price higher to shed demand.' });
      if (B.awareness < 30 && !B.ads.length) out.push({ sev: 'warn', text: 'No ad running and low awareness (' + Math.round(B.awareness) + '). Create a social-media ad (Actions ▸ Marketing).' });
      if (B.ads.length && !(B.ads[0].hasName && B.ads[0].hasProduct && B.ads[0].image)) out.push({ sev: 'info', text: 'Your ad works better with the business name, the exact name of a product, and an image.' });
      if (B.insurance === 0) out.push({ sev: 'info', text: 'You have no insurance. A random incident can cost thousands.' });
      if (B.staff.some(s => s.morale < 35)) out.push({ sev: 'warn', text: 'Some employees have low morale and may quit. Raise wages or add staff.' });
    }
    if (!out.length) out.push({ sev: 'good', text: 'Everything looks healthy. Keep an eye on seasonality and competitors.' });
    return out;
  }
  function rivals(S) {
    const g = goalNW(S), s0 = S.startNW; let seed = 7919 * (S.cfg.goalDifficultyLevel + 3), out = [];
    const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < S.cfg.rivalCount; i++) { const z = Math.sqrt(-2 * Math.log(r() || 1e-6)) * Math.cos(2 * Math.PI * r()); out.push({ name: D.RIVALS[i % D.RIVALS.length], nw: Math.round(s0 + (g - s0) * clamp(0.85 + 0.45 * z, 0.05, 2.2)) }); }
    return out;
  }

  globalThis.VBC = { TYPES, FORMS, FUNDS, SUPPLIER, INS, MKT_CAP, EXP, newState, step, finish, act, dateOf, netWorth, scoredNW, grade, goalNW, balanceSheet, totalProfit, netIncome,
    equity, totalLoans, nbv, invValue, canOpen, laborHours, serviceQuality, avgEmpQ, empQuality, marketShare, hoursOf, roleOf, sellable, sellableProducts, ownsEquip, storageCap, storageUsed, lotCost, priceFactor, queueHours,
    diagnose, rivals, journal, msg, investorShare, sum, clamp, usd };
})();
/* ==========================================================================
   UI Adapter — bridges index.html onclick handlers to the real VBC engine.
   ========================================================================== */

/* ── globals ─────────────────────────────────────────────────────────────── */
let S = null, running = false, speed = 3, RAF = null, runToTarget = null;
let zoom = 1, selBizType = null, selLocId = null;

/* ── helpers ─────────────────────────────────────────────────────────────── */
const V = () => globalThis.VBC;
const usd = x => (x < 0 ? '-$' : '$') + Math.abs(Math.round(x)).toLocaleString('en-US');

function toast(text, type) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = text;
  el.className = 'toast show' + (type ? ' toast-' + type : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 3500);
}

function doAction(result) {
  if (!result) return;
  if (result.ok) { if (result.msg) toast(result.msg, 'ok'); }
  else toast(result.msg || 'Error', 'err');
  updateAll();
  return result.ok;
}

/* ── save / load ─────────────────────────────────────────────────────────── */
function saveGame() {
  if (!S) return;
  try { localStorage.setItem('vbc_save', JSON.stringify(S)); } catch(e) {}
}
function saveGameAuto() { saveGame(); }
function loadGame() {
  try {
    const raw = localStorage.getItem('vbc_save');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.v === 2) { S = parsed; updateAll(); return; }
    }
  } catch(e) {}
  S = V().newState();
  updateAll();
}
function confirmRestart() {
  if (confirm('Restart from the beginning? All progress will be lost.')) {
    try { localStorage.removeItem('vbc_save'); } catch(e) {}
    S = V().newState();
    running = false;
    stopLoop();
    updateAll();
  }
}

/* ── date helpers ─────────────────────────────────────────────────────────── */
function fmtDate(day) {
  const d = V().dateOf(S, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
function fmtDateShort(day) {
  const d = V().dateOf(S, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/* ── HUD / vital signs ───────────────────────────────────────────────────── */
function setEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function updateHUD() {
  if (!S) return;
  setEl('time-value', fmtDate(S.day));
  setEl('grade-display', V().grade(S).toFixed(1));
  const B = S.biz;
  const phase = !B ? 'Setup' : B.status === 'forming' ? 'Setup' : B.status === 'setup' ? 'Setup' : B.status === 'open' ? 'Open' : B.status === 'closed' ? 'Closed' : 'Setup';
  setEl('phase-display', S.status === 'finished' ? 'Done' : phase);
  setEl('current-biz-name', B ? B.name : '—');
  setEl('speed-value', speed + 'x');
  const ssText = document.getElementById('ss-text');
  const ssIcon = document.getElementById('ss-icon');
  const btn = document.getElementById('start-stop-button');
  if (ssText) ssText.textContent = running ? 'Pause' : 'Start';
  if (ssIcon) ssIcon.textContent = running ? '⏸' : '▶';
  if (btn) btn.setAttribute('aria-pressed', String(running));
  const hint = document.getElementById('sim-hint');
  if (hint) hint.style.display = (B && B.status !== 'closed') ? 'none' : '';
}

function updateVS() {
  if (!S) return;
  const B = S.biz;
  setEl('vs-cash', B ? usd(B.cash) : usd(S.personal.cash));
  setEl('vs-networth', usd(V().netWorth(S)));
  if (B && (B.status === 'open' || B.led.cur.rev > 0)) {
    const led = B.led.cur;
    setEl('vs-revenue', usd(led.rev));
    setEl('vs-profit', usd(V().netIncome(led)));
    setEl('vs-totalprofit', usd(V().netIncome(B.led.tot)));
    setEl('vs-overall', B.overall ? B.overall.toFixed(0) : '—');
    setEl('vs-quality', V().serviceQuality(B).toFixed(0));
    setEl('vs-wait', B.wait != null ? B.wait.toFixed(0) : '—');
  } else {
    setEl('vs-revenue', '—'); setEl('vs-profit', '—'); setEl('vs-totalprofit', '—');
    setEl('vs-overall', '—');
    setEl('vs-quality', B ? V().serviceQuality(B).toFixed(0) : '—');
    setEl('vs-wait', '—');
  }
}

function updateAll() {
  updateHUD();
  updateVS();
  drawCanvas();
  const openBackdrop = document.querySelector('.modal-backdrop:not(.hidden)');
  if (openBackdrop) refreshModalContent(openBackdrop.id);
}

/* ── canvas ──────────────────────────────────────────────────────────────── */
function drawCanvas() {
  const canvas = document.getElementById('sim-view-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0a1020';
  ctx.fillRect(0, 0, W, H);
  if (!S) return;
  const B = S.biz;

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += 80) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
  for (let gy = 0; gy < H; gy += 60) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('Day ' + S.day + ' / ' + S.cfg.simDays + '  |  NW: ' + usd(V().netWorth(S)), 16, 22);

  if (B && B.locations) {
    for (const loc of B.locations) {
      const lx = Math.round(loc.x * W), ly = Math.round(loc.y * H);
      const isSel = B.loc && B.loc.id === loc.id;
      const isHi = selLocId === loc.id;
      ctx.beginPath();
      ctx.arc(lx, ly, isSel ? 10 : 6, 0, Math.PI * 2);
      ctx.fillStyle = isSel ? '#22d3ee' : isHi ? '#f59e0b' : '#4ade80';
      ctx.fill();
      if (isSel) { ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1; }
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(loc.letter, lx + 13, ly + 4);
    }
  }
}
function setZoom(z) { zoom = z; drawCanvas(); }
function zoomIn() { setZoom(Math.min(zoom + 0.25, 3)); }
function zoomOut() { setZoom(Math.max(zoom - 0.25, 0.5)); }
function setView(v) {}

/* ── simulation loop ─────────────────────────────────────────────────────── */
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
let _loopInterval = null;
function startLoop() {
  stopLoop();
  const delays = [0, 800, 500, 300, 150, 60];
  const delay = delays[clamp(speed, 1, 5)];
  _loopInterval = setInterval(simTick, delay);
}
function stopLoop() { if (_loopInterval) { clearInterval(_loopInterval); _loopInterval = null; } }
function simTick() {
  if (!S || S.status === 'finished') { running = false; stopLoop(); updateHUD(); return; }
  if (runToTarget != null && S.day >= runToTarget) { runToTarget = null; running = false; stopLoop(); updateHUD(); return; }
  const ticks = [0, 1, 1, 2, 4, 8][clamp(speed, 1, 5)];
  for (let i = 0; i < ticks; i++) {
    if (!V().step(S)) break;
    if (S.status === 'finished') break;
  }
  if (S.day % 7 === 0) saveGameAuto();
  updateAll();
}
function toggleSim() {
  if (!S) return;
  if (S.status === 'finished') { toast('Simulation complete.', 'info'); return; }
  if (!running) {
    const B = S.biz;
    if (B && B.status !== 'closed' && B.status !== 'open') {
      const why = V().canOpen(B);
      if (why.length) { toast(why[0], 'err'); return; }
    }
  }
  running = !running;
  if (running) startLoop(); else stopLoop();
  updateHUD();
}
function setSpeed(v) {
  speed = clamp(Number(v) || 3, 1, 5);
  if (running) { stopLoop(); startLoop(); }
  setEl('speed-value', speed + 'x');
}
function runTo(day) {
  if (!day) { openModal('modal-runto'); return; }
  runToTarget = Number(day);
  running = true;
  startLoop();
  updateHUD();
}

/* ── modal framework ─────────────────────────────────────────────────────── */
function toggleDD(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(m => {
    if (m.id !== id) m.classList.add('hidden');
  });
  el.classList.remove('hidden');
  refreshModalContent(id);
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}
function refreshModalContent(id) {
  const builders = {
    'modal-form': buildFormModal, 'modal-locate': buildLocateModal,
    'modal-finance': buildFinanceModal, 'modal-team': buildTeamModal,
    'modal-resources': buildResourcesModal, 'modal-hours': buildHoursModal,
    'modal-pricing': buildPricingModal, 'modal-marketing': buildMarketingModal,
    'modal-operations': buildOperationsModal, 'modal-insurance': buildInsuranceModal,
    'modal-survey-new': buildSurveyModal, 'modal-survey-results': buildSurveyResultsModal,
    'modal-transfer': buildTransferModal, 'modal-invest': buildInvestModal,
    'modal-close': buildCloseModal, 'modal-cash': buildProvideCashModal,
    'modal-helpbot': buildHelpbotModal, 'modal-journal': buildJournalModal,
    'modal-scoreboard': buildScoreboardModal, 'modal-dashboard': buildDashboardModal,
    'modal-income': buildIncomeModal, 'modal-balance': buildBalanceModal,
    'modal-sales': buildSalesModal, 'modal-backlog': buildBacklogModal,
    'modal-personal': buildPersonalModal, 'modal-messages': buildMessagesModal,
    'modal-r-competitors': buildCompResearch, 'modal-r-locations': buildLocResearch,
    'modal-r-prices': buildPriceResearch, 'modal-runto': buildRunToModal
  };
  if (builders[id]) builders[id]();
}

/* ── Form Business ────────────────────────────────────────────────────────── */
function buildBTGrid() {
  const D = globalThis.VBC_DATA, CFG = globalThis.VBC_CONFIG;
  const btGrid = document.getElementById('bt-grid');
  if (!btGrid) return;
  btGrid.innerHTML = D.BUSINESS_ROWS.filter(b => CFG.enabledBusinesses.includes(b.key)).map(b =>
    '<div class="bt-card" onclick="selectBizType(\'' + b.key + '\')" id="btc-' + b.key + '">' +
    '<div class="bt-name">' + b.name + '</div>' +
    '<div class="bt-meta">' + b.kind + ' | ' + usd(b.rev) + '/wk | ' + usd(b.build) + ' build-out</div>' +
    '<div class="bt-desc">' + b.desc + '</div></div>'
  ).join('');
  const legalEl = document.getElementById('biz-legal');
  if (legalEl) {
    legalEl.innerHTML = CFG.enabledForms.map(k =>
      '<option value="' + k + '">' + D.FORMS[k].name + ' (fee $' + D.FORMS[k].fee + ')</option>'
    ).join('');
  }
}
function buildFormModal() { /* BT grid is built at init; just highlight selection */ }
function selectBizType(key) {
  selBizType = key;
  document.querySelectorAll('.bt-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('btc-' + key);
  if (card) card.classList.add('selected');
}
function formBusiness() {
  const nameEl = document.getElementById('biz-name-input');
  const legalEl = document.getElementById('biz-legal');
  const name = nameEl ? nameEl.value.trim() : '';
  const form = legalEl ? legalEl.value : 'sole';
  if (!selBizType) { toast('Select a business type.', 'err'); return; }
  const r = V().act.formBusiness(S, { type: selBizType, name, form });
  if (doAction(r)) closeModal('modal-form');
}

/* ── Locate Business ─────────────────────────────────────────────────────── */
function buildLocGrid() { buildLocateModal(); }
function buildLocateModal() {
  const B = S && S.biz;
  const grid = document.getElementById('loc-grid');
  const detail = document.getElementById('loc-detail');
  if (!B || !B.locations) {
    if (grid) grid.innerHTML = '<p style="color:#5070a0">Form a business first to see locations.</p>';
    return;
  }
  if (grid) grid.innerHTML = B.locations.map(loc => {
    const sel = B.loc && B.loc.id === loc.id;
    return '<div class="loc-card' + (sel ? ' selected' : '') + '" onclick="selectLoc(' + loc.id + ')">' +
      '<strong>' + loc.letter + '</strong> &mdash; ' + loc.sqft.toLocaleString() + ' sqft<br>' +
      loc.minutes + ' min &middot; ' + usd(loc.rentWk) + '/wk &middot; ' + loc.competitors.length + ' rival' + (loc.competitors.length !== 1 ? 's' : '') +
      '</div>';
  }).join('');
  if (detail && selLocId != null) {
    const loc = B.locations.find(l => l.id === selLocId);
    if (loc) {
      const fit = V().act.fitCost(B, loc);
      const dep = loc.rentWk * S.cfg.rentDepositWeeks;
      detail.innerHTML = '<h4>Location ' + loc.letter + '</h4>' +
        '<table class="report-table">' +
        '<tr><td>Sq ft</td><td>' + loc.sqft.toLocaleString() + '</td></tr>' +
        '<tr><td>Distance</td><td>' + loc.minutes + ' min</td></tr>' +
        '<tr><td>Weekly Rent</td><td>' + usd(loc.rentWk) + '</td></tr>' +
        '<tr><td>Deposit (' + S.cfg.rentDepositWeeks + ' wk)</td><td>' + usd(dep) + '</td></tr>' +
        '<tr><td>Build-out</td><td>' + usd(fit) + '</td></tr>' +
        '<tr><td>Total needed</td><td>' + usd(fit + dep) + '</td></tr>' +
        '<tr><td>Price index</td><td>' + loc.priceIdx.toFixed(2) + '</td></tr>' +
        '<tr><td>Competitors</td><td>' + loc.competitors.length + '</td></tr>' +
        '</table>' +
        (loc.competitors.length ? loc.competitors.map(c => '<div style="font-size:12px;color:#5070a0">' + c.name + ' &middot; Q' + c.quality + ' &middot; ' + (c.priceRatio * 100).toFixed(0) + '%</div>').join('') : '') +
        '<br><button class="btn btn-primary" onclick="locateBusiness(' + loc.id + ')">Sign Lease</button>';
    }
  }
}
function selectLoc(id) {
  selLocId = id;
  buildLocateModal();
  drawCanvas();
}
function locateBusiness(id) {
  const r = V().act.chooseLocation(S, id != null ? id : selLocId);
  if (doAction(r)) { selLocId = null; closeModal('modal-locate'); }
}

/* ── Finance ─────────────────────────────────────────────────────────────── */
function buildFinanceModal() {
  const el = document.querySelector('#modal-finance .modal-body');
  if (!el || !S) return;
  const B = S.biz;
  const credit = B ? V().act.credit(S) : null;
  const limit = B ? V().act.loanLimit(S) : 0;
  const loans = B ? B.loans : [];
  let html = '<div style="margin-bottom:8px"><strong>Personal Cash:</strong> ' + usd(S.personal.cash);
  if (B) html += ' | <strong>Business Cash:</strong> ' + usd(B.cash);
  html += '</div>';
  html += '<div class="form-group"><label>Personal Investment ($)</label>' +
    '<input class="form-control" id="fin-personal-new" type="number" min="0" max="' + S.personal.cash + '" step="100" placeholder="Amount from savings">' +
    '</div>';
  if (B) {
    html += '<div class="form-group"><label>Bank Loan — Credit: ' + credit.name + ' (' + (credit.rate * 100).toFixed(0) + '% APR, 2-yr term)</label>' +
      '<input class="form-control" id="fin-loan-new" type="number" min="1000" max="' + limit + '" step="1000" placeholder="Available: ' + usd(limit) + '">' +
      '</div>';
    if (loans.length) {
      html += '<div class="form-group"><label>Active Loans</label>';
      loans.forEach(l => {
        html += '<div style="font-size:12px;margin-bottom:4px">' + usd(l.balance) + ' @ ' + (l.rate * 100).toFixed(0) + '% &middot; ' + l.left + ' mo &middot; ' + usd(l.pmt) + '/mo ' +
          '<button class="btn btn-secondary" style="padding:2px 8px;font-size:11px" onclick="repayLoan(' + l.id + ')">Pay Off</button></div>';
      });
      html += '</div>';
    }
    if (V().act.equityAvailable(S)) {
      html += '<div class="form-group"><label>Equity Investor ($5k&ndash;$150k)</label>' +
        '<input class="form-control" id="investor-amt" type="number" min="5000" max="150000" step="1000" placeholder="Investment amount">' +
        '<button class="btn btn-secondary" style="margin-top:4px" onclick="addInvestor()">Add Investor</button></div>';
    } else {
      html += '<p style="color:#5070a0;font-size:12px;margin-top:8px">' + V().act.equityWhy(S) + '</p>';
    }
  }
  el.innerHTML = html;
}
function applyFinancing() {
  const personal = parseFloat(document.getElementById('fin-personal-new')?.value || 0);
  const loan = parseFloat(document.getElementById('fin-loan-new')?.value || 0);
  if (personal > 0) doAction(V().act.personalInvest(S, personal));
  if (loan > 0) doAction(V().act.takeLoan(S, loan));
}
function takeLoan() {
  const amt = parseFloat(document.getElementById('fin-loan-new')?.value || 0);
  doAction(V().act.takeLoan(S, amt));
}
function repayLoan(id) { doAction(V().act.repayLoan(S, id)); }
function addInvestor() {
  const amt = parseFloat(document.getElementById('investor-amt')?.value || 0);
  doAction(V().act.addInvestor(S, amt));
}

/* ── Team ─────────────────────────────────────────────────────────────────── */
function buildTeamModal() {
  const pool = document.getElementById('emp-pool');
  const team = document.getElementById('current-team');
  const summary = document.getElementById('team-summary');
  const B = S && S.biz;
  if (!B) { if (pool) pool.innerHTML = '<p style="color:#5070a0">Form a business first.</p>'; return; }
  if (pool) {
    let html = '';
    for (const role of B.type.roles) {
      const apps = B.applicants[role.key] || [];
      html += '<h4 style="color:#00c896;margin:10px 0 5px">' + role.name + ' (' + usd(role.wage) + '/hr base)</h4>';
      if (!apps.length) { html += '<p style="color:#5070a0;font-size:12px">No applicants on file.</p>'; continue; }
      apps.forEach(a => {
        html += '<div class="applicant-card" style="background:#0d1e35;padding:8px;border-radius:4px;margin-bottom:6px;font-size:12px">' +
          '<strong>' + a.name + '</strong> &middot; ' + a.edu + '<br>' +
          'Skill: ' + a.skill + '/100 &middot; Asks: ' + usd(a.ask) + '/hr &middot; Exp: ' + a.exp + ' yr<br>' +
          (a.jobs.length ? '<span style="color:#5070a0">' + a.jobs.map(j => j.from + '&ndash;' + j.to + ': ' + j.title).join(' | ') + '</span><br>' : '') +
          '<input type="number" id="wage-' + a.id + '" value="' + a.ask + '" step="0.25" style="width:80px;margin-top:4px"> ' +
          '<button class="btn btn-primary" style="padding:3px 8px;font-size:11px" onclick="hireApplicant(' + a.id + ')">Hire</button> ' +
          '<button class="btn btn-secondary" style="padding:3px 8px;font-size:11px" onclick="rejectApplicant(' + a.id + ')">Skip</button>' +
          '</div>';
      });
    }
    pool.innerHTML = html;
  }
  if (team) {
    if (!B.staff.length) { team.innerHTML = '<p style="color:#5070a0;font-size:12px">No staff yet.</p>'; }
    else {
      team.innerHTML = B.staff.map(e => {
        const role = B.type.roles.find(r => r.key === e.role) || B.type.roles[0];
        return '<div style="background:#0d1e35;padding:8px;border-radius:4px;margin-bottom:6px;font-size:12px">' +
          '<strong>' + e.name + '</strong> (' + role.name + ')<br>' +
          'Skill: ' + e.skill + '/100 &middot; Morale: ' + e.morale.toFixed(0) + ' &middot; ' + usd(e.wage) + '/hr<br>' +
          '<input type="number" id="newwage-' + e.id + '" value="' + e.wage + '" step="0.25" style="width:80px;margin-top:4px"> ' +
          '<button class="btn btn-secondary" style="padding:3px 8px;font-size:11px" onclick="setWage(' + e.id + ')">Set Wage</button> ' +
          '<button class="btn btn-secondary" style="padding:3px 8px;font-size:11px" onclick="trainEmp(' + e.id + ')">Train $300</button> ' +
          '<button class="btn" style="padding:3px 8px;font-size:11px;background:#3a1a1a;color:#f87171" onclick="fireEmp(' + e.id + ')">Fire</button>' +
          '</div>';
      }).join('');
    }
  }
  if (summary) {
    const lh = B.loc ? V().laborHours(B).toFixed(1) : '—';
    const sq = V().serviceQuality(B).toFixed(0);
    summary.innerHTML = 'Staff: ' + B.staff.length + ' | Labor hrs/day: ' + lh + ' | Service quality: ' + sq + '/100';
  }
}
function hireApplicant(aid) {
  const wageEl = document.getElementById('wage-' + aid);
  const wage = wageEl ? parseFloat(wageEl.value) : 0;
  doAction(V().act.hire(S, aid, wage));
}
function rejectApplicant(aid) { doAction(V().act.rejectApplicant(S, aid)); }
function fireEmp(eid) { doAction(V().act.fire(S, eid)); }
function setWage(eid) {
  const wageEl = document.getElementById('newwage-' + eid);
  const wage = wageEl ? parseFloat(wageEl.value) : 0;
  doAction(V().act.setWage(S, eid, wage));
}
function trainEmp(eid) { doAction(V().act.train(S, eid)); }

/* ── Resources ────────────────────────────────────────────────────────────── */
function buildResourcesModal() {
  const cashEl = document.getElementById('res-cash');
  const eqEl = document.getElementById('eq-list');
  const B = S && S.biz;
  if (!B) {
    if (cashEl) cashEl.innerHTML = 'Form a business first.';
    if (eqEl) eqEl.innerHTML = '';
    return;
  }
  if (cashEl) cashEl.innerHTML = 'Business Cash: <strong>' + usd(B.cash) + '</strong>';
  if (eqEl) {
    const storageCap = V().storageCap(B);
    const storageUsed = V().storageUsed(B);
    let html = '<h4 style="color:#00c896;margin:8px 0 5px">Equipment</h4>';
    B.type.equip.forEach((e, i) => {
      const owned = !!B.equip[e.id];
      html += '<div style="margin-bottom:6px;font-size:12px">' +
        (owned ? '<span style="color:#4ade80">&#10003;</span> ' : '') +
        '<strong>' + e.name + '</strong> &mdash; ' + usd(e.cost) + ' ';
      if (owned) html += '<button class="btn btn-secondary" style="padding:2px 8px;font-size:11px" onclick="sellEq(' + i + ')">Sell (' + usd(Math.round(e.cost * 0.4)) + ')</button>';
      else html += '<button class="btn btn-primary" style="padding:2px 8px;font-size:11px" onclick="buyEq(' + i + ')">Buy</button>';
      html += '</div>';
    });
    html += '<h4 style="color:#00c896;margin:12px 0 5px">Supplies (' + storageUsed + '/' + storageCap + ' lots)</h4>';
    B.type.supplies.forEach(s => {
      const onHand = (B.inv[s.id] || 0).toFixed(2);
      html += '<div style="margin-bottom:6px;font-size:12px">' +
        '<strong>' + s.name + '</strong>: ' + onHand + ' lots on hand<br>' +
        '<button class="btn btn-primary" style="padding:2px 8px;font-size:11px" onclick="buyLot(\'' + s.id + '\')">Buy lot (' + usd(V().lotCost(B, s)) + ')</button> ' +
        '</div>';
    });
    html += '<div style="margin-top:8px;font-size:12px"><label><input type="checkbox" ' + (B.autoReorder ? 'checked' : '') + ' onchange="setAutoReorder(this.checked)"> Auto-reorder supplies when low</label></div>';
    eqEl.innerHTML = html;
  }
}
function buyEq(i) { doAction(V().act.buyEquip(S, i)); }
function sellEq(i) { doAction(V().act.sellEquip(S, i)); }
function buyLot(id) { doAction(V().act.addStorage(S, id)); }
function setAutoReorder(v) { doAction(V().act.setAutoReorder(S, v)); }

/* ── Hours ────────────────────────────────────────────────────────────────── */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function buildHoursTable() {
  const tbl = document.getElementById('hours-table');
  if (!tbl) return;
  const B = S && S.biz;
  const days = B ? B.days : [false, true, true, true, true, true, false];
  const openH = B ? B.open : 8, closeH = B ? B.close : 17;
  tbl.innerHTML = '<tr><th>Day</th><th>Open?</th><th>Open</th><th>Close</th></tr>' +
    DAY_NAMES.map((d, i) =>
      '<tr><td>' + d + '</td>' +
      '<td><input type="checkbox" id="h-day-' + i + '" ' + (days[i] ? 'checked' : '') + '></td>' +
      '<td><input type="number" id="h-open-' + i + '" value="' + openH + '" min="0" max="23" style="width:50px"></td>' +
      '<td><input type="number" id="h-close-' + i + '" value="' + closeH + '" min="1" max="24" style="width:50px"></td>' +
      '</tr>'
    ).join('');
}
function buildHoursModal() {
  buildHoursTable();
  const summary = document.getElementById('hours-summary');
  const B = S && S.biz;
  if (summary && B) {
    summary.innerHTML = 'Hours/day: ' + V().hoursOf(B) + ' | Days/wk: ' + B.days.filter(Boolean).length + ' | Labor hrs: ' + (B.loc ? V().laborHours(B).toFixed(1) : '—');
  }
}
function saveHours() {
  const B = S && S.biz;
  if (!B) return;
  const days = DAY_NAMES.map((_, i) => !!(document.getElementById('h-day-' + i)?.checked));
  const openEl = document.getElementById('h-open-0');
  const closeEl = document.getElementById('h-close-0');
  const open = openEl ? parseInt(openEl.value) : 8;
  const close = closeEl ? parseInt(closeEl.value) : 17;
  doAction(V().act.setHours(S, { open, close, days }));
}

/* ── Pricing ──────────────────────────────────────────────────────────────── */
function buildPricingModal() {
  const body = document.querySelector('#modal-pricing .modal-body');
  if (!body || !S || !S.biz) {
    if (body) body.innerHTML = '<p style="color:#5070a0">Form a business first.</p>';
    return;
  }
  const B = S.biz;
  let html = '<p style="font-size:12px;color:#5070a0;margin-bottom:10px">Set prices for each product. Price of $0 = not offered.</p>';
  B.type.products.forEach(p => {
    const cur = B.prices[p.key] || 0;
    const owned = p.req.every(i => V().ownsEquip(B, i));
    html += '<div style="margin-bottom:12px;padding:8px;background:#0d1e35;border-radius:4px">' +
      '<div style="font-weight:bold;margin-bottom:4px">' + p.name + (owned ? '' : ' <span style="color:#f59e0b;font-size:11px">(needs equipment)</span>') + '</div>' +
      '<div style="font-size:11px;color:#5070a0;margin-bottom:4px">Survey: Low ' + usd(p.low) + ' | Med ' + usd(p.med) + ' | High ' + usd(p.high) + '</div>' +
      '<input class="form-control" type="number" id="price-' + p.key + '" value="' + cur + '" step="1" min="0" placeholder="0 = not offered" style="width:140px">' +
      '</div>';
  });
  body.innerHTML = html;
}
function savePricing() {
  const B = S && S.biz;
  if (!B) return;
  const prices = {};
  B.type.products.forEach(p => {
    const el = document.getElementById('price-' + p.key);
    prices[p.key] = el ? parseFloat(el.value) || 0 : 0;
  });
  doAction(V().act.setPrices(S, prices));
}

/* ── Marketing ────────────────────────────────────────────────────────────── */
function buildMarketingModal() {
  const body = document.querySelector('#modal-marketing .modal-body');
  if (!body || !S || !S.biz) { if (body) body.innerHTML = '<p>Form a business first.</p>'; return; }
  const B = S.biz;
  const ad = B.ads[0] || { budget: 0, fb: false, ig: false, aud: 'all', headline: '', text: '', image: '' };
  const AUDIENCES = globalThis.VBC_DATA.AUDIENCES;
  body.innerHTML =
    '<p style="font-size:12px;margin-bottom:8px">Awareness: <strong>' + B.awareness.toFixed(0) + '</strong>/100 (decays each day without ads)</p>' +
    '<div class="form-group"><label>Weekly Ad Budget ($0&ndash;3000)</label>' +
    '<input class="form-control" id="mkt-budget" type="number" min="0" max="3000" step="50" value="' + ad.budget + '"></div>' +
    '<div class="form-group"><label>Platforms</label>' +
    '<div style="display:flex;gap:12px;font-size:12px">' +
    '<label><input type="checkbox" id="mkt-fb" ' + (ad.fb ? 'checked' : '') + '> Facebook</label>' +
    '<label><input type="checkbox" id="mkt-ig" ' + (ad.ig ? 'checked' : '') + '> Instagram</label>' +
    '</div></div>' +
    '<div class="form-group"><label>Audience</label>' +
    '<select class="form-control" id="mkt-aud">' +
    Object.entries(AUDIENCES).map(([k, v]) => '<option value="' + k + '"' + (ad.aud === k ? ' selected' : '') + '>' + v + '</option>').join('') +
    '</select></div>' +
    '<div class="form-group"><label>Headline (include business name + product)</label>' +
    '<input class="form-control" id="mkt-headline" type="text" value="' + (ad.headline || '').replace(/"/g, '&quot;') + '" placeholder="e.g. &quot;' + (B.name || 'My Business') + ' — Wiring for New Homes&quot;"></div>' +
    '<div class="form-group"><label>Ad Text</label>' +
    '<textarea class="form-control" id="mkt-text" rows="2">' + (ad.text || '') + '</textarea></div>' +
    '<div class="form-group"><label><input type="checkbox" id="mkt-image" ' + (ad.image ? 'checked' : '') + '> Include image (boosts effectiveness)</label></div>';
}
function saveMarketing() {
  const budget = parseFloat(document.getElementById('mkt-budget')?.value || 0);
  const fb = !!(document.getElementById('mkt-fb')?.checked);
  const ig = !!(document.getElementById('mkt-ig')?.checked);
  const aud = document.getElementById('mkt-aud')?.value || 'all';
  const headline = document.getElementById('mkt-headline')?.value || '';
  const text = document.getElementById('mkt-text')?.value || '';
  const image = !!(document.getElementById('mkt-image')?.checked);
  doAction(V().act.setAd(S, { budget, fb, ig, aud, headline, text, image: image ? 'yes' : '' }));
}

/* ── Operations ───────────────────────────────────────────────────────────── */
function buildOperationsModal() {
  const body = document.querySelector('#modal-operations .modal-body');
  if (!body || !S || !S.biz) { if (body) body.innerHTML = '<p>Form a business first.</p>'; return; }
  const B = S.biz;
  const SUPPLIER = V().SUPPLIER;
  body.innerHTML =
    '<div class="form-group"><label>Supplier</label>' +
    '<select class="form-control" id="ops-supplier">' +
    SUPPLIER.map((s, i) => '<option value="' + i + '"' + (B.ops.supplier === i ? ' selected' : '') + '>' + s.n + ' (' + (s.c > 1 ? '+' : '') + ((s.c - 1) * 100).toFixed(0) + '% cost, ' + (s.q >= 0 ? '+' : '') + s.q + ' quality)</option>').join('') +
    '</select></div>' +
    '<div class="form-group"><label>QA Level (0=none, 3=high, costs $60&times;level/day)</label>' +
    '<input class="form-control" type="range" id="ops-qa" min="0" max="3" value="' + B.ops.qa + '" oninput="document.getElementById(\'ops-qa-val\').textContent=this.value">' +
    '<span id="ops-qa-val">' + B.ops.qa + '</span></div>' +
    '<div class="form-group"><label><input type="checkbox" id="ops-loyalty" ' + (B.ops.loyalty ? 'checked' : '') + '> Loyalty Program (+2 quality, +6% demand, costs 1.5% revenue)</label></div>' +
    '<p style="font-size:12px;color:#5070a0;margin-top:8px">Current service quality: ' + V().serviceQuality(B).toFixed(0) + '/100</p>';
}
function saveOps() {
  const B = S && S.biz;
  if (!B) return;
  const supplier = parseInt(document.getElementById('ops-supplier')?.value || 1);
  const qa = parseInt(document.getElementById('ops-qa')?.value || 0);
  const loyalty = !!(document.getElementById('ops-loyalty')?.checked);
  doAction(V().act.setOps(S, { supplier, qa, loyalty }));
}
function saveOperations() { saveOps(); }

/* ── Insurance ────────────────────────────────────────────────────────────── */
function buildInsuranceModal() {
  const body = document.querySelector('#modal-insurance .modal-body');
  if (!body || !S || !S.biz) { if (body) body.innerHTML = '<p>Form a business first.</p>'; return; }
  const B = S.biz;
  const INS = V().INS;
  body.innerHTML =
    '<p style="font-size:12px;margin-bottom:10px">Insurance protects against random incidents. A random event can cost thousands.</p>' +
    '<div class="form-group"><label>Insurance Plan</label>' +
    '<select class="form-control" id="ins-plan">' +
    INS.map((p, i) => '<option value="' + i + '"' + (B.insurance === i ? ' selected' : '') + '>' + p.n + ' &mdash; ' + (p.p * 100).toFixed(1) + '% rev/mo &middot; ' + (p.cov * 100).toFixed(0) + '% coverage</option>').join('') +
    '</select></div>';
}
function saveInsurance() {
  const plan = parseInt(document.getElementById('ins-plan')?.value || 0);
  doAction(V().act.setInsurance(S, plan));
}

/* ── Survey New ───────────────────────────────────────────────────────────── */
function buildSurveyModal() {
  const body = document.querySelector('#modal-survey-new .modal-body');
  if (!body || !S || !S.biz) { if (body) body.innerHTML = '<p>Form a business first.</p>'; return; }
  body.innerHTML =
    '<p style="font-size:12px;margin-bottom:10px">Results arrive in 3 simulation days. Each survey costs money.</p>' +
    '<div class="form-group"><label>Survey Type</label>' +
    '<select class="form-control" id="survey-topic">' +
    '<option value="price">Price Survey ($250) &mdash; Low/med/high price sensitivity report</option>' +
    '<option value="quality">Quality Survey ($250) &mdash; What customers care about most</option>' +
    '<option value="awareness">Awareness Survey ($150) &mdash; How many people know your business</option>' +
    '</select></div>';
}
function conductSurvey() {
  const kind = document.getElementById('survey-topic')?.value || 'price';
  doAction(V().act.runSurvey(S, kind));
}

/* ── Survey Results ───────────────────────────────────────────────────────── */
function buildSurveyResultsModal() {
  const body = document.getElementById('survey-results-body');
  if (!body || !S) return;
  const surveys = (S.surveys || []).filter(s => s.done).slice(-10).reverse();
  if (!surveys.length) { body.innerHTML = '<p style="color:#5070a0">No survey results yet. Order a survey via Actions &rsaquo; New Survey.</p>'; return; }
  body.innerHTML = surveys.map(s => {
    const dateStr = fmtDateShort(s.readyDay || s.orderedDay);
    let html = '<div style="margin-bottom:14px"><strong>' + s.kind + ' Survey</strong> &mdash; ' + dateStr + '<br>';
    if (s.kind === 'price' && Array.isArray(s.result)) {
      s.result.forEach(p => {
        html += '<div style="margin-top:6px"><em>' + p.name + '</em> (med: ' + usd(p.med) + ')<br>';
        html += p.curve.map(c => (c.r * 100).toFixed(0) + '%: ' + c.buy + '%').join(' &middot; ') + '</div>';
      });
    } else if (s.kind === 'quality' && s.result) {
      Object.entries(s.result.importance || {}).forEach(([k, v]) => { html += '<div>' + k + ': ' + v + '/100</div>'; });
    } else if (s.kind === 'awareness' && s.result) {
      html += '<div>Awareness: ' + s.result.awareness + '/100</div><div style="color:#5070a0">' + (s.result.best || '') + '</div>';
    }
    html += '</div>';
    return html;
  }).join('');
}

/* ── Transfer Funds ───────────────────────────────────────────────────────── */
function buildTransferModal() {
  const body = document.querySelector('#modal-transfer .modal-body');
  if (!body) return;
  const B = S && S.biz;
  body.innerHTML = '<h4 style="margin-bottom:8px">Transfer Business Cash to Personal</h4>' +
    '<p style="font-size:12px;margin-bottom:8px">Business: <strong>' + (B ? usd(B.cash) : '—') + '</strong> | Personal: <strong>' + usd(S.personal.cash) + '</strong></p>' +
    (B ? '<div class="form-group"><input class="form-control" type="number" id="transfer-amt" placeholder="Amount" min="1" max="' + B.cash + '">' +
    '<button class="btn btn-primary" style="margin-top:4px" onclick="transferFunds()">Transfer</button></div>' :
    '<p style="color:#5070a0">Form a business first.</p>');
}
function transferFunds() {
  const amt = parseFloat(document.getElementById('transfer-amt')?.value || 0);
  doAction(V().act.transferOut(S, amt));
}

/* ── Invest (personal) ────────────────────────────────────────────────────── */
function buildInvestModal() {
  const body = document.querySelector('#modal-invest .modal-body');
  if (!body) return;
  const FUNDS = V().FUNDS;
  const pos = S.personal.positions;
  body.innerHTML = '<p style="font-size:12px;margin-bottom:8px">Personal Cash: <strong>' + usd(S.personal.cash) + '</strong></p>' +
    Object.entries(FUNDS).map(([k, f]) =>
      '<div style="margin-bottom:10px;padding:8px;background:#0d1e35;border-radius:4px;font-size:12px">' +
      '<strong>' + f.n + '</strong> &mdash; APY ' + (f.apy * 100).toFixed(1) + '% vol ' + (f.vol * 100).toFixed(0) + '%<br>' +
      'Balance: ' + usd(pos[k] || 0) + '<br>' +
      '<input class="form-control" type="number" id="inv-' + k + '" placeholder="Amount (negative to sell)" style="width:140px;margin-top:4px"> ' +
      '<button class="btn btn-primary" style="padding:3px 8px;font-size:11px" onclick="doInvest(\'' + k + '\')">Invest</button>' +
      '</div>'
    ).join('');
}
function doInvest(fund) {
  const amt = parseFloat(document.getElementById('inv-' + fund)?.value || 0);
  doAction(V().act.invest(S, fund, amt));
}
function doPersonalInvest(fund) {
  if (fund) doInvest(fund);
  else {
    const amt = parseFloat(document.getElementById('fin-personal-new')?.value || 0);
    doAction(V().act.personalInvest(S, amt));
  }
}

/* ── Close Business ───────────────────────────────────────────────────────── */
function buildCloseModal() {
  const body = document.querySelector('#modal-close .modal-body');
  if (!body) return;
  const B = S && S.biz;
  if (!B || B.status === 'closed') { body.innerHTML = '<p style="color:#5070a0">No active business.</p>'; return; }
  const proceeds = Math.round(V().nbv(B) * S.cfg.resaleFraction + V().invValue(B) * 0.3 + B.deposit - V().totalLoans(B));
  body.innerHTML = '<p>Close your business and liquidate all assets?</p>' +
    '<p>Estimated proceeds: <strong>' + usd(proceeds) + '</strong></p>' +
    '<button class="btn" style="background:#3a1a1a;color:#f87171;padding:6px 14px" onclick="closeBusiness()">Confirm Close</button>';
}
function closeBusiness() {
  if (confirm('Really close the business? This cannot be undone.')) {
    doAction(V().act.closeBusiness(S));
    closeModal('modal-close');
  }
}

/* ── Provide Cash (teacher) ───────────────────────────────────────────────── */
function buildProvideCashModal() {
  const body = document.querySelector('#modal-cash .modal-body');
  if (!body) return;
  body.innerHTML = '<h4 style="margin-bottom:8px">Provide Cash (Teacher Tool)</h4>' +
    '<p style="font-size:12px;margin-bottom:8px">Personal cash: <strong>' + usd(S.personal.cash) + '</strong></p>' +
    '<div class="form-group"><input class="form-control" type="number" id="cash-amt" placeholder="Amount (max $250,000)" min="1" max="250000">' +
    '<button class="btn btn-primary" style="margin-top:4px" onclick="doProvideCash()">Add Cash</button></div>' +
    '<p style="font-size:11px;color:#5070a0;margin-top:6px">Teacher-provided cash is excluded from grade calculation.</p>';
}
function provideCash() { openModal('modal-cash'); }
function doProvideCash() {
  const amt = parseFloat(document.getElementById('cash-amt')?.value || 0);
  doAction(V().act.provideCash(S, amt));
}

/* ── Run-To modal ─────────────────────────────────────────────────────────── */
function buildRunToModal() {
  const cur = document.getElementById('runto-current');
  if (cur && S) cur.textContent = S.day;
  const input = document.getElementById('runto-day');
  if (input && S) {
    input.min = S.day + 1;
    input.max = S.cfg.simDays;
    input.placeholder = 'e.g. ' + Math.min(S.day + 30, S.cfg.simDays);
  }
}
function runToDay() {
  const day = parseInt(document.getElementById('runto-day')?.value || 0);
  if (S && day > S.day && day <= S.cfg.simDays) {
    closeModal('modal-runto');
    runTo(day);
  }
}

/* ── Helpbot ──────────────────────────────────────────────────────────────── */
function buildHelpbotModal() {
  const el = document.getElementById('helpbot-body');
  if (!el || !S) return;
  const T = globalThis.VBC_DATA.BUSINESS_ROWS.find(b => S.biz && b.key === S.biz.key);
  const goalNW = V().goalNW(S);
  const faqs = [
    ['What is my goal?', 'Reach a net worth of ' + usd(goalNW) + ' within ' + S.cfg.simDays + ' days to earn 100 grade points.'],
    ['How is grade calculated?', 'Grade = (Scored Net Worth &minus; Start NW) &divide; (Goal NW &minus; Start NW) &times; 100.'],
    ['How do I improve service quality?', 'Buy quality equipment, hire senior staff (tier 2), use Standard/Premium supplier, raise QA level.'],
    ['What drives demand?', 'Market share &times; price factor &times; traffic efficiency &times; hours factor &times; awareness &times; seasonality &times; day-of-week.'],
    ['How does pricing work?', 'Each product has low/med/high Price Survey anchors. Med = 1.0 demand factor. Pricing above or below shifts demand on a curve.'],
    T ? ['About ' + T.name, T.desc] : null
  ].filter(Boolean);
  el.innerHTML = faqs.map(([q, a]) =>
    '<div style="margin-bottom:10px"><div style="font-weight:bold;color:#00c896;margin-bottom:3px">' + q + '</div>' +
    '<div style="font-size:12px;color:#c0d0e0">' + a + '</div></div>'
  ).join('');
}

/* ── Journal ──────────────────────────────────────────────────────────────── */
function buildJournalModal() {
  const el = document.querySelector('#modal-journal .modal-body');
  if (!el || !S) return;
  const entries = (S.journal || []).slice(-100).reverse();
  if (!entries.length) { el.innerHTML = '<p style="color:#5070a0">No entries yet.</p>'; return; }
  el.innerHTML = entries.map(e => {
    const d = fmtDateShort(e.day);
    return '<div style="margin-bottom:5px;font-size:12px"><span style="color:#5070a0;margin-right:8px">' + d + '</span>' + e.text + '</div>';
  }).join('');
}

/* ── Messages ─────────────────────────────────────────────────────────────── */
function buildMessagesModal() {
  const el = document.getElementById('msg-list');
  if (!el || !S) return;
  const msgs = (S.messages || []).slice(-60).reverse();
  if (!msgs.length) { el.innerHTML = '<p style="color:#5070a0">No messages yet.</p>'; return; }
  el.innerHTML = msgs.map(m => {
    const d = fmtDateShort(m.day);
    const color = m.type === 'warn' ? '#f59e0b' : m.type === 'event' ? '#60a5fa' : m.type === 'survey' ? '#a78bfa' : '#4ade80';
    return '<div style="margin-bottom:6px;font-size:12px"><span style="color:#5070a0;margin-right:8px">' + d + '</span>' +
      '<span style="color:' + color + '">[' + m.type + ']</span> ' + m.text + '</div>';
  }).join('');
}

/* ── Scoreboard ───────────────────────────────────────────────────────────── */
function buildScoreboardModal() {
  const el = document.getElementById('scoreboard-body');
  if (!el || !S) return;
  const rivals = V().rivals ? V().rivals(S) : [];
  const myNW = V().netWorth(S);
  const myGrade = V().grade(S);
  const rows = [{ name: 'You', nw: myNW, grade: myGrade, me: true }, ...rivals]
    .sort((a, b) => b.nw - a.nw);
  el.innerHTML = '<table class="report-table"><tr><th>#</th><th>Team</th><th>Net Worth</th><th>Grade</th></tr>' +
    rows.map((r, i) =>
      '<tr' + (r.me ? ' style="background:#0d2a3a;color:#00e5b5"' : '') + '>' +
      '<td>' + (i + 1) + '</td><td>' + r.name + '</td><td>' + usd(r.nw) + '</td>' +
      '<td>' + (r.grade ? r.grade.toFixed(1) : '—') + '</td></tr>'
    ).join('') + '</table>';
}

/* ── Dashboard ────────────────────────────────────────────────────────────── */
function buildDashboardModal() {
  const el = document.getElementById('dashboard-body');
  if (!el || !S) return;
  const B = S.biz;
  const nw = V().netWorth(S);
  const g = V().grade(S);
  const goalNW = V().goalNW(S);
  let html = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">';
  const tile = (label, val) => '<div style="background:#0d1e35;padding:8px;border-radius:4px;text-align:center"><div style="font-size:11px;color:#5070a0">' + label + '</div><div style="font-size:16px;font-weight:bold;color:#00e5b5">' + val + '</div></div>';
  html += tile('Net Worth', usd(nw));
  html += tile('Grade', g.toFixed(1) + '/100');
  html += tile('Goal', usd(goalNW));
  html += tile('Day', S.day + ' / ' + S.cfg.simDays);
  html += tile('Personal Cash', usd(S.personal.cash));
  if (B) {
    html += tile('Business Cash', usd(B.cash));
    html += tile('Service Quality', V().serviceQuality(B).toFixed(0) + '/100');
    if (B.loc && B.staff.length) html += tile('Market Share', (V().marketShare(S, B) * 100).toFixed(1) + '%');
    html += tile('Monthly Rev', usd(B.led.cur.rev));
    html += tile('Monthly Profit', usd(V().netIncome(B.led.cur)));
  }
  html += '</div>';
  if (B && B.lastDay) {
    const diag = V().diagnose ? V().diagnose(S) : [];
    if (diag.length) {
      html += '<h4 style="color:#00c896;margin-bottom:6px">Status</h4>';
      html += diag.slice(0, 4).map(d => '<div style="font-size:12px;margin-bottom:4px;color:' + (d.sev === 'bad' ? '#f87171' : d.sev === 'warn' ? '#f59e0b' : d.sev === 'good' ? '#4ade80' : '#c0d0e0') + '">' + d.text + '</div>').join('');
    }
  }
  el.innerHTML = html;
}

/* ── Income Statement ─────────────────────────────────────────────────────── */
function buildIncomeModal() {
  const el = document.getElementById('income-body');
  if (!el || !S || !S.biz) { if (el) el.innerHTML = '<p style="color:#5070a0">No business data.</p>'; return; }
  const B = S.biz;
  const EXP = V().EXP || ['cogs', 'wages', 'rent', 'utilities', 'marketing', 'insurance', 'depreciation', 'interest', 'taxes', 'other'];
  const rowHtml = (label, val) => '<tr><td>' + label + '</td><td style="text-align:right;' + (val < 0 ? 'color:#f87171' : '') + '">' + usd(val) + '</td></tr>';
  el.innerHTML = '<h4 style="color:#00c896;margin-bottom:6px">This Month</h4>' +
    '<table class="report-table">' + rowHtml('Revenue', B.led.cur.rev) +
    EXP.map(k => rowHtml(k.charAt(0).toUpperCase() + k.slice(1), -B.led.cur[k])).join('') +
    '<tr style="font-weight:bold;border-top:1px solid #2a4a7e"><td>Net Income</td><td style="text-align:right">' + usd(V().netIncome(B.led.cur)) + '</td></tr>' +
    '</table><h4 style="color:#00c896;margin:10px 0 6px">All Time</h4>' +
    '<table class="report-table">' + rowHtml('Revenue', B.led.tot.rev) +
    EXP.map(k => rowHtml(k.charAt(0).toUpperCase() + k.slice(1), -B.led.tot[k])).join('') +
    '<tr style="font-weight:bold;border-top:1px solid #2a4a7e"><td>Net Income</td><td style="text-align:right">' + usd(V().netIncome(B.led.tot)) + '</td></tr>' +
    '</table>';
}

/* ── Balance Sheet ────────────────────────────────────────────────────────── */
function buildBalanceModal() {
  const el = document.getElementById('balance-body');
  if (!el || !S) { if (el) el.innerHTML = '<p>No data.</p>'; return; }
  const bs = V().balanceSheet(S);
  if (!bs) { el.innerHTML = '<p style="color:#5070a0">No business data.</p>'; return; }
  el.innerHTML = '<table class="report-table">' +
    '<tr style="font-weight:bold"><td colspan="2">Assets</td></tr>' +
    '<tr><td>Cash</td><td style="text-align:right">' + usd(bs.assets.cash) + '</td></tr>' +
    '<tr><td>Inventory</td><td style="text-align:right">' + usd(bs.assets.inventory) + '</td></tr>' +
    '<tr><td>Equipment (gross)</td><td style="text-align:right">' + usd(bs.assets.equipment) + '</td></tr>' +
    '<tr><td>Accum. Depreciation</td><td style="text-align:right">' + usd(bs.assets.accDep) + '</td></tr>' +
    '<tr><td>Security Deposit</td><td style="text-align:right">' + usd(bs.assets.deposit) + '</td></tr>' +
    '<tr style="font-weight:bold;border-top:1px solid #2a4a7e"><td>Total Assets</td><td style="text-align:right">' + usd(bs.totalAssets) + '</td></tr>' +
    '<tr style="font-weight:bold"><td colspan="2">Liabilities &amp; Equity</td></tr>' +
    '<tr><td>Loans Payable</td><td style="text-align:right">' + usd(bs.loans) + '</td></tr>' +
    '<tr><td>Owner Contributions</td><td style="text-align:right">' + usd(bs.contrib) + '</td></tr>' +
    '<tr><td>Retained Earnings</td><td style="text-align:right">' + usd(bs.retained) + '</td></tr>' +
    '<tr style="font-weight:bold;border-top:1px solid #2a4a7e"><td>Total L+E</td><td style="text-align:right">' + usd(bs.equity + bs.loans) + '</td></tr>' +
    '</table>';
}

/* ── Sales Report ──────────────────────────────────────────────────────────── */
function buildSalesModal() {
  const el = document.getElementById('sales-body');
  if (!el || !S || !S.biz) { if (el) el.innerHTML = '<p style="color:#5070a0">No sales data yet.</p>'; return; }
  const B = S.biz;
  const daily = (B.daily || []).slice(-30).reverse();
  if (!daily.length) { el.innerHTML = '<p style="color:#5070a0">No sales data yet. Run the simulation first.</p>'; return; }
  el.innerHTML = '<table class="report-table"><tr><th>Date</th><th>Units</th><th>Revenue</th><th>Demand</th></tr>' +
    daily.map(d => '<tr><td>' + fmtDateShort(d.day) + '</td><td>' + (d.served || 0).toFixed(1) + '</td><td>' + usd(d.rev || 0) + '</td><td>' + (d.demand || 0).toFixed(1) + '</td></tr>').join('') +
    '</table>';
}

/* ── Backlog ───────────────────────────────────────────────────────────────── */
function buildBacklogModal() {
  const el = document.getElementById('backlog-body');
  if (!el || !S || !S.biz) { if (el) el.innerHTML = '<p style="color:#5070a0">No backlog.</p>'; return; }
  const B = S.biz;
  const q = B.queue || [];
  if (!q.length) { el.innerHTML = '<p style="color:#5070a0">Backlog is empty.</p>'; return; }
  el.innerHTML = '<table class="report-table"><tr><th>Product</th><th>Qty</th><th>Price</th><th>Age</th></tr>' +
    q.map(item => {
      const p = B.type.products.find(x => x.key === item.p);
      return '<tr><td>' + (p ? p.name : item.p) + '</td><td>' + item.n.toFixed(1) + '</td><td>' + usd(B.prices[item.p] || 0) + '</td><td>' + (item.age || 0) + ' days</td></tr>';
    }).join('') + '</table>';
}

/* ── Personal Summary ────────────────────────────────────────────────────── */
function buildPersonalModal() {
  const el = document.getElementById('personal-body');
  if (!el || !S) return;
  const FUNDS = V().FUNDS;
  const pos = S.personal.positions;
  const totalInv = Object.values(pos).reduce((s, v) => s + v, 0);
  el.innerHTML = '<table class="report-table">' +
    '<tr><td>Personal Cash</td><td style="text-align:right">' + usd(S.personal.cash) + '</td></tr>' +
    Object.entries(FUNDS).map(([k, f]) =>
      '<tr><td>' + f.n + ' (' + (f.apy * 100).toFixed(1) + '% APY)</td><td style="text-align:right">' + usd(pos[k] || 0) + '</td></tr>'
    ).join('') +
    '<tr style="font-weight:bold;border-top:1px solid #2a4a7e"><td>Total Investments</td><td style="text-align:right">' + usd(totalInv) + '</td></tr>' +
    '<tr style="font-weight:bold"><td>Total Personal NW</td><td style="text-align:right">' + usd(S.personal.cash + totalInv) + '</td></tr>' +
    '</table>';
}

/* ── Research modals ─────────────────────────────────────────────────────── */
function buildCompResearch() {
  const el = document.getElementById('comp-research-body');
  if (!el || !S || !S.biz) { if (el) el.innerHTML = '<p>Choose a location first.</p>'; return; }
  const B = S.biz;
  if (!B.loc) { el.innerHTML = '<p style="color:#5070a0">Choose a location first to see local competitors.</p>'; return; }
  el.innerHTML = '<h4 style="margin-bottom:8px">Competitors at ' + B.loc.name + '</h4>' +
    (B.loc.competitors.length ?
      B.loc.competitors.map(c =>
        '<div style="margin-bottom:8px;padding:8px;background:#0d1e35;border-radius:4px;font-size:12px">' +
        '<strong>' + c.name + '</strong><br>Quality: ' + c.quality + '/100 | Price: ' + (c.priceRatio * 100).toFixed(0) + '% of market</div>'
      ).join('') :
      '<p style="color:#5070a0">No competitors at this location — rare advantage!</p>');
}
function buildLocResearch() {
  const el = document.getElementById('loc-research-body');
  if (!el || !S || !S.biz) { if (el) el.innerHTML = '<p>Form a business first.</p>'; return; }
  buildLocateModal();
  const grid = document.getElementById('loc-grid');
  el.innerHTML = grid ? grid.innerHTML : '';
}
function buildPriceResearch() {
  const el = document.getElementById('price-research-body');
  if (!el || !S || !S.biz) { if (el) el.innerHTML = '<p>Form a business first.</p>'; return; }
  const B = S.biz;
  el.innerHTML = '<h4 style="margin-bottom:8px">Price Survey Reference</h4>' +
    '<table class="report-table"><tr><th>Product</th><th>Low</th><th>Med</th><th>High</th></tr>' +
    B.type.products.map(p =>
      '<tr><td>' + p.name + '</td><td>' + usd(p.low) + '</td><td>' + usd(p.med) + '</td><td>' + usd(p.high) + '</td></tr>'
    ).join('') + '</table>';
}

/* ── Finish ───────────────────────────────────────────────────────────────── */
function finishSim() { doAction(V().act.finish(S)); }

/* ── DOMContentLoaded init ───────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  buildBTGrid();
  loadGame();
  buildHoursTable();

  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  setInterval(saveGameAuto, 120000);
  setInterval(drawCanvas, 100);
});

/* ── Global exports ───────────────────────────────────────────────────────── */
window.toggleSim = toggleSim;
window.setSpeed = setSpeed;
window.runTo = runTo;
window.runToDay = runToDay;
window.toggleDD = toggleDD;
window.openModal = openModal;
window.closeModal = closeModal;
window.formBusiness = formBusiness;
window.selectBizType = selectBizType;
window.locateBusiness = locateBusiness;
window.selectLoc = selectLoc;
window.hireApplicant = hireApplicant;
window.rejectApplicant = rejectApplicant;
window.fireEmp = fireEmp;
window.setWage = setWage;
window.trainEmp = trainEmp;
window.buyEq = buyEq;
window.sellEq = sellEq;
window.buyLot = buyLot;
window.setAutoReorder = setAutoReorder;
window.saveHours = saveHours;
window.savePricing = savePricing;
window.saveMarketing = saveMarketing;
window.saveOps = saveOps;
window.saveOperations = saveOperations;
window.saveInsurance = saveInsurance;
window.conductSurvey = conductSurvey;
window.transferFunds = transferFunds;
window.doInvest = doInvest;
window.doPersonalInvest = doPersonalInvest;
window.applyFinancing = applyFinancing;
window.takeLoan = takeLoan;
window.repayLoan = repayLoan;
window.addInvestor = addInvestor;
window.closeBusiness = closeBusiness;
window.provideCash = provideCash;
window.doProvideCash = doProvideCash;
window.saveGame = saveGame;
window.confirmRestart = confirmRestart;
window.finishSim = finishSim;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.setZoom = setZoom;
window.setView = setView;
window.buildHoursTable = buildHoursTable;
window.buildLocGrid = buildLocGrid;
window.buildBTGrid = buildBTGrid;
window.updateVitalSigns = updateVS;
window.drawCanvas = drawCanvas;
window.startAnimLoop = () => {};
