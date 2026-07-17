import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if the key is missing during first setup
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Tutor will run in mock mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Chat Endpoint for Math Tutor
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Yêu cầu danh sách tin nhắn hợp lệ." });
    }

    // Format chat history for Gemini
    // We get last 6 messages to stay fast and avoid token bloat
    const recentMessages = messages.slice(-10);
    
    // Prepare the system instruction
    const systemInstruction = 
      "Bạn là 'Gia sư Toán 8 AI', một trợ lý học tập cực kỳ thông minh, thân thiện, vui tính và tâm lý, chuyên dạy môn Toán lớp 8 (Chương trình Việt Nam, bộ sách 'Kết nối tri thức với cuộc sống').\n" +
      "Hiện tại học sinh đang học: 'CHƯƠNG I. ĐA THỨC' - 'BÀI 3. PHÉP CỘNG, PHÉP TRỪ ĐA THỨC'.\n" +
      "Nhiệm vụ của bạn:\n" +
      "1. Trả lời các thắc mắc về toán học cấp 2, đặc biệt tập trung giải thích cách cộng, trừ đa thức bằng phương pháp nhóm hạng tử đồng dạng.\n" +
      "2. Luôn xưng hô thân mật là 'Thầy AI' và gọi học sinh là 'em'.\n" +
      "3. Giải thích từng bước một cực kỳ trực quan, dễ hiểu cho học sinh lớp 8 (13-14 tuổi). Tránh dùng từ ngữ hàn lâm khó hiểu.\n" +
      "4. Khuyến khích học sinh tự giải quyết vấn đề bằng cách đưa ra gợi ý gợi mở (scaffolding) thay vì giải hộ ngay lập tức.\n" +
      "5. BẮT BUỘC: Tất cả công thức toán học PHẢI được viết bằng định dạng LaTeX chuẩn quốc tế và bọc trong cặp dấu $...$ (cho inline math - ví dụ: $3x^2 + 2x$) hoặc $$...$$ (cho block math hiển thị giữa dòng - ví dụ: $$(A+B) = (3x^2+2y) + (x^2-y)$$). KHÔNG được dùng HTML thông thường hay thẻ <sup>, <sub>. Đảm bảo hiển thị đẹp mắt và chuyên nghiệp.\n" +
      "6. Khuyến khích tinh thần gamification: khen ngợi tinh thần học tập của em, gợi ý em luyện tập thêm để tích luỹ xu học tập.";

    const lastMessage = recentMessages[recentMessages.length - 1];
    const userPrompt = lastMessage ? lastMessage.text : "Xin chào Gia sư AI!";

    // If Gemini key is mock or unset, return a supportive local response
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      // Simulate tutor response
      const fallbackReplies = [
        "Chào em nhé! Thầy là Gia sư AI luôn ở đây để hỗ trợ em học Toán 8. Để cộng trừ đa thức, em nhớ quy tắc:\n\n1. **Bỏ ngoặc**: Giữ nguyên dấu nếu ngoặc có dấu cộng ($+$) phía trước; đổi dấu tất cả hạng tử trong ngoặc nếu ngoặc có dấu trừ ($-$) phía trước.\n2. **Nhóm hạng tử đồng dạng**: Gom các đơn thức có cùng phần biến lại với nhau.\n3. **Thu gọn**: Cộng trừ các hệ số để ra đa thức tối giản.\n\nEm có muốn làm thử một ví dụ không?",
        "Ôi, câu hỏi của em rất thú vị! Để cộng hai đa thức $A = 3x^2 + 2x$ và $B = x^2 - x$, em thực hiện nhóm các hạng tử đồng dạng như sau:\n\n$$A + B = (3x^2 + x^2) + (2x - x)$$\n\nThu gọn hệ số, kết quả sẽ là $4x^2 + x$ đấy! Em đã hiểu bài chưa nào?",
        "Tuyệt vời lắm! Thầy khuyên em nên luyện tập thêm trong tab **Game (Đấu trường)** hoặc **Luyện tập** để tăng tốc độ tính toán và cộng trừ đa thức nhanh thoăn thoắt nhé!"
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ text: `[Gia sư AI - Chế độ Hỗ trợ] ${randomReply}` });
    }

    const ai = getAiClient();
    
    // Create a chat or generate content
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "Thầy chưa nghe rõ câu hỏi của em. Em có thể hỏi lại được không?";
    return res.json({ text: replyText });

  } catch (error: any) {
    console.error("Lỗi khi kết nối tới Gemini API:", error);
    return res.status(500).json({ 
      error: "Không thể kết nối với Gia sư AI. Vui lòng kiểm tra lại cấu hình API.",
      details: error.message 
    });
  }
});

// Setup Vite Dev Server / Static Asset Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
