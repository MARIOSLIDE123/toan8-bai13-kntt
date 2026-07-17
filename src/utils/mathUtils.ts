export interface PolynomialTerm {
  coeff: number;
  vars: string; // e.g., "x^2y", "xy", "x", "y", ""
}

export interface PolynomialQuestion {
  polyA: string;
  polyB: string;
  operation: '+' | '-';
  steps: string[];
  correctAnswer: string;
  options: string[];
}

export function generatePolynomialQuestion(): PolynomialQuestion {
  // We want grade 8 standard exercises:
  // e.g. A = ax^2 + bxy + c, B = dx^2 + exy + f
  // Or A = ax^2y - bxy^2 + c, etc.
  const types = [
    {
      vars: ['x^2', 'xy', 'y^2'],
      desc: 'Đa thức bậc 2 hai biến x, y'
    },
    {
      vars: ['x^2y', 'xy^2', 'xy'],
      desc: 'Đa thức bậc 3 chứa x và y'
    },
    {
      vars: ['x^2', 'x', ''],
      desc: 'Đa thức bậc 2 một biến x'
    }
  ];

  const selectedType = types[Math.floor(Math.random() * types.length)];
  const variables = selectedType.vars;

  // Generate coefficients for polyA and polyB between -5 and 8 (excluding 0)
  const getRand = () => {
    let r = 0;
    while (r === 0) {
      r = Math.floor(Math.random() * 11) - 5; // -5 to 5
    }
    return r;
  };

  const aCoeffs = variables.map(() => getRand());
  const bCoeffs = variables.map(() => getRand());
  const op: '+' | '-' = Math.random() > 0.5 ? '+' : '-';

  // Format terms into string representation
  const formatPoly = (coeffs: number[], vars: string[]): string => {
    let str = '';
    coeffs.forEach((c, idx) => {
      const v = vars[idx];
      if (c === 0) return;
      
      let sign = c > 0 ? ' + ' : ' - ';
      if (str === '') {
        sign = c > 0 ? '' : '-';
      }
      
      const absC = Math.abs(c);
      const coeffStr = absC === 1 && v !== '' ? '' : absC.toString();
      
      str += sign + coeffStr + v;
    });
    return str || '0';
  };

  const polyA = formatPoly(aCoeffs, variables);
  const polyB = formatPoly(bCoeffs, variables);

  // Compute correct terms
  const resultCoeffs = variables.map((_, idx) => {
    const cA = aCoeffs[idx];
    const cB = bCoeffs[idx];
    return op === '+' ? cA + cB : cA - cB;
  });

  const correctAnswer = formatPoly(resultCoeffs, variables);

  // Steps to solve
  const step1 = `(${polyA}) ${op} (${polyB})`;
  
  // Grouping similar terms step
  let step2Parts: string[] = [];
  variables.forEach((v, idx) => {
    const cA = aCoeffs[idx];
    const cB = bCoeffs[idx];
    if (cA === 0 && cB === 0) return;
    
    const vStr = v || 'hằng số';
    const signB = cB >= 0 ? '+' : '-';
    const opSign = op === '+' ? '+' : '-';
    
    if (v === '') {
      step2Parts.push(`(${cA} ${opSign} (${cB}))`);
    } else {
      step2Parts.push(`(${cA} ${opSign} (${cB}))${v}`);
    }
  });
  const step2 = step2Parts.join(' + ').replace(/\+ -/g, '- ');

  const steps = [
    `Bước 1: Viết phép tính và bỏ dấu ngoặc:\n$$${step1}$$`,
    `Bước 2: Nhóm các hạng tử đồng dạng:\n$$${step2}$$`,
    `Bước 3: Cộng/trừ hệ số để ra kết quả cuối cùng:\n$$${correctAnswer}$$`
  ];

  // Generate 3 distractors
  const distractors: string[] = [];
  while (distractors.length < 3) {
    const offset = () => Math.floor(Math.random() * 5) - 2; // -2 to 2
    const fakeCoeffs = resultCoeffs.map((c) => {
      const off = offset();
      return c + (off === 0 ? 1 : off); // guarantee change
    });
    const fakeAns = formatPoly(fakeCoeffs, variables);
    if (fakeAns !== correctAnswer && !distractors.includes(fakeAns) && fakeAns !== '0') {
      distractors.push(fakeAns);
    }
  }

  // Combine and shuffle options
  const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

  return {
    polyA,
    polyB,
    operation: op,
    steps,
    correctAnswer,
    options
  };
}
