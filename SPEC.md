# sim.js Implementation Spec

Read `index.html` first. Every `onclick="fn()"` in that file must have a matching function here.

## 1. Business Types (BUSINESS_TYPES constant, 20 entries)

Each entry shape:
```
{ id, name, icon, category, description, startupCostMin, startupCostMax,
  baseDemandPerHour, marketAveragePrice, cogsRatio, locationSensitivity,
  marketingSensitivity, priceMin, priceMax, priceDefault,
  employeeRoles:[{role,wageMin,wageMax,qualityImpact}],
  equipmentList:[{id,name,cost,qualityImpact,required}],
  seasonality:[12 monthly multipliers Jan-Dec], unitLabel }
```

| id | name | icon | demand/hr | avg price | cogs | startup min | startup max |
|----|------|------|-----------|-----------|------|-------------|-------------|
| smoothie | Smoothie Shop | 🥤 | 8 | 9.50 | 0.32 | 18000 | 35000 |
| pizza | Pizza Place | 🍕 | 5 | 18.50 | 0.28 | 35000 | 80000 |
| plumbing | Plumbing Business | 🔧 | 1 | 180 | 0.20 | 12000 | 25000 |
| electrical | Electrical Business | ⚡ | 1 | 160 | 0.20 | 12000 | 25000 |
| physicalTherapy | Physical Therapy | 💆 | 2 | 120 | 0.05 | 20000 | 45000 |
| hairSalon | Hair Salon | 💇 | 3 | 45 | 0.05 | 18000 | 35000 |
| autoRepair | Auto Repair Shop | 🚗 | 1.5 | 280 | 0.35 | 40000 | 75000 |
| catering | Catering | 🍽️ | 0.3 | 2500 | 0.40 | 15000 | 35000 |
| giftBaskets | Online Gift Baskets | 🎁 | 2 | 65 | 0.45 | 8000 | 20000 |
| trampolinePark | Trampoline Park | 🎪 | 8 | 18 | 0.10 | 80000 | 160000 |
| bowlingAlley | Bowling Alley | 🎳 | 6 | 20 | 0.10 | 100000 | 200000 |
| fitnessCenter | Fitness Center | 💪 | 4 | 55 | 0.05 | 60000 | 120000 |
| coffeeShop | Coffee Shop | ☕ | 12 | 6.50 | 0.30 | 20000 | 40000 |
| iceCreamShop | Ice Cream Shop | 🍦 | 10 | 7 | 0.28 | 15000 | 30000 |
| tshirtPrinting | T-Shirt Printing | 👕 | 2 | 28 | 0.35 | 10000 | 25000 |
| burritoRestaurant | Burrito Restaurant | 🌯 | 8 | 12 | 0.32 | 25000 | 55000 |
| lawnCare | Lawn Care Services | 🌿 | 1 | 120 | 0.25 | 10000 | 22000 |
| djServices | DJ Services | 🎧 | 0.5 | 1200 | 0.10 | 10000 | 22000 |
| battingCage | Batting Cage | ⚾ | 5 | 15 | 0.10 | 35000 | 70000 |
| goKart | Go Kart Track | 🏎️ | 6 | 22 | 0.15 | 80000 | 160000 |

locationSensitivity: 0.3 for plumbing/electrical/lawnCare/djServices/catering/giftBaskets, 0.9 for coffeeShop/iceCreamShop, 0.8 for others.
marketingSensitivity: 0.9 for giftBaskets/djServices, 0.7 for most.

Each business needs at least 3 equipment items and 2 employee roles. Make them realistic.
seasonality: consumer businesses peak in summer (1.3-1.5 for months 5-8), dip in Jan-Feb (0.8-0.9). Service businesses flatter (0.9-1.1).

## 2. Locations (LOCATIONS array, 20 items)

5 columns x 4 rows. Column zones:
- col 0: residential (trafficMultiplier: 0.75, rent: $1000-1500)
- col 1: commercial (1.15, $2200-2800)
- col 2: downtown (1.50, $3500-4500)
- col 3: commercial (1.20, $2400-3000)
- col 4: industrial (0.60, $800-1400)

Row rent modifier: row0 x1.2, row1 x1.0, row2 x0.9, row3 x0.75
Mark indices [3, 7, 11, 14, 18] as takenByCompetitor: true.

Shape: { id, col, row, name, address, zone, trafficMultiplier, monthlyRent, takenByCompetitor }

Give realistic street names and addresses.

## 3. State Object

```js
const STATE = {
  simDay: 1, running: false, speed: 3,
  goalNetWorth: 75000, totalSimDays: 182,
  personalCash: 15000,
  personalInvested: { savings: 0, stocks: 0 },
  business: null,
  journal: [],   // {day, text, type}
  messages: [],  // {from, date, body}
  surveys: [],
  dailyHistory: [],  // {day, revenue, expenses, profit, customers}
  simTimer: null
};
```

Business object (created by formBusiness):
```js
{
  typeId, name, legalStructure,
  locationId: null,
  personalInvestment: 0,
  loan: { amount:0, rate:0, termMonths:0, monthlyPayment:0, balance:0 },
  cash: 0,
  employees: [],  // {role,name,wage,quality,hiredDay}
  equipment: [],  // array of equipment ids purchased
  hours: { Mon:[9,21], Tue:[9,21], Wed:[9,21], Thu:[9,21], Fri:[9,21], Sat:[10,20], Sun:null },
  price: null,
  marketing: { budget:0, channels:[] },
  operations: { qualityLevel:3, efficiencyLevel:3 },
  insurance: { liability:false, property:false, workers:false, business:false },
  totalRevenue:0, totalExpenses:0, totalProfit:0, totalCustomers:0
}
```

## 4. Daily Revenue Calculation (calcDailyFinancials)

```
dayOfWeek = (STATE.simDay - 1) % 7  // 0=Mon ... 6=Sun
dayName = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][dayOfWeek]
hours = business.hours[dayName]
if (!hours) -> closed, expenses only

hoursOpen = hours[1] - hours[0]
btDef = BUSINESS_TYPES[business.typeId]

empQuality = employees.length > 0
  ? employees.reduce((s,e) => s + e.quality, 0) / employees.length : 1

equipScore = Math.min(1, equipment.reduce((s,id) => {
  const eq = btDef.equipmentList.find(e => e.id === id)
  return s + (eq ? eq.qualityImpact : 0)
}, 0))

mktScore = Math.min(1, (marketing.budget / 1500) * (0.5 + marketing.channels.length * 0.125))

priceFactor = (() => {
  const ratio = (business.price || btDef.priceDefault) / btDef.marketAveragePrice
  if (ratio <= 0.8) return 1.15
  if (ratio <= 1.0) return 1.0 + (1 - ratio) * 0.75
  if (ratio <= 1.3) return 1.0 - (ratio - 1) * 0.8
  return Math.max(0.1, 1.0 - (ratio - 1) * 1.5)
})()

loc = business.locationId !== null ? LOCATIONS[business.locationId] : null
locFactor = loc ? loc.trafficMultiplier : 0.5
opsQ = (operations.qualityLevel + operations.efficiencyLevel) / 10

month = Math.floor((STATE.simDay - 1) / 15) % 12
seasonMult = btDef.seasonality[month]
dowMult = [1.0, 1.0, 1.05, 1.1, 1.2, 1.35, 1.15][dayOfWeek]

baseCustomers = btDef.baseDemandPerHour * hoursOpen
qualityMult = 0.4 + (empQuality / 10) * 0.4 + equipScore * 0.2
customers = baseCustomers * locFactor * priceFactor * (mktScore * 0.5 + 0.5)
          * qualityMult * seasonMult * dowMult * opsQ
customers = Math.max(0, customers * (0.85 + Math.random() * 0.30))

revenue = customers * (business.price || btDef.priceDefault)
cogs = revenue * btDef.cogsRatio
grossProfit = revenue - cogs

dailyRent = loc ? loc.monthlyRent / 30 : 0
dailyPayroll = employees.reduce((s,e) => s + e.wage * hoursOpen, 0)
dailyMarketing = marketing.budget / 30
dailyLoanPmt = loan.amount > 0 ? loan.monthlyPayment / 30 : 0
dailyUtilities = loc ? loc.monthlyRent * 0.08 / 30 : 20
insMonthly = (insurance.liability?150:0)+(insurance.property?120:0)
           + (insurance.workers?200:0)+(insurance.business?80:0)
dailyInsurance = insMonthly / 30
dailyOps = (operations.qualityLevel * 50 + operations.efficiencyLevel * 30) / 30

totalExpenses = dailyRent+dailyPayroll+dailyMarketing+dailyLoanPmt
              + dailyUtilities+dailyInsurance+dailyOps
netProfit = grossProfit - totalExpenses

business.cash += netProfit
business.totalRevenue += revenue
business.totalExpenses += totalExpenses
business.totalProfit += netProfit
business.totalCustomers += Math.round(customers)

// Monthly loan balance update
if (STATE.simDay % 30 === 0 && loan.balance > 0) {
  const interest = loan.balance * (loan.rate / 12)
  const principal = loan.monthlyPayment - interest
  loan.balance = Math.max(0, loan.balance - principal)
}

return { revenue, expenses: totalExpenses, profit: netProfit,
         customers: Math.round(customers), grossProfit, cogs }
```

## 5. Net Worth & Score

```js
function calcNetWorth() {
  if (!STATE.business) return STATE.personalCash + STATE.personalInvested.savings + STATE.personalInvested.stocks
  const btDef = BUSINESS_TYPES[STATE.business.typeId]
  const equipVal = STATE.business.equipment.reduce((s, id) => {
    const eq = btDef.equipmentList.find(e => e.id === id)
    return s + (eq ? eq.cost * 0.6 : 0)
  }, 0)
  const bizEquity = STATE.business.cash + equipVal - STATE.business.loan.balance
  return STATE.personalCash + bizEquity + STATE.personalInvested.savings + STATE.personalInvested.stocks
}
function calcScore() { return Math.min(100, Math.round((calcNetWorth() / STATE.goalNetWorth) * 100)) }
```

## 6. Canvas Drawing (drawCanvas)

Canvas is 790x480. Top-down town view.

```
Background: '#060c18'
Roads: horizontal at y=110,225,340, vertical at x=152,304,456,608 — width 22, color '#2a2a2a'

Tiles (5 cols x 4 rows):
  x = [20, 172, 324, 476, 628][col]
  y = [12, 127, 242, 357][row]
  w=132, h=95

Zone bg colors: downtown '#121f0a', commercial '#111128', suburban '#0f1a0a', industrial '#141110', residential '#0a1318'
Zone border: downtown '#2a4010', commercial '#1a1a3a', suburban '#1a3010', industrial '#2a2018', residential '#102030'

Player tile: fillStyle='#1a1a00', strokeStyle='#ffd700', lineWidth=2, shadowBlur=12, shadowColor='#ffd700'
Competitor tile: strokeStyle='#3a1010', fillStyle='#1a0808'
Available tile: strokeStyle='#1e2e3e'

Draw rounded rect (radius=6) for each tile.
Inside tile:
  - zone label (top-center, 9px, zone color)
  - location name (center, 11px white)
  - rent (bottom-center, 10px '#ffd700')
  - if player's business: business emoji (18px) above name, glow effect
  - if competitor: '🏢' text
```

Animate particles when running:
- Every advanceDay call: if business located, push 1-2 particles toward biz tile center
- Each particle: {x, y, tx, ty, life:60, maxLife:60}
- In animFrame: move 1/20th toward target per frame, draw filled circle (radius 3, color '#00e5b5', alpha = life/maxLife)
- Filter out dead particles each frame

## 7. Modal Population Functions (called when each modal opens)

### buildBTGrid()
For each BUSINESS_TYPES entry: create `.bt` div with data-type=id.
innerHTML: `<span class="bt-icon">${icon}</span><span class="bt-name">${name}</span><span class="bt-cost">$${(startupCostMin/1000).toFixed(0)}k+</span>`
onclick: select this tile, update detail box `#bt-detail` with description + avg price + startup range.

### buildLocGrid()
For each LOCATIONS entry: create `.lt` div with data-id=id.
innerHTML: zone label + name + `$${monthlyRent.toLocaleString()}/mo` + traffic bar (filled dots).
Taken locations: add class `taken`. Player's current location: add class `sel`.

### populateFinanceModal()
Set `#fin-available` to `$${STATE.personalCash.toLocaleString()}`.
If business has existing loan, show current balances in `#fin-summary`.
Wire up live preview: on input changes recalculate monthly payment and show in `#fin-preview`.

### buildHoursTable() — runs once on DOMContentLoaded
For each day Mon-Sun: insert `<tr>` with day name, checkbox (default: Mon-Fri checked, Sun unchecked), open time `<select>`, close time `<select>`.
Time selects: options from 6 to 23 (6AM-11PM). Default open=9, close=21 (except Sat open=10,close=20).
On any change: update `#hours-summary` with total weekly hours.

### buildEmpPool() — called when team modal opens
Generate 8 candidate employees (don't regenerate if already have 8 in pool).
Store pool in STATE.empPool = [].
For each: random name, role from btDef.employeeRoles, random wage and quality within role range.
Show each as `.emp-card` with hire/fire button. Hired = in business.employees.
`#team-summary`: "Monthly payroll: $X | X employees"

### buildEqList() — called when resources modal opens
For each item in btDef.equipmentList:
  owned = business.equipment.includes(item.id)
  Show `.eq-item` (owned: add class `owned`, show 'Owned ✓') or buy button.
  `#res-cash`: "Business cash: $X"

## 8. Action Handlers

### formBusiness()
Get selectedBType (set by buildBTGrid click), biz-name-input value, biz-legal value.
Validate: must have type selected and name entered (min 2 chars).
Create business object. Set price = btDef.priceDefault.
addJournal(`Formed ${name} as a ${legalStructure}`, 'action').
showToast('Business formed! Now locate it.').
closeModal('modal-form'). drawCanvas().

### locateBusiness()
Get selectedLocId (set by buildLocGrid click).
Validate: must select available (non-taken) location.
business.locationId = selectedLocId.
loc = LOCATIONS[selectedLocId]
addJournal(`Located at ${loc.name} - rent $${loc.monthlyRent}/mo`, 'action').
showToast(`Location secured! Monthly rent: $${loc.monthlyRent.toLocaleString()}`).
closeModal('modal-locate'). drawCanvas().

### applyFinancing()
personal = parseFloat(fin-personal.value) || 0
loan = parseFloat(fin-loan.value) || 0
rate = parseFloat(fin-rate.value)
term = parseInt(fin-term.value)
Validate: personal <= STATE.personalCash, total > 0.
monthlyPayment = loan > 0 ? loan * (rate/12) / (1 - Math.pow(1+rate/12, -term)) : 0
STATE.personalCash -= personal
business.personalInvestment += personal
business.cash += personal + loan
if loan > 0: set business.loan = {amount:loan, rate, termMonths:term, monthlyPayment, balance:loan}
addJournal(text). showToast. closeModal.

### hireEmployee(empIndex) / fireEmployee(empIndex)
Move employee between pool and business.employees. Rebuild emp-pool display.

### buyEquipment(equipId)
Find item in btDef.equipmentList. Validate business.cash >= item.cost.
business.cash -= item.cost. business.equipment.push(equipId).
Rebuild eq-list display. addJournal. updateVitalSigns.

### saveHours()
Read each row's checkbox + select values. Build hours object.
business.hours = result. addJournal. showToast. closeModal.

### savePricing()
val = parseFloat(price-input.value). Validate between priceMin and priceMax.
business.price = val. addJournal. showToast. closeModal.

### saveMarketing()
budget = parseFloat(mkt-budget.value) || 0
channels = checked checkboxes mapped to strings
business.marketing = {budget, channels}. addJournal. closeModal.

### saveOperations()
business.operations = { qualityLevel: parseInt(ops-quality.value), efficiencyLevel: parseInt(ops-efficiency.value) }
addJournal. closeModal.

### saveInsurance()
business.insurance = { liability: ins-liability.checked, property: ins-property.checked, workers: ins-workers.checked, business: ins-business.checked }
addJournal. closeModal.

### conductSurvey()
if (!business) showToast('Form a business first','err'); return
if (business.cash < 250) showToast('Not enough cash','err'); return
business.cash -= 250
Generate results object based on current state (scoring 1-10 per dimension).
STATE.surveys.push({topic, day: STATE.simDay, results}).
addJournal. showToast. closeModal('modal-survey-new').

### transferFunds()
amount = parseFloat(transfer-amount.value) || 0
if amount > business.cash: error
netAmount = amount * 0.75  // 25% tax
business.cash -= amount
STATE.personalCash += netAmount
addJournal. showToast. closeModal.

### saveInvesting()
savings = parseFloat(inv-savings.value)||0, stocks = parseFloat(inv-stocks.value)||0
if savings+stocks > STATE.personalCash: error
STATE.personalCash -= (savings + stocks)
STATE.personalInvested.savings += savings
STATE.personalInvested.stocks += stocks
addJournal. closeModal.

### closeBusiness()
if (!business) return
equipVal = sum of owned equipment costs * 0.6
net = business.cash + equipVal - business.loan.balance
STATE.personalCash += Math.max(0, net)
addJournal(`Closed business. Received $${net.toFixed(0)}`, 'financial').
STATE.business = null. closeModal. drawCanvas. updateVitalSigns.

### toggleSim()
if running: stopSim() else startSim()

### startSim()
if (!business || business.locationId === null): showToast('Set up your business first!','wrn'); return
STATE.running = true
ss-icon.textContent = '⏸', ss-text.textContent = 'Stop'
start-stop-button.classList.add('running')
phase-display.textContent = 'Running...'
interval = Math.max(50, Math.round(1000 / STATE.speed))
STATE.simTimer = setInterval(advanceDay, interval)

### stopSim()
clearInterval(STATE.simTimer). STATE.simTimer = null. STATE.running = false.
ss-icon.textContent = '▶', ss-text.textContent = 'Start'
start-stop-button.classList.remove('running')
phase-display.textContent = 'Paused'

### setSpeed(val)
STATE.speed = parseInt(val)
speed-value.textContent = val
if (STATE.running): stopSim(); startSim()

### advanceDay()
STATE.simDay++
if (STATE.simDay > STATE.totalSimDays): stopSim(); endGame(); return
const result = calcDailyFinancials()
STATE.dailyHistory.push({day: STATE.simDay, ...result})
// Apply investment returns every 30 days
if (STATE.simDay % 30 === 0) {
  STATE.personalInvested.savings *= 1 + (0.045/12)
  STATE.personalInvested.stocks *= 1 + ((Math.random()*0.20 - 0.05)/12)  // -5% to +15% monthly
}
// Advisor messages
if (STATE.simDay % 30 === 1) addAdvisorMessage()
updateVitalSigns()
// canvas drawn by animFrame loop

### runTo()
const target = parseInt(runto-day.value)
if (isNaN(target) || target <= STATE.simDay || target > 182): showToast('Invalid day','err'); return
stopSim()
while (STATE.simDay < target) {
  STATE.simDay++
  const r = calcDailyFinancials()
  STATE.dailyHistory.push({day: STATE.simDay, ...r})
}
updateVitalSigns(); drawCanvas(); closeModal('modal-runto')
showToast(`Advanced to Day ${STATE.simDay}`)

### provideCash()
const amt = parseFloat(document.getElementById('cash-amount').value)||0
STATE.personalCash += amt
addJournal(`Teacher provided $${fmt(amt)} cash`,'action')
updateVitalSigns(); closeModal('modal-cash'); showToast('Cash added!')

### confirmRestart()
if (confirm('Restart? All progress will be lost.')): resetGame()

### resetGame()
STATE.simDay=1; STATE.running=false; STATE.personalCash=15000; STATE.business=null
STATE.journal=[]; STATE.messages=[]; STATE.surveys=[]; STATE.dailyHistory=[]
STATE.personalInvested={savings:0,stocks:0}; STATE.empPool=[]
localStorage.removeItem('deca-vbc-save')
updateVitalSigns(); drawCanvas(); showToast('Lesson restarted')
phase-display.textContent = 'Setup Phase'

### saveGame() / loadGame()
saveGame: localStorage['deca-vbc-save'] = JSON.stringify({...STATE, simTimer:null})
loadGame: try parse; if ok restore STATE fields; rebuild grids; updateVitalSigns; drawCanvas

### endGame()
const score = calcScore(); const nw = calcNetWorth()
// Save to scoreboard
let scores = JSON.parse(localStorage['deca-vbc-scores']||'[]')
scores.push({name: STATE.business?.name||'Unknown', netWorth:nw, score, date: new Date().toLocaleDateString()})
localStorage['deca-vbc-scores'] = JSON.stringify(scores)
saveGame()
phase-display.textContent = 'Completed'
alert(`Simulation complete!\nNet Worth: $${nw.toLocaleString()}\nScore: ${score}/100`)

## 9. Update Vital Signs (updateVitalSigns)

```js
function updateVitalSigns() {
  const b = STATE.business
  const nw = calcNetWorth()
  const score = calcScore()
  const last = STATE.dailyHistory[STATE.dailyHistory.length-1]

  // Cash
  const cash = b ? b.cash : STATE.personalCash
  const cashEl = document.getElementById('vs-cash')
  cashEl.textContent = fmtC(cash)
  cashEl.className = 'vs-val' + (cash < 0 ? ' neg' : cash < 1000 ? ' warn' : '')

  // Overall score
  document.getElementById('vs-overall').textContent = score + '/100'

  // Employee quality
  const qEl = document.getElementById('vs-quality')
  if (b && b.employees.length > 0) {
    const avg = b.employees.reduce((s,e)=>s+e.quality,0)/b.employees.length
    qEl.textContent = avg.toFixed(1)+'/10'
    qEl.className = 'vs-val' + (avg < 4 ? ' warn' : '')
  } else qEl.textContent = '—'

  // Wait rating (customers per employee per day)
  const wEl = document.getElementById('vs-wait')
  if (b && last && b.employees.length > 0) {
    const ratio = last.customers / b.employees.length
    wEl.textContent = ratio < 10 ? 'Excellent' : ratio < 20 ? 'Good' : ratio < 35 ? 'Fair' : 'Poor'
    wEl.className = 'vs-val' + (ratio > 35 ? ' neg' : ratio > 20 ? ' warn' : '')
  } else wEl.textContent = '—'

  // Revenue / Profit
  document.getElementById('vs-revenue').textContent = last ? fmtC(last.revenue) : '$0'
  const pEl = document.getElementById('vs-profit')
  pEl.textContent = last ? fmtC(last.profit) : '$0'
  pEl.className = 'vs-val' + (last && last.profit < 0 ? ' neg' : '')

  document.getElementById('vs-totalprofit').textContent = b ? fmtC(b.totalProfit) : '$0'
  const nwEl = document.getElementById('vs-networth')
  nwEl.textContent = fmtC(nw)
  nwEl.className = 'vs-val warn' + (nw < 0 ? ' neg' : '')

  // Header
  document.getElementById('grade-display').textContent = 'Score: ' + score + ' / 100'
  const dow = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(STATE.simDay-1)%7]
  document.getElementById('time-value').textContent = 'Day ' + STATE.simDay + ' – ' + dow
  document.getElementById('current-biz-name').textContent = b ? b.name : '—'
  document.getElementById('runto-current').textContent = STATE.simDay
}
```

## 10. Report Renderers

### renderDashboard() — populates #dashboard-body
Dashboard grid (3x2) cards:
1. Net Worth: calcNetWorth() — color warn
2. Total Profit: business?.totalProfit || 0 — pos/neg color
3. Score: calcScore() + '/100'
4. Days Remaining: (182 - STATE.simDay)
5. Total Customers: business?.totalCustomers || 0
6. Avg Daily Revenue: totalRevenue / max(1, simDay)

Below: Goal progress bar (calcNetWorth()/goalNetWorth*100%, green fill).
Below: Last 7 days revenue table (day, revenue, profit, customers).

### renderIncomeStatement() — populates #income-body
Two sections: "Current Month" and "All Time"
Rows: Revenue, COGS (–), Gross Profit (=), [blank], Rent, Payroll, Marketing, Loan Payments, Utilities, Insurance, Operations, Total Expenses (=), Net Income (=)
Calculate from dailyHistory for current month (last 30 days) and all time totals.
Estimate expense breakdown proportionally.

### renderBalanceSheet() — populates #balance-body
ASSETS: Cash (business.cash), Equipment (book value at 60%), Personal Cash, Investments. Total Assets.
LIABILITIES: Loan Balance. Total Liabilities.
EQUITY: Personal Investment + Retained Earnings. Total L+E.
Show that Total Assets = Total Liabilities + Equity (or flag discrepancy).

### renderSalesReport() — populates #sales-body
Table of last 14 entries in dailyHistory:
Day | Weekday | Revenue | Customers | Avg Transaction | Profit
Show running total at bottom.

### renderBacklogReport() — populates #backlog-body
For service businesses (plumbing, electrical, physicalTherapy, catering, autoRepair):
  Simulated queue of 3-7 pending jobs with description, value, days-in-queue.
For product/retail businesses: inventory level (simulated), reorder point, days-of-stock.

### renderPersonalSummary() — populates #personal-body
Personal Cash | Business Equity | Savings Account | Stock Portfolio | Total Net Worth
Goal: $75,000 | Progress bar | Score

### renderCompetitorResearch() — populates #comp-research-body
Table of 4 simulated competitors (seeded from business type):
Name | Location | Est. Revenue/Day | Price | Quality | Threat Level
Values seeded from business type's market average with ±20% variation.

### renderLocationResearch() — populates #loc-research-body
Table of all 20 locations:
Name | Zone | Traffic | Rent/mo | Competition | Status (Available/Taken/Yours)
Highlight player's current location.

### renderPriceResearch() — populates #price-research-body
Market Average Price for this business type.
Competitor price range.
Your current price.
Demand impact at current price (use priceFactor formula from calcDailyFinancials).
Recommendation: optimal price range.

### renderJournal() — populates #journal-list
If empty: info-box "No actions yet". Else: jl-entry divs with jl-time + jl-text. Newest first.

### renderMessages() — populates #msg-list
If empty: info-box "No messages". Else: msg-item divs.

### renderScoreboard() — populates #scoreboard-body
Load from localStorage['deca-vbc-scores'] (array of {name,netWorth,score,date}).
Sort descending by netWorth. Show table with rank 1-N.
Highlight current session's latest entry (.sb-me class).

### renderSurveyResults() — populates #survey-results-body
For each survey in STATE.surveys: show topic, date, and a bar-chart-style HTML results table.

### renderHelpBot() — populates #helpbot-body
FAQ as expandable sections (or just plain text divs):
- "How do I maximize net worth?" — focus on location, quality employees, competitive pricing, consistent marketing
- "Which business is best for beginners?" — Coffee Shop (high volume) or Hair Salon (good margins, low COGS)
- "What's the best pricing strategy?" — Stay within 90-110% of market average for best volume+margin
- "How does employee quality affect revenue?" — Higher quality = better wait rating = more customers
- "Is marketing worth it?" — Yes: $500/mo with 2+ channels typically adds 20-30% to demand
- "How is my score calculated?" — (Net Worth / $75,000) x 100, capped at 100

## 11. Helper Functions

```js
function fmt(n) {
  const abs = Math.abs(n)
  if (abs >= 1000000) return (n/1000000).toFixed(1)+'M'
  if (abs >= 1000) return (n/1000).toFixed(1)+'k'
  return n.toFixed(0)
}
function fmtC(n) { return (n < 0 ? '-$' : '$') + fmt(Math.abs(n)) }
function fmtFull(n) { return (n<0?'-$':'$') + Math.abs(n).toLocaleString('en-US',{maximumFractionDigits:0}) }
function getDayName(simDay) { return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][(simDay-1)%7] }
function addJournal(text, type='action') { STATE.journal.unshift({day:STATE.simDay, text, type}) }
function addMessage(from, body) { STATE.messages.unshift({from, date:'Day '+STATE.simDay, body}) }
function showToast(msg, type='') {
  const t = document.getElementById('toast')
  t.textContent = msg; t.className = 'show ' + (type||'')
  clearTimeout(t._timer); t._timer = setTimeout(()=>t.className='', 3000)
}
function addAdvisorMessage() {
  const tips = [
    'Review your pricing — staying near market average maximizes revenue.',
    'Consider hiring a higher-quality employee to improve your wait rating.',
    'Increasing your marketing budget can significantly boost customer traffic.',
    'Check your cash flow — high loan payments can drain profitability.',
    'Have you considered opening longer hours on weekends?'
  ]
  addMessage('Business Advisor', tips[Math.floor(Math.random()*tips.length)])
}
```

## 12. Initialization

```js
let selectedBType = null
let selectedLocId = null
let empCandidates = []  // generated once per modal open

window.addEventListener('DOMContentLoaded', () => {
  buildBTGrid()
  buildLocGrid()
  buildHoursTable()
  loadGame()
  updateVitalSigns()
  drawCanvas()
  startAnimLoop()

  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'))
    }
  })

  // Wire up live previews
  ;['fin-loan','fin-rate','fin-term'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateFinPreview)
  })
  document.getElementById('price-input')?.addEventListener('input', updatePriceEffect)
  ;['mkt-budget','mkt-social','mkt-online','mkt-local','mkt-events'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateMktPreview)
  })
  document.getElementById('ins-liability')?.addEventListener('change', updateInsTotal)
  document.getElementById('ins-property')?.addEventListener('change', updateInsTotal)
  document.getElementById('ins-workers')?.addEventListener('change', updateInsTotal)
  document.getElementById('ins-business')?.addEventListener('change', updateInsTotal)

  setInterval(saveGame, 120000)
})

function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden')
  // Populate content based on modal id
  const populators = {
    'modal-form': () => { buildBTGrid() },
    'modal-locate': () => { buildLocGrid() },
    'modal-finance': () => { populateFinanceModal() },
    'modal-team': () => { buildEmpPool() },
    'modal-resources': () => { buildEqList() },
    'modal-hours': () => { populateHoursModal() },
    'modal-pricing': () => { populatePricingModal() },
    'modal-marketing': () => { populateMarketingModal() },
    'modal-operations': () => { populateOpsModal() },
    'modal-insurance': () => { populateInsuranceModal() },
    'modal-transfer': () => { populateTransferModal() },
    'modal-invest': () => { populateInvestModal() },
    'modal-close': () => { populateCloseModal() },
    'modal-journal': () => { renderJournal() },
    'modal-scoreboard': () => { renderScoreboard() },
    'modal-r-competitors': () => { renderCompetitorResearch() },
    'modal-r-locations': () => { renderLocationResearch() },
    'modal-r-prices': () => { renderPriceResearch() },
    'modal-dashboard': () => { renderDashboard() },
    'modal-income': () => { renderIncomeStatement() },
    'modal-balance': () => { renderBalanceSheet() },
    'modal-sales': () => { renderSalesReport() },
    'modal-backlog': () => { renderBacklogReport() },
    'modal-personal': () => { renderPersonalSummary() },
    'modal-messages': () => { renderMessages() },
    'modal-survey-results': () => { renderSurveyResults() },
    'modal-helpbot': () => { renderHelpBot() },
  }
  populators[id]?.()
}
function closeModal(id) { document.getElementById(id)?.classList.add('hidden') }
function toggleDD(id) {
  const el = document.getElementById(id)
  const wasOpen = el.classList.contains('open')
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'))
  if (!wasOpen) el.classList.add('open')
}
```

## 13. Animation Loop

```js
const particles = []
function startAnimLoop() { requestAnimationFrame(animFrame) }
function animFrame() {
  drawCanvas()
  requestAnimationFrame(animFrame)
}
function spawnParticle() {
  if (!STATE.business || STATE.business.locationId === null) return
  const loc = LOCATIONS[STATE.business.locationId]
  const tx = 20 + loc.col * 152 + 66  // center of tile
  const ty = 12 + loc.row * 115 + 47
  // Random start from edges
  const side = Math.floor(Math.random()*4)
  let sx, sy
  if (side===0) { sx=Math.random()*790; sy=0 }
  else if (side===1) { sx=790; sy=Math.random()*480 }
  else if (side===2) { sx=Math.random()*790; sy=480 }
  else { sx=0; sy=Math.random()*480 }
  particles.push({x:sx, y:sy, tx, ty, life:60, maxLife:60})
}
// Modify drawCanvas to also draw particles after town tiles
```

## Final Steps for Agent

1. Read index.html to confirm all function names used in onclick attributes
2. Write complete sim.js (expect 900-1200 lines) covering all sections above
3. Every function referenced from HTML must exist
4. Run basic syntax check: `node --check sim.js`
5. Commit: `git add sim.js README.md && git commit -m "feat: complete sim.js engine + README" && git push`

README.md content:
```
# DECA VBC: Entrepreneurship Track — Offline Practice Sim

## How to run
Open index.html in any modern browser. No server needed.

## Gameplay
1. Actions → Form Business (choose from 20 types)
2. Actions → Locate Business (choose location)
3. Actions → Financing (personal investment + bank loan)
4. Actions → Build Your Team (hire employees)
5. Actions → Acquire Resources (buy equipment)
6. Actions → Business Hours / Pricing / Marketing
7. Press ▶ Start — simulation runs for 182 days

## Scoring
Score = (Net Worth / $75,000) × 100, max 100.
Net Worth = Personal Cash + Business Cash + Equipment Value (60%) − Loan Balance + Investments.

## Customizing
Edit BUSINESS_TYPES in sim.js to change prices, demand, or startup costs.
Change STATE.goalNetWorth to adjust difficulty.
Change STATE.totalSimDays to change simulation length.

## Teacher cheat
File → Provide Cash adds money to personal cash.
```
