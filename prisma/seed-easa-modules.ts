// prisma/seed-easa-modules.ts
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Define module data first
const moduleData = {
  'module-1': {
    number: '1',
    title: 'Mathematics',
    description: 'Arithmetic, algebra, geometry and basic trigonometry.',
    category: 'Basic Knowledge',
    topics: [
      { number: '1.1', title: 'Arithmetic' },
      { number: '1.2', title: 'Algebra' },
      { number: '1.3', title: 'Geometry' },
      { number: '1.4', title: 'Trigonometry' }
    ],
    
      flashcards: [
        { topic: 'Arithmetic', question: 'What is the result of (3/4) ÷ (1/2)?', answer: '3/2 or 1.5', difficulty: 'medium' },
        { topic: 'Arithmetic', question: 'Express 0.125 as a fraction in its simplest form.', answer: '1/8', difficulty: 'easy' },
        { topic: 'Arithmetic', question: 'What is 15% of 80?', answer: '12', difficulty: 'easy' },
        { topic: 'Arithmetic', question: 'If a task takes 6 hours to complete, what fraction of the task is completed in 1 hour?', answer: '1/6', difficulty: 'easy' },
        { topic: 'Arithmetic', question: 'What is 2^5?', answer: '32', difficulty: 'easy' },
        { topic: 'Arithmetic', question: 'A aircraft flies 450 km in 2.5 hours. What is its speed in km/h?', answer: '180 km/h', difficulty: 'medium' },
        { topic: 'Arithmetic', question: 'Convert 0.75 to a percentage.', answer: '75%', difficulty: 'easy' },
        { topic: 'Arithmetic', question: 'If fuel consumption is 50 liters per hour, how many liters are used in 3.5 hours?', answer: '175 liters', difficulty: 'easy' },
        { topic: 'Arithmetic', question: 'What is the square root of 144?', answer: '12', difficulty: 'easy' },
        { topic: 'Arithmetic', question: 'If 25% of a number is 30, what is the number?', answer: '120', difficulty: 'medium' },
        { topic: 'Arithmetic', question: 'Calculate (2.5 × 10^3) × (4 × 10^-2)', answer: '100', difficulty: 'medium' },
        { topic: 'Arithmetic', question: 'What is the cube root of 27?', answer: '3', difficulty: 'medium' },
        
        { topic: 'Algebra', question: 'Solve for x: 2x + 5 = 13', answer: 'x = 4', difficulty: 'easy' },
        { topic: 'Algebra', question: 'Solve for x: 3x - 7 = 14', answer: 'x = 7', difficulty: 'easy' },
        { topic: 'Algebra', question: 'Factor completely: x² - 9', answer: '(x + 3)(x - 3)', difficulty: 'medium' },
        { topic: 'Algebra', question: 'Solve the quadratic equation: x² - 5x + 6 = 0', answer: 'x = 2 or x = 3', difficulty: 'medium' },
        { topic: 'Algebra', question: 'If y = 3x - 2, what is x in terms of y?', answer: 'x = (y + 2)/3', difficulty: 'medium' },
        { topic: 'Algebra', question: 'Simplify: (3a²b)(4ab²)', answer: '12a³b³', difficulty: 'medium' },
        { topic: 'Algebra', question: 'Solve for x: 2(x - 3) = 4x - 10', answer: 'x = 2', difficulty: 'medium' },
        { topic: 'Algebra', question: 'Expand: (a + b)²', answer: 'a² + 2ab + b²', difficulty: 'medium' },
        { topic: 'Algebra', question: 'Factor: a² - 5a + 6', answer: '(a - 2)(a - 3)', difficulty: 'medium' },
        { topic: 'Algebra', question: 'If P = IV, solve for I', answer: 'I = P/V', difficulty: 'easy' },
        { topic: 'Algebra', question: 'Solve the equation: log(x) = 2', answer: 'x = 100', difficulty: 'hard' },
        { topic: 'Algebra', question: 'If f(x) = 2x² - 3x + 1, what is f(2)?', answer: '5', difficulty: 'medium' },
        
        { topic: 'Geometry', question: 'What is the formula for the area of a circle?', answer: 'A = πr²', difficulty: 'easy' },
        { topic: 'Geometry', question: 'What is the formula for the volume of a cylinder?', answer: 'V = πr²h', difficulty: 'easy' },
        { topic: 'Geometry', question: 'What is the formula for the surface area of a sphere?', answer: 'A = 4πr²', difficulty: 'medium' },
        { topic: 'Geometry', question: 'If a rectangle has a length of 8 cm and a width of 5 cm, what is its area?', answer: '40 square centimeters', difficulty: 'easy' },
        { topic: 'Geometry', question: 'What is the Pythagorean theorem?', answer: 'a² + b² = c², where c is the hypotenuse and a and b are the other two sides of a right triangle', difficulty: 'easy' },
        { topic: 'Geometry', question: 'If a circle has a radius of 5 cm, what is its circumference?', answer: '10π cm ≈ 31.4 cm', difficulty: 'easy' },
        { topic: 'Geometry', question: 'What is the formula for the area of a triangle?', answer: 'A = (1/2)bh, where b is the base and h is the height', difficulty: 'easy' },
        { topic: 'Geometry', question: 'If a cube has edges of length 3 cm, what is its volume?', answer: '27 cubic centimeters', difficulty: 'easy' },
        { topic: 'Geometry', question: 'What is the sum of the interior angles of a triangle?', answer: '180 degrees', difficulty: 'easy' },
        { topic: 'Geometry', question: 'What is the formula for the perimeter of a rectangle?', answer: 'P = 2(l + w), where l is length and w is width', difficulty: 'easy' },
        { topic: 'Geometry', question: 'If a sphere has a radius of 4 cm, what is its volume?', answer: '(4/3)π·4³ = (4/3)π·64 ≈ 268 cubic centimeters', difficulty: 'medium' },
        { topic: 'Geometry', question: 'What is the difference between a radius and a diameter of a circle?', answer: 'The diameter is twice the radius; it passes through the center and connects two points on the circle', difficulty: 'easy' },
        
        { topic: 'Trigonometry', question: 'What is the sine of 30 degrees?', answer: '0.5', difficulty: 'easy' },
        { topic: 'Trigonometry', question: 'What is the cosine of 60 degrees?', answer: '0.5', difficulty: 'easy' },
        { topic: 'Trigonometry', question: 'What is the tangent of 45 degrees?', answer: '1', difficulty: 'easy' },
        { topic: 'Trigonometry', question: 'What is the formula for the sine rule?', answer: 'a/sin(A) = b/sin(B) = c/sin(C)', difficulty: 'medium' },
        { topic: 'Trigonometry', question: 'What are the values of sine and cosine for 0 degrees?', answer: 'sin(0°) = 0, cos(0°) = 1', difficulty: 'easy' },
        { topic: 'Trigonometry', question: 'What is the formula for the cosine rule?', answer: 'c² = a² + b² - 2ab·cos(C)', difficulty: 'medium' },
        { topic: 'Trigonometry', question: 'In a right triangle, if one angle is 30°, what is the other acute angle?', answer: '60°', difficulty: 'easy' },
        { topic: 'Trigonometry', question: 'What is the value of sin²(θ) + cos²(θ) for any angle θ?', answer: '1', difficulty: 'medium' },
        { topic: 'Trigonometry', question: 'What is the tangent of 0 degrees?', answer: '0', difficulty: 'easy' },
        { topic: 'Trigonometry', question: 'If sin(θ) = 0.6, what is cos(θ)?', answer: '0.8 (using sin²(θ) + cos²(θ) = 1)', difficulty: 'medium' },
        { topic: 'Trigonometry', question: 'What is the formula for calculating sin(A+B)?', answer: 'sin(A+B) = sin(A)cos(B) + cos(A)sin(B)', difficulty: 'hard' },
        { topic: 'Trigonometry', question: 'Convert 45 degrees to radians.', answer: 'π/4', difficulty: 'medium' },
        { topic: 'Trigonometry', question: 'What is the period of the sine function?', answer: '2π radians or 360 degrees', difficulty: 'medium' },
        { topic: 'Trigonometry', question: 'What is the inverse of sine called?', answer: 'Arcsine or sin⁻¹', difficulty: 'medium' }
      ]
  },
  'module-3': {
    number: '3',
    title: 'Basic Electricity',
    description: 'Electron theory, static electricity, electrical terminology, and electrical hazards.',
    category: 'Basic Knowledge',
    topics: [
      { number: '3.1', title: 'Electron Theory' },
      { number: '3.2', title: 'Static Electricity' },
      { number: '3.3', title: 'Electrical Terminology' },
      { number: '3.4', title: 'DC Circuits' },
      { number: '3.5', title: 'Resistors' },
      { number: '3.6', title: 'Capacitors' },
      { number: '3.7', title: 'Inductors' }
    ],
    flashcards: [
      { topic: 'Electron Theory', question: 'What is the charge of an electron?', answer: '-1.602 × 10^-19 coulombs', difficulty: 'medium' },
      { topic: 'Electron Theory', question: 'What particles make up an atom?', answer: 'Protons, neutrons, and electrons', difficulty: 'easy' },
      { topic: 'Electron Theory', question: 'What is the charge of a proton?', answer: '+1.602 × 10^-19 coulombs', difficulty: 'medium' },
      { topic: 'Electron Theory', question: 'What is an ion?', answer: 'An atom that has gained or lost electrons, giving it a net charge', difficulty: 'medium' },
      { topic: 'Electron Theory', question: 'Where are electrons located in an atom?', answer: 'In shells or orbitals around the nucleus', difficulty: 'easy' },
      { topic: 'Electron Theory', question: 'What are valence electrons?', answer: 'Electrons in the outermost shell of an atom', difficulty: 'medium' },
      { topic: 'Electron Theory', question: 'What is the difference between conductors and insulators?', answer: 'Conductors allow electrons to flow freely, while insulators restrict electron flow', difficulty: 'easy' },
      
      { topic: 'Static Electricity', question: 'What causes static electricity?', answer: 'The buildup of electric charges on the surface of objects', difficulty: 'easy' },
      { topic: 'Static Electricity', question: 'What is the triboelectric effect?', answer: 'The transfer of electrons between materials when they are rubbed together', difficulty: 'medium' },
      { topic: 'Static Electricity', question: 'Why is static electricity a concern in aircraft?', answer: 'It can interfere with radio communications, cause fuel ignition, and damage electronic components', difficulty: 'medium' },
      { topic: 'Static Electricity', question: 'What is a static wick or static discharger?', answer: 'A device installed on aircraft to safely discharge static electricity', difficulty: 'medium' },
      { topic: 'Static Electricity', question: 'What is electrostatic discharge (ESD)?', answer: 'The sudden flow of electricity between two electrically charged objects', difficulty: 'easy' },
      { topic: 'Static Electricity', question: 'How can ESD damage electronic components?', answer: 'The high voltage can create heat that damages sensitive semiconductor junctions', difficulty: 'medium' },
      { topic: 'Static Electricity', question: 'What precautions should be taken when handling electronic components?', answer: 'Use ESD wrist straps, work on grounded surfaces, and keep components in anti-static bags', difficulty: 'medium' },
      
      { topic: 'Electrical Terminology', question: 'What is voltage?', answer: 'The electrical potential difference between two points, measured in volts (V)', difficulty: 'easy' },
      { topic: 'Electrical Terminology', question: 'What is current?', answer: 'The flow of electric charge through a conductor, measured in amperes (A)', difficulty: 'easy' },
      { topic: 'Electrical Terminology', question: 'What is resistance?', answer: 'The opposition to the flow of electric current, measured in ohms (Ω)', difficulty: 'easy' },
      { topic: 'Electrical Terminology', question: 'What is Ohm\'s Law?', answer: 'V = IR, where V is voltage, I is current, and R is resistance', difficulty: 'easy' },
      { topic: 'Electrical Terminology', question: 'What is the unit of power?', answer: 'Watt (W)', difficulty: 'easy' },
      { topic: 'Electrical Terminology', question: 'What is the formula for electrical power?', answer: 'P = VI or P = I²R or P = V²/R', difficulty: 'medium' },
      { topic: 'Electrical Terminology', question: 'What is the difference between AC and DC?', answer: 'DC (Direct Current) flows in one direction, while AC (Alternating Current) periodically reverses direction', difficulty: 'easy' },
      
      { topic: 'DC Circuits', question: 'What is a series circuit?', answer: 'A circuit where components are connected along a single path', difficulty: 'easy' },
      { topic: 'DC Circuits', question: 'In a series circuit, how does the current compare at different points?', answer: 'The current is the same at all points in a series circuit', difficulty: 'easy' },
      { topic: 'DC Circuits', question: 'What is a parallel circuit?', answer: 'A circuit where components are connected across multiple paths', difficulty: 'easy' },
      { topic: 'DC Circuits', question: 'In a parallel circuit, how does the voltage compare across different branches?', answer: 'The voltage is the same across all branches in a parallel circuit', difficulty: 'easy' },
      { topic: 'DC Circuits', question: 'What happens to the total resistance when resistors are connected in series?', answer: 'The total resistance is the sum of the individual resistances', difficulty: 'easy' },
      { topic: 'DC Circuits', question: 'What is the formula for total resistance in parallel?', answer: '1/Rtotal = 1/R1 + 1/R2 + ... + 1/Rn', difficulty: 'medium' },
      { topic: 'DC Circuits', question: 'What is Kirchhoff\'s Current Law?', answer: 'The sum of currents entering a node equals the sum of currents leaving the node', difficulty: 'medium' },
      
      { topic: 'Resistors', question: 'What is the purpose of a resistor?', answer: 'To limit or control the flow of electric current in a circuit', difficulty: 'easy' },
      { topic: 'Resistors', question: 'What is the color code for a 1kΩ resistor with 5% tolerance?', answer: 'Brown, Black, Red, Gold', difficulty: 'medium' },
      { topic: 'Resistors', question: 'What factors affect the resistance of a conductor?', answer: 'Length, cross-sectional area, material, and temperature', difficulty: 'medium' },
      { topic: 'Resistors', question: 'What happens to the resistance of most metals as temperature increases?', answer: 'It increases', difficulty: 'easy' },
      { topic: 'Resistors', question: 'What is a thermistor?', answer: 'A resistor whose resistance changes significantly with temperature', difficulty: 'medium' },
      { topic: 'Resistors', question: 'What is a variable resistor called?', answer: 'A potentiometer or rheostat', difficulty: 'easy' },
      { topic: 'Resistors', question: 'What is the power rating of a resistor?', answer: 'The maximum power the resistor can dissipate without damage', difficulty: 'medium' },
      
      { topic: 'Capacitors', question: 'What is a capacitor?', answer: 'A device that stores electrical energy in an electric field', difficulty: 'easy' },
      { topic: 'Capacitors', question: 'What is the unit of capacitance?', answer: 'Farad (F)', difficulty: 'easy' },
      { topic: 'Capacitors', question: 'What is the formula for the energy stored in a capacitor?', answer: 'E = (1/2)CV², where C is capacitance and V is voltage', difficulty: 'medium' },
      { topic: 'Capacitors', question: 'What is the relationship between capacitance, plate area, and plate separation?', answer: 'Capacitance is directly proportional to plate area and inversely proportional to plate separation', difficulty: 'medium' },
      { topic: 'Capacitors', question: 'What happens to the total capacitance when capacitors are connected in parallel?', answer: 'The total capacitance is the sum of the individual capacitances', difficulty: 'medium' },
      { topic: 'Capacitors', question: 'What is the formula for capacitive reactance?', answer: 'Xc = 1/(2πfC), where f is frequency and C is capacitance', difficulty: 'hard' },
      { topic: 'Capacitors', question: 'What is the function of a capacitor in a DC circuit?', answer: 'It blocks DC current but allows changing currents to pass by charging and discharging', difficulty: 'medium' },
      
      { topic: 'Inductors', question: 'What is an inductor?', answer: 'A passive electrical component that stores energy in a magnetic field when electric current flows through it', difficulty: 'medium' },
      { topic: 'Inductors', question: 'What is the unit of inductance?', answer: 'Henry (H)', difficulty: 'easy' },
      { topic: 'Inductors', question: 'What is the formula for inductive reactance?', answer: 'XL = 2πfL, where f is frequency and L is inductance', difficulty: 'hard' },
      { topic: 'Inductors', question: 'What happens to an inductor when current through it changes rapidly?', answer: 'It opposes the change in current by generating a back EMF', difficulty: 'medium' },
      { topic: 'Inductors', question: 'What is self-inductance?', answer: 'The property of an inductor that opposes changes in current flowing through it', difficulty: 'medium' },
      { topic: 'Inductors', question: 'What factors affect the inductance of a coil?', answer: 'Number of turns, coil diameter, coil length, and core material', difficulty: 'medium' },
      { topic: 'Inductors', question: 'What is mutual inductance?', answer: 'The property whereby a change in current in one circuit induces a voltage in another circuit', difficulty: 'hard' }
    ]
  },
  'module-4': {
    number: '4',
    title: 'Basic Electronics',
    description: 'Semiconductors, printed circuit boards, and electronic instruments.',
    category: 'Basic Knowledge',
    topics: [
      { number: '4.1', title: 'Semiconductors' },
      { number: '4.2', title: 'Transistors' },
      { number: '4.3', title: 'Integrated Circuits' },
      { number: '4.4', title: 'Printed Circuit Boards' },
      { number: '4.5', title: 'Servomechanisms' },
      { number: '4.6', title: 'Electronic Instruments' }
    ],
    flashcards: [
      { topic: 'Semiconductors', question: 'What is a semiconductor?', answer: 'A material with electrical conductivity between that of a conductor and an insulator', difficulty: 'easy' },
      { topic: 'Semiconductors', question: 'What are the two most common semiconductor materials?', answer: 'Silicon and germanium', difficulty: 'easy' },
      { topic: 'Semiconductors', question: 'What is doping?', answer: 'The process of adding impurities to a semiconductor to change its electrical properties', difficulty: 'medium' },
      { topic: 'Semiconductors', question: 'What is an N-type semiconductor?', answer: 'A semiconductor doped with elements that provide extra electrons (negative charge carriers)', difficulty: 'medium' },
      { topic: 'Semiconductors', question: 'What is a P-type semiconductor?', answer: 'A semiconductor doped with elements that create holes (positive charge carriers)', difficulty: 'medium' },
      { topic: 'Semiconductors', question: 'What is a P-N junction?', answer: 'The boundary between P-type and N-type semiconductors in a single crystal', difficulty: 'medium' },
      { topic: 'Semiconductors', question: 'What is a diode?', answer: 'A semiconductor device that allows current to flow in one direction only', difficulty: 'easy' },
      { topic: 'Semiconductors', question: 'What is forward bias?', answer: 'When a positive voltage is applied to the P-side of a diode and negative to the N-side, allowing current to flow', difficulty: 'medium' },
      { topic: 'Semiconductors', question: 'What is reverse bias?', answer: 'When a negative voltage is applied to the P-side of a diode and positive to the N-side, blocking current flow', difficulty: 'medium' },
      
      { topic: 'Transistors', question: 'What is a transistor?', answer: 'A semiconductor device used to amplify or switch electronic signals', difficulty: 'easy' },
      { topic: 'Transistors', question: 'What are the three regions of a bipolar junction transistor (BJT)?', answer: 'Emitter, base, and collector', difficulty: 'medium' },
      { topic: 'Transistors', question: 'What is the difference between NPN and PNP transistors?', answer: 'NPN uses electrons as carriers and the arrow points outward, while PNP uses holes and the arrow points inward', difficulty: 'medium' },
      { topic: 'Transistors', question: 'What is the formula for transistor current gain (β)?', answer: 'β = IC/IB, where IC is collector current and IB is base current', difficulty: 'medium' },
      { topic: 'Transistors', question: 'What is a field-effect transistor (FET)?', answer: 'A transistor that uses an electric field to control the conductivity of a channel', difficulty: 'medium' },
      { topic: 'Transistors', question: 'What are the three terminals of a MOSFET?', answer: 'Gate, source, and drain', difficulty: 'medium' },
      { topic: 'Transistors', question: 'What is the advantage of a FET over a BJT?', answer: 'Higher input impedance, lower power consumption, and better temperature stability', difficulty: 'hard' },
      
      { topic: 'Integrated Circuits', question: 'What is an integrated circuit?', answer: 'A small electronic circuit containing multiple devices on a single semiconductor chip', difficulty: 'easy' },
      { topic: 'Integrated Circuits', question: 'What are the advantages of integrated circuits over discrete components?', answer: 'Smaller size, lower cost, higher reliability, and faster operation', difficulty: 'medium' },
      { topic: 'Integrated Circuits', question: 'What is Moore\'s Law?', answer: 'The observation that the number of transistors in an integrated circuit doubles about every two years', difficulty: 'medium' },
      { topic: 'Integrated Circuits', question: 'What is an operational amplifier (op-amp)?', answer: 'An integrated circuit that amplifies the difference between two input voltages', difficulty: 'medium' },
      { topic: 'Integrated Circuits', question: 'What is a digital integrated circuit?', answer: 'An IC that operates with discrete voltage levels representing logical states (0 and 1)', difficulty: 'medium' },
      { topic: 'Integrated Circuits', question: 'What is an analog integrated circuit?', answer: 'An IC that operates with continuous voltage or current levels', difficulty: 'medium' },
      { topic: 'Integrated Circuits', question: 'What is a microprocessor?', answer: 'An integrated circuit that contains a CPU (central processing unit)', difficulty: 'medium' },
      
      { topic: 'Printed Circuit Boards', question: 'What is a PCB?', answer: 'A board that connects electronic components using conductive tracks', difficulty: 'easy' },
      { topic: 'Printed Circuit Boards', question: 'What is the substrate material commonly used in PCBs?', answer: 'FR-4 (fiberglass-reinforced epoxy laminate)', difficulty: 'medium' },
      { topic: 'Printed Circuit Boards', question: 'What is the purpose of soldermask on a PCB?', answer: 'To protect the copper traces from oxidation and to prevent solder bridges from forming during assembly', difficulty: 'medium' },
      { topic: 'Printed Circuit Boards', question: 'What is a multilayer PCB?', answer: 'A PCB with multiple layers of copper tracks and insulating substrate', difficulty: 'medium' },
      { topic: 'Printed Circuit Boards', question: 'What is a via in PCB design?', answer: 'A small hole lined with metal that connects tracks on different layers of a PCB', difficulty: 'medium' },
      { topic: 'Printed Circuit Boards', question: 'What is surface mount technology (SMT)?', answer: 'A method of mounting components directly onto the surface of a PCB', difficulty: 'medium' },
      { topic: 'Printed Circuit Boards', question: 'What is through-hole technology?', answer: 'A method of mounting components by inserting their leads through holes in the PCB and soldering them on the opposite side', difficulty: 'medium' },
      
      { topic: 'Servomechanisms', question: 'What is a servomechanism?', answer: 'A system that uses feedback to control the position, velocity, or acceleration of a mechanical device', difficulty: 'medium' },
      { topic: 'Servomechanisms', question: 'What are the main components of a servomechanism?', answer: 'Sensor, controller, amplifier, and actuator', difficulty: 'medium' },
      { topic: 'Servomechanisms', question: 'What is the purpose of a servo motor?', answer: 'To provide precise position control using a feedback mechanism', difficulty: 'medium' },
      { topic: 'Servomechanisms', question: 'What is closed-loop control?', answer: 'A control system that uses feedback to adjust its output to achieve the desired result', difficulty: 'medium' },
      { topic: 'Servomechanisms', question: 'What is open-loop control?', answer: 'A control system that does not use feedback and operates based solely on input', difficulty: 'medium' },
      { topic: 'Servomechanisms', question: 'What is damping in a servo system?', answer: 'The ability of the system to reduce oscillations and stabilize at the desired position', difficulty: 'hard' },
      { topic: 'Servomechanisms', question: 'Where are servomechanisms used in aircraft?', answer: 'In flight control surfaces, landing gear, flaps, autopilot systems, and engine controls', difficulty: 'medium' },
      
      { topic: 'Electronic Instruments', question: 'What is a digital multimeter?', answer: 'An electronic instrument that can measure voltage, current, and resistance', difficulty: 'easy' },
      { topic: 'Electronic Instruments', question: 'What is an oscilloscope?', answer: 'An instrument that displays signal voltages as a function of time', difficulty: 'medium' },
      { topic: 'Electronic Instruments', question: 'What is a frequency counter?', answer: 'An instrument that measures the frequency of a repetitive signal', difficulty: 'medium' },
      { topic: 'Electronic Instruments', question: 'What is a spectrum analyzer?', answer: 'An instrument that displays the amplitude of a signal as a function of frequency', difficulty: 'hard' },
      { topic: 'Electronic Instruments', question: 'How is voltage measured with a multimeter?', answer: 'By connecting the probes in parallel with the component or circuit being measured', difficulty: 'easy' },
      { topic: 'Electronic Instruments', question: 'How is current measured with a multimeter?', answer: 'By connecting the probes in series with the circuit being measured', difficulty: 'medium' },
      { topic: 'Electronic Instruments', question: 'What is an LCR meter?', answer: 'An instrument that measures inductance (L), capacitance (C), and resistance (R)', difficulty: 'medium' }
    ]
  },
  'module-8': {
    number: '8',
    title: 'Basic Aerodynamics',
    description: 'Physics of the atmosphere, aerodynamics, and flight stability and dynamics.',
    category: 'Basic Knowledge',
    topics: [
      { number: '8.1', title: 'Physics of the Atmosphere' },
      { number: '8.2', title: 'Aerodynamics' },
      { number: '8.3', title: 'Flight Stability' },
      { number: '8.4', title: 'Flight Dynamics' }
    ],
    flashcards: [
      { topic: 'Physics of the Atmosphere', question: 'What is air density?', answer: 'The mass of air per unit volume, typically measured in kg/m³', difficulty: 'easy' },
      { topic: 'Physics of the Atmosphere', question: 'What is the standard atmospheric pressure at sea level?', answer: '1013.25 hPa (hectopascals) or 29.92 inches of mercury', difficulty: 'medium' },
      { topic: 'Physics of the Atmosphere', question: 'What are the main gases that compose the Earth\'s atmosphere?', answer: 'Nitrogen (78%), Oxygen (21%), and other gases including Argon and Carbon Dioxide (1%)', difficulty: 'easy' },
      { topic: 'Physics of the Atmosphere', question: 'What is the International Standard Atmosphere (ISA)?', answer: 'A model of how pressure, temperature, density, and viscosity of the atmosphere change with altitude', difficulty: 'medium' },
      { topic: 'Physics of the Atmosphere', question: 'What is the standard temperature at sea level according to ISA?', answer: '15°C or 59°F', difficulty: 'easy' },
      { topic: 'Physics of the Atmosphere', question: 'What is the standard temperature lapse rate in the troposphere?', answer: '1.98°C/1,000 ft or 6.5°C/km', difficulty: 'medium' },
      { topic: 'Physics of the Atmosphere', question: 'What is density altitude?', answer: 'The altitude in the standard atmosphere at which the density would be equal to the actual density at the place of observation', difficulty: 'hard' },
      { topic: 'Physics of the Atmosphere', question: 'How does air density affect aircraft performance?', answer: 'Lower air density reduces engine power output, decreases lift, and reduces propeller/rotor efficiency', difficulty: 'medium' },
      { topic: 'Physics of the Atmosphere', question: 'What is the relationship between temperature and air density?', answer: 'As temperature increases, air density decreases', difficulty: 'easy' },
      { topic: 'Physics of the Atmosphere', question: 'What is the difference between QNH, QFE, and QNE?', answer: 'QNH is altimeter setting to show elevation above sea level, QFE shows height above aerodrome, QNE is pressure altitude (29.92" Hg)', difficulty: 'hard' },
      { topic: 'Physics of the Atmosphere', question: 'What is relative humidity?', answer: 'The amount of water vapor in the air expressed as a percentage of the maximum possible', difficulty: 'medium' },
      { topic: 'Physics of the Atmosphere', question: 'What is the tropopause?', answer: 'The boundary between the troposphere and stratosphere, typically at 36,000-56,000 ft depending on latitude', difficulty: 'medium' },  
      
      { topic: 'Aerodynamics', question: 'What is Bernoulli\'s principle?', answer: 'As the speed of a fluid increases, its pressure decreases', difficulty: 'easy' },
      { topic: 'Aerodynamics', question: 'What is the formula for lift?', answer: 'L = (1/2) × ρ × V² × S × CL, where ρ is air density, V is velocity, S is wing area, and CL is lift coefficient', difficulty: 'medium' },
      { topic: 'Aerodynamics', question: 'What is angle of attack?', answer: 'The angle between the chord line of the wing and the relative airflow', difficulty: 'easy' },
      { topic: 'Aerodynamics', question: 'What is the stall angle?', answer: 'The angle of attack at which the airflow begins to separate from the upper surface of the wing, causing a loss of lift', difficulty: 'medium' },
      { topic: 'Aerodynamics', question: 'What is induced drag?', answer: 'Drag created as a consequence of producing lift, associated with wingtip vortices', difficulty: 'medium' },
      { topic: 'Aerodynamics', question: 'What is parasite drag?', answer: 'Drag caused by the shape and surface of the aircraft that is not associated with the production of lift', difficulty: 'medium' },
      { topic: 'Aerodynamics', question: 'What is the purpose of a wing\'s airfoil shape?', answer: 'To create a pressure differential between the upper and lower surfaces, generating lift', difficulty: 'easy' },
      { topic: 'Aerodynamics', question: 'What is the center of pressure?', answer: 'The point where the total aerodynamic force is considered to act on the airfoil', difficulty: 'medium' },
      { topic: 'Aerodynamics', question: 'What is ground effect?', answer: 'The increased lift and reduced drag that occurs when an aircraft flies close to the ground', difficulty: 'medium' },
      { topic: 'Aerodynamics', question: 'What is the purpose of flaps?', answer: 'To increase the lift coefficient of the wing, allowing the aircraft to fly at slower speeds', difficulty: 'easy' },
      { topic: 'Aerodynamics', question: 'What is Reynolds number?', answer: 'A dimensionless quantity that predicts flow patterns in different fluid flow situations', difficulty: 'hard' },
      { topic: 'Aerodynamics', question: 'What is the purpose of a winglet?', answer: 'To reduce induced drag by disrupting the formation of wingtip vortices', difficulty: 'medium' },
      { topic: 'Aerodynamics', question: 'What causes wingtip vortices?', answer: 'The pressure differential between the upper and lower wing surfaces creates a circular airflow at the wingtips', difficulty: 'medium' },
      
      { topic: 'Flight Stability', question: 'What is static stability?', answer: 'The initial tendency of an aircraft to return to its original position after being disturbed', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'What is dynamic stability?', answer: 'The behavior of an aircraft over time after it has been disturbed from a steady flight condition', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'What are the three axes of aircraft stability?', answer: 'Longitudinal, lateral, and directional (or vertical)', difficulty: 'easy' },
      { topic: 'Flight Stability', question: 'What is longitudinal stability?', answer: 'Stability around the lateral axis (pitch stability)', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'What is the purpose of the horizontal stabilizer?', answer: 'To provide longitudinal stability and pitch control', difficulty: 'easy' },
      { topic: 'Flight Stability', question: 'What is the purpose of the vertical stabilizer?', answer: 'To provide directional stability and prevent yaw', difficulty: 'easy' },
      { topic: 'Flight Stability', question: 'What is directional stability?', answer: 'Stability around the vertical axis (yaw stability)', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'What is lateral stability?', answer: 'Stability around the longitudinal axis (roll stability)', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'What is dihedral?', answer: 'The upward angle of the wings from root to tip when viewed from the front', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'How does dihedral affect aircraft stability?', answer: 'It improves lateral stability by creating a self-righting tendency during side slip', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'What is the center of gravity (CG)?', answer: 'The point at which the total weight of the aircraft is considered to act', difficulty: 'easy' },
      { topic: 'Flight Stability', question: 'How does CG position affect stability?', answer: 'If CG is too far forward, the aircraft is very stable but difficult to maneuver; if too far aft, the aircraft is unstable', difficulty: 'medium' },
      { topic: 'Flight Stability', question: 'What is the neutral point?', answer: 'The center of pressure position at which the aircraft exhibits neutral static longitudinal stability', difficulty: 'hard' },
      
      { topic: 'Flight Dynamics', question: 'What are the three primary flight controls?', answer: 'Ailerons, elevator, and rudder', difficulty: 'easy' },
      { topic: 'Flight Dynamics', question: 'What is the function of ailerons?', answer: 'To control roll by creating differential lift on the wings', difficulty: 'easy' },
      { topic: 'Flight Dynamics', question: 'What is the function of the elevator?', answer: 'To control pitch by changing the lift produced by the horizontal stabilizer', difficulty: 'easy' },
      { topic: 'Flight Dynamics', question: 'What is the function of the rudder?', answer: 'To control yaw by changing the direction of the airflow over the vertical stabilizer', difficulty: 'easy' },
      { topic: 'Flight Dynamics', question: 'What is adverse yaw?', answer: 'The tendency of an aircraft to yaw in the opposite direction to the roll caused by aileron deflection', difficulty: 'medium' },
      { topic: 'Flight Dynamics', question: 'What is the purpose of trim tabs?', answer: 'To reduce the control forces required by the pilot by applying a constant aerodynamic force', difficulty: 'medium' },
      { topic: 'Flight Dynamics', question: 'What are the three axes of aircraft motion?', answer: 'Longitudinal (roll), lateral (pitch), and vertical (yaw)', difficulty: 'easy' },
      { topic: 'Flight Dynamics', question: 'What is Dutch roll?', answer: 'A coupled oscillation in roll and yaw, common in swept-wing aircraft', difficulty: 'hard' },
      { topic: 'Flight Dynamics', question: 'What is the primary effect of increasing power in a propeller aircraft?', answer: 'Increase in airspeed and tendency to pitch up', difficulty: 'medium' },
      { topic: 'Flight Dynamics', question: 'What is the purpose of a yaw damper?', answer: 'To automatically counteract unwanted yaw oscillations', difficulty: 'medium' },
      { topic: 'Flight Dynamics', question: 'What is spiral instability?', answer: 'A condition where a banked aircraft tends to increase its bank angle if not corrected', difficulty: 'hard' },
      { topic: 'Flight Dynamics', question: 'What is phugoid oscillation?', answer: 'A long-period oscillation in pitch, involving changes in airspeed and altitude', difficulty: 'hard' },
      { topic: 'Flight Dynamics', question: 'What is control reversal?', answer: 'A phenomenon where high-speed airflow over control surfaces causes them to deflect in the opposite direction to that intended', difficulty: 'hard' }
    ]
  }
};

// Main seed function
async function main() {
  console.log('Starting to seed EASA modules and flashcards...');

  // Clear existing data to avoid duplicates - in proper order to respect foreign keys
  console.log('Clearing existing data...');
  await prisma.progress.deleteMany();
  await prisma.userModule.deleteMany();
  await prisma.studyRecord.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.subModule.deleteMany();
  await prisma.module.deleteMany();

  // Create an admin user to be the owner of the flashcards
  console.log('Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@easa-flashcards.com' },
    update: {},
    create: {
      email: 'admin@easa-flashcards.com',
      name: 'EASA Admin',
      // Add other required user fields based on your schema
    },
  });
  
  console.log(`Created admin user with ID: ${adminUser.id}`);
  
  // Loop through each module
  for (const [moduleKey, module] of Object.entries(moduleData)) {
    console.log(`Creating module: ${module.title}...`);
    
    // Create the module
    const createdModule = await prisma.module.create({
      data: {
        number: module.number,
        title: module.title,
        description: module.description,
        category: module.category,
      },
    });
    
    // Create topics (submodules)
    const topicMap = new Map();
    
    for (const topic of module.topics) {
      console.log(`  Creating topic: ${topic.title}...`);
      const createdTopic = await prisma.subModule.create({
        data: {
          number: topic.number,
          title: topic.title,
          moduleId: createdModule.id,
        },
      });
      
      topicMap.set(topic.title, createdTopic);
    }

    // Create flashcards
    let flashcardCount = 0;
    for (const flashcardItem of module.flashcards) {
      const topicItem = topicMap.get(flashcardItem.topic);
      
      if (!topicItem) {
        console.warn(`  Topic "${flashcardItem.topic}" not found, skipping flashcard: ${flashcardItem.question}`);
        continue;
      }
      
      await prisma.flashcard.create({
        data: {
          question: flashcardItem.question,
          answer: flashcardItem.answer,
          difficulty: flashcardItem.difficulty,
          tags: [flashcardItem.topic],
          approved: true,
          moduleId: createdModule.id,
          subModuleId: topicItem.id,
          userId: adminUser.id, // Use the dynamically created user ID
        },
      });
      
      flashcardCount++;
    }

    
    console.log(`  Created ${flashcardCount} flashcards for module: ${module.title}`);
  }
  
  console.log('Seed completed successfully!');
}

// Run the main function
main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });