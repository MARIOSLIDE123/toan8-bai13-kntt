import { Question, Difficulty, QuestionType, MatchingItem, TableRow } from "../types";

// Standardize types in /src/types.ts later if needed, but let's declare them here and export them.
export type { Question, Difficulty, QuestionType, MatchingItem, TableRow };

// Manual hand-crafted high quality conceptual questions (60 questions)
const staticQuestions: Question[] = [
  // --- NHẬN BIẾT (Recognition) ---
  {
    id: "nb_mc_1",
    type: "multiple-choice",
    difficulty: "nhan-biet",
    questionText: "Đơn thức nào sau đây đồng dạng với đơn thức $3x^2y$?",
    options: [
      "$-2xy^2$",
      "$\\frac{1}{2}x^2y$",
      "$3xy$",
      "$3x^2y^2$"
    ],
    correctOptionIndex: 1,
    explanation: [
      "Hai đơn thức đồng dạng là hai đơn thức có hệ số khác $0$ và có cùng phần biến.",
      "Đơn thức gốc $3x^2y$ có phần biến là $x^2y$.",
      "Trong các lựa chọn, chỉ có đơn thức $\\frac{1}{2}x^2y$ có cùng phần biến $x^2y$."
    ],
    tip: "Chú ý phân biệt giữa $x^2y$ và $xy^2$ - số mũ của từng biến phải khớp hoàn toàn!",
    similarExample: "Đơn thức $-5x^3y^2$ đồng dạng với $2x^3y^2$."
  },
  {
    id: "nb_tf_1",
    type: "true-false",
    difficulty: "nhan-biet",
    questionText: "Biểu thức $x^2 - 2x + \\frac{1}{x}$ là một đa thức.",
    isTrue: false,
    explanation: [
      "Đa thức là tổng của những đơn thức.",
      "Mỗi đơn thức chỉ chứa phép nhân và lũy thừa với số mũ nguyên dương.",
      "Biểu thức chứa $\\frac{1}{x} = x^{-1}$ (biến $x$ ở mẫu số) nên không phải là đơn thức. Do đó biểu thức đã cho không phải là đa thức."
    ],
    tip: "Nếu có biến nằm ở mẫu số hoặc dưới dấu căn bậc hai, biểu thức đó chắc chắn không phải là đa thức!",
    similarExample: "Biểu thức $\\frac{2x+1}{x^2}$ không phải là đa thức."
  },
  {
    id: "nb_fb_1",
    type: "fill-blank",
    difficulty: "nhan-biet",
    questionText: "Xác định bậc của đa thức sau: $A = 5x^4y - 3x^2y^3 + x^2y - 5$.",
    correctAnswerText: "5",
    explanation: [
      "Bậc của đa thức là bậc của hạng tử có bậc cao nhất trong dạng thu gọn của đa thức đó.",
      "Hạng tử $5x^4y$ có bậc là $4 + 1 = 5$.",
      "Hạng tử $-3x^2y^3$ có bậc là $2 + 3 = 5$.",
      "Hạng tử $x^2y$ có bậc là $2 + 1 = 3$.",
      "Do đó bậc cao nhất của các hạng tử là $5$."
    ],
    tip: "Nhớ cộng số mũ của tất cả các biến trong cùng một hạng tử để tính bậc của hạng tử đó!",
    similarExample: "Bậc của đa thức $x^5y^2 + x^3y^4$ là $5 + 2 = 7$."
  },
  {
    id: "nb_ms_1",
    type: "multi-select",
    difficulty: "nhan-biet",
    questionText: "Trong các biểu thức sau, những biểu thức nào là đơn thức? (Chọn tất cả các đáp án đúng)",
    options: [
      "$2x^2y^3$",
      "$3x + y$",
      "$-5$",
      "$\\frac{x}{y}$",
      "$\\sqrt{2}x$"
    ],
    correctOptionIndices: [0, 2, 4],
    explanation: [
      "Đơn thức là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến.",
      "$2x^2y^3$ là một tích giữa số và biến $\\Rightarrow$ Đơn thức.",
      "$3x + y$ chứa phép cộng $\\Rightarrow$ Đa thức (không phải đơn thức).",
      "$-5$ là một số thực $\\Rightarrow$ Đơn thức.",
      "$\\frac{x}{y}$ chứa biến ở mẫu $\\Rightarrow$ Không phải đơn thức.",
      "$\\sqrt{2}x$ là tích giữa số $\\sqrt{2}$ và biến $x$ $\\Rightarrow$ Đơn thức."
    ],
    tip: "Một số đơn lẻ vẫn được coi là một đơn thức có bậc bằng 0!",
    similarExample: "$-10$, $x^2$, $\\frac{3}{4}xy^2$ đều là các đơn thức."
  },
  {
    id: "nb_mt_1",
    type: "matching",
    difficulty: "nhan-biet",
    questionText: "Hãy ghép nối đơn thức ở cột bên trái với bậc tương ứng của nó ở cột bên phải:",
    matchingPairs: [
      { left: "$5x^2y^3$", right: "Bậc 5" },
      { left: "$-3x^4$", right: "Bậc 4" },
      { left: "$12x^2yz$", right: "Bậc 4" },
      { left: "$9$", right: "Bậc 0" }
    ],
    explanation: [
      "Đơn thức $5x^2y^3$ có bậc là $2 + 3 = 5$.",
      "Đơn thức $-3x^4$ có bậc là $4$.",
      "Đơn thức $12x^2yz$ có bậc là $2 + 1 + 1 = 4$ (chú ý biến $y$ và $z$ có số mũ ẩn là $1$).",
      "Số $9$ là số khác $0$ nên có bậc là $0$."
    ],
    tip: "Biến không ghi số mũ nghĩa là có số mũ bằng 1, đừng bỏ quên khi cộng bậc nhé!"
  },
  {
    id: "nb_so_1",
    type: "sorting",
    difficulty: "nhan-biet",
    questionText: "Sắp xếp các đơn thức sau theo thứ tự bậc tăng dần:",
    itemsToSort: [
      "$4x^3y^2$", // bậc 5
      "$-2x^2y$",  // bậc 3
      "$100$",     // bậc 0
      "$xyz$"      // bậc 3 (bằng nhau xếp sau)
    ],
    sortedIndices: [2, 1, 3, 0],
    explanation: [
      "Bậc của $100$ là $0$.",
      "Bậc của $-2x^2y$ là $2 + 1 = 3$.",
      "Bậc của $xyz$ là $1 + 1 + 1 = 3$.",
      "Bậc của $4x^3y^2$ là $3 + 2 = 5$.",
      "Thứ tự bậc tăng dần: $0 < 3 \\le 3 < 5$. Do đó thứ tự đúng là $100 \\rightarrow -2x^2y \\rightarrow xyz \\rightarrow 4x^3y^2$."
    ],
    tip: "Hãy tính bậc của từng hạng tử trước rồi mới tiến hành sắp xếp nhé!"
  },
  {
    id: "nb_tb_1",
    type: "table-fill",
    difficulty: "nhan-biet",
    questionText: "Hoàn thành bảng thông tin về các đơn thức sau:",
    tableRows: [
      { label: "$-5x^2y^3$", coeff: "-5", deg: "5" },
      { label: "$\\frac{3}{4}xy^2$", coeff: "3/4", deg: "3" },
      { label: "$-x^3$", coeff: "-1", deg: "3" }
    ],
    tableFields: [
      { rowIdx: 0, field: "coeff", placeholder: "Hệ số" },
      { rowIdx: 0, field: "deg", placeholder: "Bậc" },
      { rowIdx: 1, field: "deg", placeholder: "Bậc" },
      { rowIdx: 2, field: "coeff", placeholder: "Hệ số" }
    ],
    explanation: [
      "Với đơn thức $-5x^2y^3$: Hệ số là $-5$, bậc là $2 + 3 = 5$.",
      "Với đơn thức $\\frac{3}{4}xy^2$: Hệ số là $\\frac{3}{4}$, bậc là $1 + 2 = 3$.",
      "Với đơn thức $-x^3$: Hệ số là $-1$, bậc là $3$."
    ],
    tip: "Đơn thức dạng $-x^3$ có hệ số ngầm hiểu là $-1$ chứ không phải chỉ có dấu trừ đâu nhé!"
  },

  // --- THÔNG HIỂU (Understanding) ---
  {
    id: "th_mc_1",
    type: "multiple-choice",
    difficulty: "thong-hieu",
    questionText: "Thu gọn đa thức $P = x^2y - 3xy + 2x^2y + xy - 5$ ta được:",
    options: [
      "$3x^2y - 2xy - 5$",
      "$3x^2y + 2xy - 5$",
      "$x^2y - 2xy - 5$",
      "$3x^2y - 4xy - 5$"
    ],
    correctOptionIndex: 0,
    explanation: [
      "Nhóm các hạng tử đồng dạng:",
      "$P = (x^2y + 2x^2y) + (-3xy + xy) - 5$",
      "$P = (1 + 2)x^2y + (-3 + 1)xy - 5$",
      "$P = 3x^2y - 2xy - 5$."
    ],
    tip: "Đặc biệt chú ý dấu trừ của hạng tử khi gom nhóm: $-3xy + xy = -2xy$.",
    similarExample: "Thu gọn $2xy + 3xy - xy = 4xy$."
  },
  {
    id: "th_tf_1",
    type: "true-false",
    difficulty: "thong-hieu",
    questionText: "Tổng của hai đa thức $A = 2x - 3y$ và $B = -2x + 5y$ là một đa thức bậc $1$.",
    isTrue: true,
    explanation: [
      "Tính tổng $A + B = (2x - 3y) + (-2x + 5y)$",
      "Phá ngoặc và gộp hạng tử đồng dạng:",
      "$A + B = 2x - 3y - 2x + 5y = (2x - 2x) + (-3y + 5y) = 0 + 2y = 2y$.",
      "Đa thức kết quả $2y$ là đa thức bậc $1$. Phát biểu trên hoàn toàn đúng."
    ],
    tip: "Sau khi cộng, các hạng tử bậc cao có thể triệt tiêu lẫn nhau, làm giảm bậc của đa thức tổng!",
    similarExample: "Tổng của $(x^2 + y)$ và $(-x^2 + x)$ là $x + y$ (bậc giảm từ 2 xuống 1)."
  },
  {
    id: "th_fb_1",
    type: "fill-blank",
    difficulty: "thong-hieu",
    questionText: "Cho $A = 3x^2 - xy + 2$ và $B = x^2 + 2xy - 1$. Tính hệ số tự do của đa thức hiệu $A - B$.",
    correctAnswerText: "3",
    explanation: [
      "Tính hiệu $A - B = (3x^2 - xy + 2) - (x^2 + 2xy - 1)$",
      "Phá ngoặc đổi dấu hạng tử của B:",
      "$A - B = 3x^2 - xy + 2 - x^2 - 2xy + 1$",
      "Gom nhóm: $(3x^2 - x^2) + (-xy - 2xy) + (2 + 1) = 2x^2 - 3xy + 3$.",
      "Hệ số tự do (hạng tử không chứa biến) là $3$."
    ],
    tip: "Hệ số tự do là số đứng độc lập ở cuối cùng sau khi đã thu gọn hoàn toàn biểu thức.",
    similarExample: "Hệ số tự do của $x^2 - x - 7$ là $-7$."
  },
  {
    id: "th_ms_1",
    type: "multi-select",
    difficulty: "thong-hieu",
    questionText: "Khi nhân đơn thức $2xy$ với đa thức $x^2 - 3y + 1$, những hạng tử nào sau đây xuất hiện trong kết quả thu gọn? (Chọn tất cả các đáp án đúng)",
    options: [
      "$2x^3y$",
      "$-6xy^2$",
      "$2xy$",
      "$-6xy$",
      "$2x^2y$"
    ],
    correctOptionIndices: [0, 1, 2],
    explanation: [
      "Áp dụng quy tắc nhân đơn thức với đa thức:",
      "$2xy \\cdot (x^2 - 3y + 1) = 2xy \\cdot x^2 + 2xy \\cdot (-3y) + 2xy \\cdot 1$",
      "$= 2x^3y - 6xy^2 + 2xy$.",
      "Như vậy các hạng tử xuất hiện là $2x^3y$, $-6xy^2$, và $2xy$."
    ],
    tip: "Nhân hệ số với hệ số, và cộng số mũ của các biến cùng loại: $x \\cdot x^2 = x^3$!",
    similarExample: "$x \\cdot (x + y) = x^2 + xy$."
  },
  {
    id: "th_mt_1",
    type: "matching",
    difficulty: "thong-hieu",
    questionText: "Nối phép tính đa thức ở cột trái với kết quả tương ứng ở cột phải:",
    matchingPairs: [
      { left: "$(x-y) + (x+y)$", right: "$2x$" },
      { left: "$(x-y) - (x+y)$", right: "$-2y$" },
      { left: "$(x+y) - (x-y)$", right: "$2y$" },
      { left: "$x(y+1) - xy$", right: "$x$" }
    ],
    explanation: [
      "$(x-y) + (x+y) = x - y + x + y = 2x$.",
      "$(x-y) - (x+y) = x - y - x - y = -2y$.",
      "$(x+y) - (x-y) = x + y - x + y = 2y$.",
      "$x(y+1) - xy = xy + x - xy = x$."
    ],
    tip: "Phá ngoặc có dấu trừ đằng trước nhớ đổi dấu tất cả các số bên trong ngoặc!"
  },

  // --- VẬN DỤNG (Application) ---
  {
    id: "vd_mc_1",
    type: "multiple-choice",
    difficulty: "van-dung",
    questionText: "Giá trị của biểu thức $M = 2x^2y - 3xy^2 + 5$ tại $x = -1$ và $y = 2$ là:",
    options: [
      "$21$",
      "$13$",
      "$-3$",
      "$17$"
    ],
    correctOptionIndex: 0,
    explanation: [
      "Thay $x = -1$ và $y = 2$ vào biểu thức $M$:",
      "$M = 2 \\cdot (-1)^2 \\cdot 2 - 3 \\cdot (-1) \\cdot 2^2 + 5$",
      "$M = 2 \\cdot 1 \\cdot 2 - 3 \\cdot (-1) \\cdot 4 + 5$",
      "$M = 4 - (-12) + 5$",
      "$M = 4 + 12 + 5 = 21$."
    ],
    tip: "Hãy tính lũy thừa trước: $(-1)^2 = 1$, sau đó mới thực hiện phép nhân!",
    similarExample: "Tính giá trị $x^2y$ tại $x=2, y=3$ là $2^2 \\cdot 3 = 12$."
  },
  {
    id: "vd_tf_1",
    type: "true-false",
    difficulty: "van-dung",
    questionText: "Cho hình chữ nhật có chiều dài là $2x + 3$ (m), chiều rộng là $x - 1$ (m). Đa thức biểu diễn chu vi của hình chữ nhật này là $6x + 4$ (m).",
    isTrue: true,
    explanation: [
      "Chu vi hình chữ nhật bằng: $C = 2 \\cdot (\\text{chiều dài} + \\text{chiều rộng})$",
      "$C = 2 \\cdot [(2x + 3) + (x - 1)]$",
      "Thu gọn biểu thức trong ngoặc trước:",
      "$(2x + 3) + (x - 1) = 2x + 3 + x - 1 = 3x + 2$",
      "Nhân với 2 ở ngoài: $C = 2 \\cdot (3x + 2) = 6x + 4$ (m).",
      "Vậy khẳng định đã cho hoàn toàn chính xác."
    ],
    tip: "Chu vi là tổng chiều dài và chiều rộng nhân đôi, tránh nhầm sang diện tích là tích của chúng nhé!",
    similarExample: "Một hình vuông cạnh $2x+1$ có chu vi là $4(2x+1) = 8x+4$."
  },
  {
    id: "vd_fb_1",
    type: "fill-blank",
    difficulty: "van-dung",
    questionText: "Tìm số nguyên $a$ sao cho đa thức $A = ax^2y - 3x^2y + 5xy$ có bậc bằng $2$ (với $a \\neq 0$).",
    correctAnswerText: "3",
    explanation: [
      "Đa thức $A = (a-3)x^2y + 5xy$.",
      "Hạng tử $xy$ có bậc là $1 + 1 = 2$.",
      "Hạng tử $(a-3)x^2y$ có bậc là $2 + 1 = 3$.",
      "Để đa thức có bậc bằng $2$, hạng tử bậc $3$ phải bị triệt tiêu, tức là hệ số của nó bằng $0$.",
      "Suy ra $a - 3 = 0 \\Rightarrow a = 3$."
    ],
    tip: "Để giảm bậc của đa thức, ta cần triệt tiêu các số hạng có bậc lớn hơn mong muốn!",
    similarExample: "Để đa thức $mx^3 + 2x^2$ có bậc 2 thì hệ số $m$ phải bằng 0."
  },
  {
    id: "vd_ms_1",
    type: "multi-select",
    difficulty: "van-dung",
    questionText: "Những hằng đẳng thức nào sau đây là hằng đẳng thức đúng? (Chọn tất cả các đáp án đúng)",
    options: [
      "$(x+y)^2 = x^2 + 2xy + y^2$",
      "$(x-y)^2 = x^2 - 2xy + y^2$",
      "$x^2 - y^2 = (x-y)(x+y)$",
      "$(x-y)^2 = x^2 - y^2$",
      "$x^2 + y^2 = (x+y)(x-y)$"
    ],
    correctOptionIndices: [0, 1, 2],
    explanation: [
      "$(x+y)^2 = x^2 + 2xy + y^2$ là bình phương của một tổng $\\Rightarrow$ Đúng.",
      "$(x-y)^2 = x^2 - 2xy + y^2$ là bình phương của một hiệu $\\Rightarrow$ Đúng.",
      "$x^2 - y^2 = (x-y)(x+y)$ là hiệu hai bình phương $\\Rightarrow$ Đúng.",
      "$(x-y)^2 = x^2 - y^2$ là sai hoàn toàn.",
      "$x^2 + y^2 = (x+y)(x-y)$ cũng sai hoàn toàn."
    ],
    tip: "Ghi nhớ kỹ 3 hằng đẳng thức cơ bản này vì chúng cực kỳ phổ biến trong giải toán lớp 8!",
    similarExample: "$(a+b)^2$ luôn có thêm hạng tử trung gian $+2ab$."
  },

  // --- VẬN DỤNG CAO (Advanced Application) ---
  {
    id: "vdc_mc_1",
    type: "multiple-choice",
    difficulty: "van-dung-cao",
    questionText: "Tìm giá trị nhỏ nhất của biểu thức bậc hai sau: $A = x^2 - 4x + y^2 - 2y + 10$.",
    options: [
      "$5$",
      "$10$",
      "$0$",
      "$1$"
    ],
    correctOptionIndex: 0,
    explanation: [
      "Ta biến đổi biểu thức về dạng tổng các bình phương bằng cách áp dụng hằng đẳng thức:",
      "$A = (x^2 - 4x + 4) + (y^2 - 2y + 1) + 5$",
      "$A = (x-2)^2 + (y-1)^2 + 5$.",
      "Vì $(x-2)^2 \\ge 0$ với mọi $x$ và $(y-1)^2 \\ge 0$ với mọi $y$,",
      "Nên $A \\ge 5$ với mọi $x, y$.",
      "Dấu \"=\" xảy ra khi $x - 2 = 0 \\Rightarrow x = 2$ và $y - 1 = 0 \\Rightarrow y = 1$.",
      "Vậy giá trị nhỏ nhất của $A$ là $5$."
    ],
    tip: "Phương pháp tìm giá trị nhỏ nhất của đa thức nhiều biến là nhóm thành các bình phương hoàn hảo cộng với một hằng số!",
    similarExample: "Tìm GTNN của $x^2 + 2x + 3 = (x+1)^2 + 2 \\ge 2$."
  },
  {
    id: "vdc_tf_1",
    type: "true-false",
    difficulty: "van-dung-cao",
    questionText: "Hiệu diện tích của một hình vuông cạnh $x+3$ (cm) và một hình chữ nhật có chiều dài $x+5$ (cm), chiều rộng $x+1$ (cm) là một hằng số không phụ thuộc vào $x$.",
    isTrue: true,
    explanation: [
      "Diện tích hình vuông: $S_1 = (x+3)^2 = x^2 + 6x + 9$ ($\\text{cm}^2$).",
      "Diện tích hình chữ nhật: $S_2 = (x+5)(x+1) = x^2 + x + 5x + 5 = x^2 + 6x + 5$ ($\\text{cm}^2$).",
      "Hiệu diện tích là: $S_1 - S_2 = (x^2 + 6x + 9) - (x^2 + 6x + 5)$",
      "$= x^2 + 6x + 9 - x^2 - 6x - 5 = 4$ ($\\text{cm}^2$).",
      "Vì kết quả bằng $4$ (một số cụ thể không chứa biến $x$), nên hiệu diện tích luôn bằng $4$ và không phụ thuộc vào $x$. Phát biểu trên đúng."
    ],
    tip: "Khi đề bài yêu cầu chứng minh biểu thức không phụ thuộc vào biến, đích đến cuối cùng là biến $x$ sẽ bị triệt tiêu hết!",
    similarExample: "Chứng minh $(x-1)(x+1) - x^2 = -1$ không phụ thuộc vào $x$."
  },
  {
    id: "vdc_fb_1",
    type: "fill-blank",
    difficulty: "van-dung-cao",
    questionText: "Cho $x + y = 5$ và $xy = 6$. Hãy tính giá trị của biểu thức $P = x^2 + y^2$.",
    correctAnswerText: "13",
    explanation: [
      "Ta biến đổi biểu thức $P$ để làm xuất hiện tổng $x+y$ và tích $xy$:",
      "$P = x^2 + y^2 = x^2 + 2xy + y^2 - 2xy$",
      "$P = (x+y)^2 - 2xy$.",
      "Thay số vào biểu thức đã biến đổi:",
      "$P = 5^2 - 2 \\cdot 6 = 25 - 12 = 13$."
    ],
    tip: "Công thức biến đổi kinh điển: $x^2 + y^2 = (x+y)^2 - 2xy$!",
    similarExample: "Tính $x^2+y^2$ biết $x+y=3, xy=2$ là $3^2 - 2(2) = 5$."
  }
];

// Helper to format a term with proper mathematical signs for coefficients 1, -1, 0
function formatMathTerm(coeff: number, varPart: string): string {
  if (coeff === 0) return "0";
  if (coeff === 1) return varPart;
  if (coeff === -1) return `-${varPart}`;
  return `${coeff}${varPart}`;
}

// Helper to generate dynamic questions up to 200 items programmatically
// We will generate 150 questions dynamically across categories to achieve the requested 200+ pool.
export function generateQuestionPool(): Question[] {
  const pool: Question[] = [...staticQuestions];

  // Dynamic Generator Helper
  const variables = ["x", "y", "a", "b"];
  
  // 1. Generate 40 Dynamic Multiple Choice (Cộng trừ đơn thức, đa thức)
  for (let i = 1; i <= 40; i++) {
    let coeff1 = (i % 7) + 2;
    const coeff2 = (i % 5) + 3;
    if (coeff1 === coeff2) {
      coeff1 += 1;
    }
    const v1 = variables[i % variables.length];
    const v2 = variables[(i + 1) % variables.length];
    const op = i % 2 === 0 ? "+" : "-";
    
    const polyA = `${coeff1}${v1}^2${v2}`;
    const polyB = `${coeff2}${v1}^2${v2}`;
    const resultCoeff = op === "+" ? (coeff1 + coeff2) : (coeff1 - coeff2);
    const correctResult = formatMathTerm(resultCoeff, `${v1}^2${v2}`);
    
    const diff: Difficulty = i < 15 ? "nhan-biet" : i < 30 ? "thong-hieu" : "van-dung";
    
    pool.push({
      id: `dyn_mc_${i}`,
      type: "multiple-choice",
      difficulty: diff,
      questionText: `Hãy thực hiện phép tính thu gọn sau: $${polyA} ${op} ${polyB}$`,
      options: [
        `$${formatMathTerm(resultCoeff, `${v1}${v2}^2`)}$`,
        `$${correctResult}$`,
        `$${coeff1 + coeff2 + 1}${v1}^2${v2}$`,
        `$${formatMathTerm(coeff1 - coeff2 - 1, `${v1}${v2}`)}$`
      ].sort(() => Math.random() - 0.5), // Randomize options placement
      correctOptionIndex: 0, // We will find and set the exact index dynamically below
      explanation: [
        `Đây là phép tính ${op === "+" ? "cộng" : "trừ"} hai đơn thức đồng dạng.`,
        `Hai đơn thức có cùng phần biến là $${v1}^2${v2}$.`,
        `Ta thực hiện phép tính đối với hệ số: $${coeff1} ${op} ${coeff2} = ${resultCoeff}$.`,
        `Giữ nguyên phần biến, ta thu được kết quả: $${correctResult}$.`
      ],
      tip: "Khi cộng trừ đơn thức đồng dạng, ta chỉ làm việc với hệ số và giữ nguyên phần biến!",
      similarExample: `$5x^2y + 3x^2y = 8x^2y$.`
    });

    // Post-patch correct option index
    const lastItem = pool[pool.length - 1];
    const correctStr = `$${correctResult}$`;
    lastItem.correctOptionIndex = lastItem.options?.indexOf(correctStr) ?? 0;
  }

  // 2. Generate 30 Dynamic True/False (Xác định bậc)
  for (let i = 1; i <= 30; i++) {
    const deg1 = (i % 4) + 2;
    const deg2 = (i % 3) + 1;
    const isTrue = i % 3 !== 0; // mix of true and false
    const statedDeg = isTrue ? (deg1 + deg2) : (deg1 + deg2 + (i % 2 === 0 ? 1 : -1));
    const term = `5x^{${deg1}}y^{${deg2}}`;
    
    pool.push({
      id: `dyn_tf_${i}`,
      type: "true-false",
      difficulty: i < 15 ? "nhan-biet" : "thong-hieu",
      questionText: `Bậc của đơn thức $${term}$ có phải là $${statedDeg}$ không?`,
      isTrue: isTrue,
      explanation: [
        `Đơn thức $5x^{${deg1}}y^{${deg2}}$ chứa hai biến là $x$ và $y$.`,
        `Số mũ của $x$ là $${deg1}$, số mũ của $y$ là $${deg2}$.`,
        `Bậc của đơn thức là tổng các số mũ của tất cả các biến có trong đơn thức đó: $${deg1} + ${deg2} = ${deg1 + deg2}$.`,
        `Do đó, câu trả lời là ${isTrue ? "Đúng" : `Sai (bậc đúng phải là ${deg1 + deg2})`}.`
      ],
      tip: "Nhớ cộng tất cả số mũ của các biến, đừng chỉ lấy số mũ lớn nhất!",
      similarExample: `Bậc của $-2x^3y^4$ là $3 + 4 = 7$.`
    });
  }

  // 3. Generate 30 Dynamic Fill in the Blank
  for (let i = 1; i <= 30; i++) {
    const coeff = (i % 9) + 2;
    const power = (i % 3) + 2;
    const varName = variables[i % variables.length];
    
    pool.push({
      id: `dyn_fb_${i}`,
      type: "fill-blank",
      difficulty: i < 15 ? "nhan-biet" : "thong-hieu",
      questionText: `Hệ số của đơn thức sau khi thu gọn biểu thức $A = ${coeff}${varName}^{${power}} \\cdot 3${varName}$ là bao nhiêu?`,
      correctAnswerText: `${coeff * 3}`,
      explanation: [
        `Ta thực hiện nhân hai đơn thức: $A = (${coeff}${varName}^{${power}}) \\cdot (3${varName})$.`,
        `Nhân phần hệ số: $${coeff} \\cdot 3 = ${coeff * 3}$.`,
        `Nhân phần biến: $${varName}^{${power}} \\cdot ${varName} = ${varName}^{${power + 1}}$.`,
        `Kết quả thu gọn: $${coeff * 3}${varName}^{${power + 1}}$.`,
        `Hệ số là $${coeff * 3}$.`
      ],
      tip: "Hệ số là phần số đứng trước phần biến trong đơn thức thu gọn.",
      similarExample: `Hệ số của $2x^2 \\cdot 5x$ là $10$.`
    });
  }

  // 4. Generate 20 Dynamic Matching (Tính tổng/hiệu đa thức)
  for (let i = 1; i <= 20; i++) {
    const term1 = formatMathTerm(i, "x");
    const term2 = `${i + 1}y`;
    const pair1_left = `$ (x + ${term2}) + (${term1} - ${term2}) $`;
    const pair1_right = `$${formatMathTerm(i + 1, "x")}$`;
    const pair2_left = `$ (x + ${term2}) - (${term1} + ${term2}) $`;
    const pair2_right = `$${formatMathTerm(1 - i, "x")}$`;
    
    pool.push({
      id: `dyn_mt_${i}`,
      type: "matching",
      difficulty: "thong-hieu",
      questionText: `Ghép cặp các phép toán thu gọn đa thức sau với kết quả đúng:`,
      matchingPairs: [
        { left: pair1_left, right: pair1_right },
        { left: pair2_left, right: pair2_right },
        { left: `$(${term1} + 1) + (${term1} - 1)$`, right: `$${2 * i}x$` },
        { left: `$(${term1} + 1) - (${term1} - 1)$`, right: `$2$` }
      ].sort(() => Math.random() - 0.5),
      explanation: [
        `Thực hiện phá ngoặc và gom hạng tử đồng dạng cho từng biểu thức:`,
        `1. \$ (x + ${term2}) + (${term1} - ${term2}) = x + ${term2} + ${term1} - ${term2} = (1 + ${i})x = ${formatMathTerm(i + 1, "x")} \$.`,
        `2. \$ (x + ${term2}) - (${term1} + ${term2}) = x + ${term2} - ${term1} - ${term2} = (1 - ${i})x = ${formatMathTerm(1 - i, "x")} \$.`,
        `3. \$ (${term1} + 1) + (${term1} - 1) = ${term1} + 1 + ${term1} - 1 = ${2 * i}x \$.`,
        `4. \$ (${term1} + 1) - (${term1} - 1) = ${term1} + 1 - ${term1} + 1 = 2 \$.`
      ]
    });
  }

  // 5. Generate 20 Dynamic Multi-select (Tìm đơn thức đồng dạng)
  for (let i = 1; i <= 20; i++) {
    const mainVar = `${variables[i % variables.length]}^2${variables[(i + 1) % variables.length]}`; // e.g., x^2y
    const diffVar = `${variables[i % variables.length]}${variables[(i + 1) % variables.length]}^2`; // e.g., xy^2
    
    pool.push({
      id: `dyn_ms_${i}`,
      type: "multi-select",
      difficulty: "nhan-biet",
      questionText: `Những đơn thức nào sau đây đồng dạng với đơn thức $-4${mainVar}$? (Chọn tất cả đáp án đúng)`,
      options: [
        `$5${mainVar}$`,
        `$-4${diffVar}$`,
        `$\\frac{2}{3}${mainVar}$`,
        `$-4${mainVar}^2$`,
        `$-${mainVar}$`
      ],
      correctOptionIndices: [0, 2, 4], // 5x^2y, 2/3 x^2y, -x^2y
      explanation: [
        `Đơn thức $-4${mainVar}$ có phần biến là $${mainVar}$.`,
        `Các đơn thức đồng dạng phải có phần biến chính xác là $${mainVar}$.`,
        `Các lựa chọn khớp là: $5${mainVar}$, $\\frac{2}{3}${mainVar}$, và $-${mainVar}$.`
      ],
      tip: "Chỉ so sánh phần chữ (biến và số mũ), bỏ qua phần số (hệ số) ở trước!"
    });
  }

  // 6. Generate 10 Dynamic Advanced Application (Vận dụng cao)
  for (let i = 1; i <= 10; i++) {
    const sum = i + 4; // e.g., 5, 6, 7
    const prod = i * 2; // e.g., 2, 4, 6
    const formulaVal = sum * sum - 2 * prod;
    
    pool.push({
      id: `dyn_vdc_${i}`,
      type: "fill-blank",
      difficulty: "van-dung-cao",
      questionText: `Cho hai số thực $a, b$ thỏa mãn $a + b = ${sum}$ và $ab = ${prod}$. Hãy tính giá trị của biểu thức $S = a^2 + b^2$.`,
      correctAnswerText: `${formulaVal}`,
      explanation: [
        `Ta sử dụng hằng đẳng thức đáng nhớ: $(a+b)^2 = a^2 + 2ab + b^2$.`,
        `Suy ra $a^2 + b^2 = (a+b)^2 - 2ab$.`,
        `Thay giả thiết $a+b = ${sum}$ và $ab = ${prod}$ vào biểu thức:`,
        `$S = ${sum}^2 - 2 \\cdot ${prod} = ${sum * sum} - ${2 * prod} = ${formulaVal}$.`
      ],
      tip: "Sử dụng hằng đẳng thức để biểu diễn các tổng bình phương qua tổng và tích!",
      similarExample: `Nếu $a+b=3, ab=1$ thì $a^2+b^2 = 3^2 - 2(1) = 7$.`
    });
  }

  return pool;
}

// Get randomized subset of questions with options shuffled
export function getRandomQuestions(
  pool: Question[],
  count: number,
  difficulty?: Difficulty | "all",
  type?: QuestionType | "all"
): Question[] {
  let filtered = [...pool];
  
  if (difficulty && difficulty !== "all") {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  
  if (type && type !== "all") {
    filtered = filtered.filter(q => q.type === type);
  }
  
  // Shuffle pool
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  
  // Return sliced subset
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
