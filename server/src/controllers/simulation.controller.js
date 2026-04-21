const Groq = require("groq-sdk");
const { sendSuccess, sendError } = require("../utils/response");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const STEPS = [
  { title: "Immediate Response", situation: "The disaster has just hit your area. Emergency services are overwhelmed. Your family needs protection immediately. What is your first priority?", options: [
    { text: "Move family to safety and call emergency services", points: 10, explanation: "Correct! Getting to safe ground and alerting authorities is always the first step." },
    { text: "Wait for official evacuation orders before moving", points: 5, explanation: "Waiting can be risky if your location is directly threatened." },
    { text: "Go back to collect valuables from the danger zone", points: 0, explanation: "Never risk your life for possessions. They can be replaced." },
    { text: "Help neighbors before securing your own family", points: 6, explanation: "Helping others is important but secure your family first." }
  ]},
  { title: "Emergency Kit", situation: "You must evacuate now and can carry only one bag. Rescue may take 8-10 hours. What do you pack?", options: [
    { text: "Water, medicines, ID documents, torch, first aid kit, phone and charger", points: 10, explanation: "Perfect - these are the critical survival essentials for any evacuation." },
    { text: "Laptop, cash, jewelry, extra clothes, food", points: 4, explanation: "Cash helps but electronics and jewelry are not survival priorities." },
    { text: "Just phone and wallet to travel fast and light", points: 5, explanation: "Too minimal - water and medicines are critical for extended survival." },
    { text: "Food, blankets, cooking gas cylinder, tools", points: 3, explanation: "Cooking gas is dangerous in disaster conditions. Prioritize water and documents." }
  ]},
  { title: "Resource Shortage", situation: "At the evacuation point water is limited - only enough for half the people present. There are elderly, children and healthy adults. How do you handle distribution?", options: [
    { text: "Prioritize children, elderly and injured people first", points: 10, explanation: "Correct - disaster protocols always prioritize the most vulnerable individuals." },
    { text: "Equal distribution for everyone regardless of condition", points: 6, explanation: "Fair in principle but vulnerable people have greater immediate survival needs." },
    { text: "First come first served - whoever arrived first gets water", points: 3, explanation: "This ignores vulnerability and can lead to preventable deaths." },
    { text: "Give water to those who helped with rescue operations", points: 5, explanation: "Rewarding helpers is understandable but vulnerability must be the primary criterion." }
  ]},
  { title: "Panic and Rumors", situation: "A rumor spreads that a second larger disaster is coming. People are panicking and scattering in all directions. What do you do?", options: [
    { text: "Stay calm, find shelter officials and wait for official announcement", points: 10, explanation: "Correct - panic kills more people than most disasters. Always verify through official channels." },
    { text: "Move your family to higher ground immediately just in case", points: 5, explanation: "Uncoordinated movement without verified information can lead you into greater danger." },
    { text: "Loudly warn everyone around you to spread the alert", points: 2, explanation: "Spreading unverified rumors causes deadly stampedes and mass chaos." },
    { text: "Ignore it completely since rumors are almost always false", points: 3, explanation: "Never fully dismiss warnings. Verify through officials before deciding." }
  ]},
  { title: "Safe Return", situation: "Officials declare it safe to return home after 3 days. You enter and smell gas strongly inside. What do you do?", options: [
    { text: "Touch nothing, open windows from outside, leave immediately and call gas company", points: 10, explanation: "Perfect - any spark in a gas-filled room can cause a fatal explosion." },
    { text: "Turn on the exhaust fan to clear the gas more quickly", points: 0, explanation: "Extremely dangerous - the fan switch creates a spark that ignites the gas." },
    { text: "Open windows from inside and wait for the smell to go away", points: 4, explanation: "Opening windows is correct but you must leave the building entirely." },
    { text: "Use a lighter to check if there is really a gas leak", points: 0, explanation: "This causes a fatal explosion. Never use open flame near gas leaks." }
  ]}
];

const SCENARIOS_META = [
  { id:"kerala_flood", title:"Kerala Monsoon Flood", description:"Heavy monsoon rains have caused severe flooding in your district. Rivers are overflowing and water levels are rising rapidly.", location:"Kerala, South India", icon:"wave", difficulty:"Hard", category:"Flood", region:"South India", duration:"20 min" },
  { id:"uttarakhand_landslide", title:"Uttarakhand Landslide", description:"Continuous rainfall triggered massive landslides in the Himalayan foothills. Roads are blocked and villages are cut off.", location:"Uttarakhand, North India", icon:"mountain", difficulty:"Hard", category:"Landslide", region:"North India", duration:"15 min" },
  { id:"gujarat_earthquake", title:"Gujarat Earthquake", description:"A 6.9 magnitude earthquake has struck Gujarat. Buildings are collapsing and aftershocks are expected.", location:"Gujarat, West India", icon:"house", difficulty:"Medium", category:"Earthquake", region:"West India", duration:"15 min" },
  { id:"odisha_cyclone", title:"Odisha Super Cyclone", description:"A Category 4 cyclone is approaching the Odisha coast with wind speeds of 200 km/h. Coastal areas must evacuate within 6 hours.", location:"Odisha, East India", icon:"cyclone", difficulty:"Hard", category:"Cyclone", region:"East India", duration:"20 min" },
  { id:"mumbai_flood", title:"Mumbai Urban Flood", description:"Unprecedented 944mm rainfall in 24 hours has flooded Mumbai streets. The train network is shut down.", location:"Mumbai, Maharashtra", icon:"rain", difficulty:"Medium", category:"Flood", region:"West India", duration:"15 min" },
  { id:"delhi_heatwave", title:"Delhi Extreme Heatwave", description:"Delhi is experiencing a deadly heatwave with temperatures reaching 48 degrees. Power cuts are frequent.", location:"Delhi, North India", icon:"thermometer", difficulty:"Easy", category:"Heatwave", region:"North India", duration:"10 min" },
  { id:"andaman_tsunami", title:"Andaman Tsunami Warning", description:"A 9.1 magnitude earthquake in the Indian Ocean triggered a tsunami warning. Waves could arrive within 30 minutes.", location:"Andaman Islands", icon:"wave", difficulty:"Hard", category:"Tsunami", region:"Island Territory", duration:"20 min" },
  { id:"rajasthan_dust", title:"Rajasthan Dust Storm", description:"A massive dust storm with 90 km/h winds is approaching Rajasthan. Visibility is dropping to near zero.", location:"Rajasthan, North India", icon:"wind", difficulty:"Medium", category:"Dust Storm", region:"North India", duration:"15 min" },
  { id:"assam_flood", title:"Assam Brahmaputra Flood", description:"The Brahmaputra river has breached its banks flooding 20 districts of Assam. Wildlife from national parks is displaced.", location:"Assam, Northeast India", icon:"elephant", difficulty:"Hard", category:"Flood", region:"Northeast India", duration:"20 min" },
  { id:"himachal_avalanche", title:"Himachal Pradesh Avalanche", description:"Heavy snowfall triggered multiple avalanches in Himachal Pradesh. Several trekking groups and villages are buried.", location:"Himachal Pradesh, North India", icon:"snow", difficulty:"Hard", category:"Avalanche", region:"North India", duration:"20 min" },
  { id:"visakhapatnam_cyclone", title:"Visakhapatnam Cyclone", description:"A major cyclone is hitting Visakhapatnam with 180 km/h winds. The port city has 24 hours to evacuate 300,000 residents.", location:"Visakhapatnam, Andhra Pradesh", icon:"cyclone", difficulty:"Medium", category:"Cyclone", region:"South India", duration:"15 min" },
  { id:"chennai_flood", title:"Chennai Flood Crisis", description:"Unprecedented rainfall has flooded Chennai. The city receives its entire annual rainfall in 48 hours submerging entire neighbourhoods.", location:"Chennai, Tamil Nadu", icon:"wave", difficulty:"Medium", category:"Flood", region:"South India", duration:"15 min" }
];

const INDIA_SCENARIOS = SCENARIOS_META.map(s => ({ ...s, objectives: ["Make critical decisions under pressure", "Manage limited resources effectively", "Prioritize vulnerable groups", "Coordinate with emergency services"], steps: STEPS }));

const getScenarios = async (req, res) => {
  try {
    return sendSuccess(res, "Success", { scenarios: INDIA_SCENARIOS.map(s => ({ id:s.id, title:s.title, description:s.description, location:s.location, icon:s.icon, difficulty:s.difficulty, category:s.category, type:s.category, region:s.region, duration:s.duration })) });
  } catch (err) { return sendError(res, err.message); }
};

const getScenarioById = async (req, res) => {
  try {
    const scenario = INDIA_SCENARIOS.find(s => s.id === req.params.id);
    if (!scenario) return sendError(res, "Scenario not found", 404);
    return sendSuccess(res, "Success", { scenario });
  } catch (err) { return sendError(res, err.message); }
};

const startSimulation = async (req, res) => {
  try {
    const scenario = INDIA_SCENARIOS.find(s => s.id === req.body.scenarioId);
    if (!scenario) return sendError(res, "Scenario not found", 404);
    return sendSuccess(res, "Simulation started", { scenario });
  } catch (err) { return sendError(res, err.message); }
};

const continueSimulation = async (req, res) => {
  try {
    const { scenarioId, step, choice } = req.body;
    const scenario = INDIA_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return sendError(res, "Scenario not found", 404);
    const currentStep = scenario.steps[step];
    const selectedOption = currentStep && currentStep.options[choice];
    return sendSuccess(res, "Step processed", { points: selectedOption ? selectedOption.points : 0, explanation: selectedOption ? selectedOption.explanation : "", nextStep: step + 1, totalSteps: scenario.steps.length });
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { getScenarios, getScenarioById, startSimulation, continueSimulation };
