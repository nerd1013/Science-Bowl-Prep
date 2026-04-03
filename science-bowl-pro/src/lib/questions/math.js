// DOE National Science Bowl - Math Questions

export const MATH_HS = [
  // SET 1
  {s:"Math",lv:"HS",set:1,round:1,f:"MC",t:"Algebra",q:"What is the solution to the equation 2x² - 8 = 0?",o:{W:"x = ±4",X:"x = ±2",Y:"x = ±8",Z:"x = ±16"},a:"X",b:"What is the discriminant of a quadratic equation ax² + bx + c = 0?",ba:"b² - 4ac"},
  {s:"Math",lv:"HS",set:1,round:1,f:"MC",t:"Geometry",q:"What is the sum of interior angles of a hexagon?",o:{W:"540°",X:"900°",Y:"720°",Z:"1080°"},a:"Y",b:"What is the formula for the sum of interior angles of a polygon with n sides?",ba:"(n-2) × 180°"},
  {s:"Math",lv:"HS",set:1,round:2,f:"SA",t:"Calculus",q:"What is the derivative of sin(x)?",a:"cos(x)",b:"What is the integral of cos(x)?",ba:"sin(x) + C"},
  {s:"Math",lv:"HS",set:1,round:2,f:"MC",t:"Probability",q:"A bag contains 4 red and 6 blue marbles. What is the probability of drawing two red marbles in a row without replacement?",o:{W:"2/15",X:"4/25",Y:"1/5",Z:"2/5"},a:"W",b:"What is the probability of rolling a sum of 7 with two standard dice?",ba:"1/6"},
  {s:"Math",lv:"HS",set:1,round:3,f:"MC",t:"Trigonometry",q:"In a right triangle with legs of length 3 and 4, what is the sine of the angle opposite the leg of length 3?",o:{W:"3/4",X:"4/5",Y:"3/5",Z:"4/3"},a:"Y",b:"What is the value of cos(60°)?",ba:"1/2"},
  {s:"Math",lv:"HS",set:1,round:3,f:"SA",t:"Algebra",q:"What is the name of the theorem that states: for a right triangle with legs a and b and hypotenuse c, a² + b² = c²?",a:"Pythagorean theorem",b:"What are the coordinates of the midpoint between (2,4) and (6,10)?",ba:"(4, 7)"},
  {s:"Math",lv:"HS",set:1,round:4,f:"MC",t:"Calculus",q:"What is the limit of (sin x)/x as x approaches 0?",o:{W:"0",X:"Undefined",Y:"∞",Z:"1"},a:"Z",b:"What is the second derivative of f(x) = x³?",ba:"6x"},
  {s:"Math",lv:"HS",set:1,round:4,f:"MC",t:"Statistics",q:"Which measure of central tendency is most affected by outliers?",o:{W:"Mode",X:"Median",Y:"Mean",Z:"Range"},a:"Y",b:"What is the term for the middle value in an ordered data set?",ba:"Median"},
  {s:"Math",lv:"HS",set:1,round:5,f:"SA",t:"Number Theory",q:"What is the greatest common divisor of 48 and 36?",a:"12",b:"What is the least common multiple of 8 and 12?",ba:"24"},
  {s:"Math",lv:"HS",set:1,round:5,f:"MC",t:"Geometry",q:"What is the volume of a sphere with radius 3?",o:{W:"12π",X:"18π",Y:"36π",Z:"27π"},a:"Y",b:"What is the surface area of a cube with side length 4?",ba:"96"},
  // SET 2
  {s:"Math",lv:"HS",set:2,round:1,f:"SA",t:"Algebra",q:"What is the sum of the infinite geometric series 1 + 1/2 + 1/4 + 1/8 + ...?",a:"2",b:"What is the formula for the sum of a finite geometric series with n terms, first term a, and ratio r?",ba:"S = a(1 - rⁿ)/(1 - r)"},
  {s:"Math",lv:"HS",set:2,round:1,f:"MC",t:"Trigonometry",q:"What is the period of the function y = sin(2x)?",o:{W:"4π",X:"2π",Y:"π",Z:"π/2"},a:"Y",b:"What is the amplitude of y = 3cos(x)?",ba:"3"},
  {s:"Math",lv:"HS",set:2,round:2,f:"SA",t:"Combinatorics",q:"How many ways can 5 people be arranged in a line?",a:"120",b:"How many ways can a committee of 3 be chosen from 7 people?",ba:"35"},
  {s:"Math",lv:"HS",set:2,round:2,f:"MC",t:"Calculus",q:"What is the area under the curve y = x² from x = 0 to x = 3?",o:{W:"6",X:"9",Y:"3",Z:"27"},a:"X",b:"What integration technique is used for ∫x·sin(x)dx?",ba:"Integration by parts"},
  {s:"Math",lv:"HS",set:2,round:3,f:"SA",t:"Algebra",q:"What is the value of log base 2 of 32?",a:"5",b:"What is the value of log base 10 of 1000?",ba:"3"},
  {s:"Math",lv:"HS",set:2,round:3,f:"MC",t:"Geometry",q:"What is the distance between the points (1, 2) and (4, 6)?",o:{W:"3",X:"4",Y:"5",Z:"7"},a:"Y",b:"What is the equation of a circle with center (2,3) and radius 4?",ba:"(x-2)² + (y-3)² = 16"},
  {s:"Math",lv:"HS",set:2,round:4,f:"SA",t:"Number Theory",q:"What is the smallest prime number?",a:"2",b:"How many prime numbers are there between 1 and 20?",ba:"8 (2, 3, 5, 7, 11, 13, 17, 19)"},
  {s:"Math",lv:"HS",set:2,round:4,f:"MC",t:"Calculus",q:"What is the derivative of e^x?",o:{W:"xe^(x-1)",X:"e^x",Y:"e^(x+1)",Z:"ln(x)"},a:"X",b:"What is the derivative of ln(x)?",ba:"1/x"},
  {s:"Math",lv:"HS",set:2,round:5,f:"SA",t:"Probability",q:"What is the probability of getting exactly 3 heads when flipping a fair coin 5 times?",a:"10/32 = 5/16",b:"What formula is used to calculate this?",ba:"Binomial probability: C(n,k) × p^k × (1-p)^(n-k)"},
  {s:"Math",lv:"HS",set:2,round:5,f:"MC",t:"Algebra",q:"What is the value of i² where i is the imaginary unit?",o:{W:"1",X:"-1",Y:"i",Z:"-i"},a:"X",b:"What is (3 + 4i)(3 - 4i)?",ba:"25"},
  // SET 3
  {s:"Math",lv:"HS",set:3,round:1,f:"MC",t:"Trigonometry",q:"What is the exact value of tan(45°)?",o:{W:"√2",X:"1",Y:"√3/2",Z:"√3"},a:"X",b:"What is the exact value of sin(30°)?",ba:"1/2"},
  {s:"Math",lv:"HS",set:3,round:1,f:"SA",t:"Calculus",q:"What is the derivative of x^n using the power rule?",a:"nx^(n-1)",b:"What is the derivative of a constant?",ba:"0"},
  {s:"Math",lv:"HS",set:3,round:2,f:"MC",t:"Statistics",q:"What is the standard deviation of the set {2, 4, 4, 4, 5, 5, 7, 9}?",o:{W:"1",X:"2",Y:"3",Z:"4"},a:"X",b:"What is the variance of this set?",ba:"4"},
  {s:"Math",lv:"HS",set:3,round:2,f:"SA",t:"Geometry",q:"What is the area of a regular hexagon with side length s?",a:"(3√3/2)s²",b:"What is the area of an equilateral triangle with side length s?",ba:"(√3/4)s²"},
  {s:"Math",lv:"HS",set:3,round:3,f:"MC",t:"Algebra",q:"What is the factored form of x² - 9?",o:{W:"(x+3)²",X:"(x-3)²",Y:"(x+3)(x-3)",Z:"(x-9)(x+1)"},a:"Y",b:"What is the name for expressions like x² - 9 that factor into conjugate pairs?",ba:"Difference of squares"},
  {s:"Math",lv:"HS",set:3,round:3,f:"SA",t:"Number Theory",q:"What is the Fundamental Theorem of Arithmetic?",a:"Every integer greater than 1 can be uniquely factored into prime numbers",b:"What is the prime factorization of 360?",ba:"2³ × 3² × 5"},
  {s:"Math",lv:"HS",set:3,round:4,f:"MC",t:"Calculus",q:"What is the chain rule used for in calculus?",o:{W:"Adding derivatives of two functions",X:"Finding the derivative of a composite function",Y:"Finding the integral of a product",Z:"Differentiating a quotient"},a:"X",b:"What rule is used to differentiate f(x)/g(x)?",ba:"Quotient rule"},
  {s:"Math",lv:"HS",set:3,round:4,f:"SA",t:"Combinatorics",q:"What is the number of ways to arrange the letters in the word MATH?",a:"24",b:"What is the number of 2-element subsets of a 4-element set?",ba:"6"},
  {s:"Math",lv:"HS",set:3,round:5,f:"MC",t:"Trigonometry",q:"What is the law of cosines used to find?",o:{W:"Only angles in a right triangle",X:"A side or angle in any triangle",Y:"The area of any triangle",Z:"Only sides in equilateral triangles"},a:"X",b:"State the law of cosines for side c.",ba:"c² = a² + b² - 2ab·cos(C)"},
  {s:"Math",lv:"HS",set:3,round:5,f:"SA",t:"Probability",q:"What is the expected value of rolling a standard 6-sided die?",a:"3.5",b:"What is the variance of rolling a standard 6-sided die?",ba:"35/12 ≈ 2.917"},
  // SET 4
  {s:"Math",lv:"HS",set:4,round:1,f:"MC",t:"Geometry",q:"Two parallel lines are cut by a transversal. Which angles are equal?",o:{W:"Interior angles on the same side",X:"Alternate interior angles",Y:"Co-interior angles",Z:"Supplementary angles"},a:"X",b:"What is the name for angles that are on the same side of the transversal and between the parallel lines?",ba:"Co-interior (consecutive interior or same-side interior) angles"},
  {s:"Math",lv:"HS",set:4,round:1,f:"SA",t:"Algebra",q:"What is the vertex form of a quadratic equation?",a:"y = a(x - h)² + k, where (h, k) is the vertex",b:"For y = 2(x-3)² + 1, what is the vertex?",ba:"(3, 1)"},
  {s:"Math",lv:"HS",set:4,round:2,f:"MC",t:"Calculus",q:"What does the Fundamental Theorem of Calculus state?",o:{W:"Integration and differentiation are inverse operations",X:"All continuous functions have derivatives",Y:"The integral of any function exists",Z:"Derivatives and limits are equal"},a:"W",b:"What is the definite integral of f(x) = 2x from x = 1 to x = 3?",ba:"8"},
  {s:"Math",lv:"HS",set:4,round:2,f:"SA",t:"Number Theory",q:"What is the value of 0! (zero factorial)?",a:"1",b:"What is the value of 5!?",ba:"120"},
  {s:"Math",lv:"HS",set:4,round:3,f:"MC",t:"Statistics",q:"What is the 68-95-99.7 rule also called?",o:{W:"The variance rule",X:"The standard deviation rule",Y:"The empirical rule",Z:"The normal rule"},a:"Y",b:"In a normal distribution, what percentage of data falls within 2 standard deviations of the mean?",ba:"95%"},
  {s:"Math",lv:"HS",set:4,round:3,f:"SA",t:"Algebra",q:"Solve the system: 2x + 3y = 12 and x - y = 1. What is x?",a:"3",b:"What is y in the same system?",ba:"2"},
  {s:"Math",lv:"HS",set:4,round:4,f:"MC",t:"Trigonometry",q:"What is the Pythagorean identity in trigonometry?",o:{W:"sin(x) + cos(x) = 1",X:"sin²(x) + cos²(x) = 1",Y:"tan²(x) + 1 = sec(x)",Z:"sin(x) = cos(90° - x)"},a:"X",b:"What is 1 + tan²(x) equal to?",ba:"sec²(x)"},
  {s:"Math",lv:"HS",set:4,round:4,f:"SA",t:"Geometry",q:"What is the formula for the volume of a cone?",a:"V = (1/3)πr²h",b:"What is the formula for the lateral surface area of a cone?",ba:"A = πrl where l is the slant height"},
  {s:"Math",lv:"HS",set:4,round:5,f:"MC",t:"Combinatorics",q:"How many distinct arrangements are there of the letters in the word 'MISSISSIPPI'?",o:{W:"11!",X:"34650",Y:"831600",Z:"7920"},a:"X",b:"What formula accounts for repeated elements in permutations?",ba:"n! / (n1! × n2! × ... × nk!)"},
  {s:"Math",lv:"HS",set:4,round:5,f:"SA",t:"Calculus",q:"What is the Taylor series for e^x centered at x = 0?",a:"Σ(x^n / n!) = 1 + x + x²/2! + x³/3! + ...",b:"What is the radius of convergence of the Taylor series for e^x?",ba:"Infinity (converges for all x)"},
];

export const MATH_MS = [
  {s:"Math",lv:"MS",set:1,round:1,f:"MC",t:"Algebra",q:"Solve for x: 3x + 6 = 15",o:{W:"x = 2",X:"x = 3",Y:"x = 7",Z:"x = 5"},a:"X",b:"What is the value of 2³?",ba:"8"},
  {s:"Math",lv:"MS",set:1,round:1,f:"SA",t:"Geometry",q:"What is the area of a rectangle with length 8 and width 5?",a:"40",b:"What is the perimeter of a square with side length 6?",ba:"24"},
  {s:"Math",lv:"MS",set:1,round:2,f:"MC",t:"Fractions",q:"What is 3/4 + 1/2?",o:{W:"4/6",X:"1 1/4",Y:"5/6",Z:"4/8"},a:"X",b:"What is 2/3 × 3/4?",ba:"1/2"},
  {s:"Math",lv:"MS",set:1,round:2,f:"SA",t:"Geometry",q:"What is the sum of angles in a triangle?",a:"180 degrees",b:"How many degrees are in a straight line?",ba:"180"},
  {s:"Math",lv:"MS",set:2,round:1,f:"MC",t:"Statistics",q:"What is the median of the set {3, 7, 9, 5, 1}?",o:{W:"3",X:"5",Y:"7",Z:"9"},a:"X",b:"What is the mode of {2, 4, 4, 6, 8}?",ba:"4"},
  {s:"Math",lv:"MS",set:2,round:1,f:"SA",t:"Number Theory",q:"What is the greatest common factor of 12 and 18?",a:"6",b:"What is the least common multiple of 4 and 6?",ba:"12"},
  {s:"Math",lv:"MS",set:2,round:2,f:"MC",t:"Geometry",q:"How many sides does a pentagon have?",o:{W:"4",X:"5",Y:"6",Z:"7"},a:"X",b:"What is the sum of interior angles of a quadrilateral?",ba:"360 degrees"},
  {s:"Math",lv:"MS",set:3,round:1,f:"SA",t:"Algebra",q:"What is the value of 4² + 3²?",a:"25",b:"What is √144?",ba:"12"},
];