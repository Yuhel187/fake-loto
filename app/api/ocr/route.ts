import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { imageBase64 } = await req.json();

        // Sử dụng gemini-2.5-flash vì nó cực nhanh và xử lý ảnh (multimodal) siêu tốt
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Bạn là một chuyên gia nhận diện dữ liệu hình ảnh. Nhiệm vụ của bạn là trích xuất các con số từ hình ảnh một tờ vé Lô Tô Việt Nam (gồm 3 bảng nhỏ ghép lại, tổng cộng 9 dòng) và chuyển thành một mảng JSON 2 chiều (matrix) kích thước 9x9.

Hãy tuân thủ TUYỆT ĐỐI các quy tắc phân bổ logic của vé Lô Tô sau đây:

1. QUY TẮC CỘT (Rất quan trọng để không điền sai vị trí):
- Cột 1 (index 0): Chỉ chứa các số từ 1 đến 9.
- Cột 2 (index 1): Chỉ chứa các số từ 10 đến 19.
- Cột 3 (index 2): Chỉ chứa các số từ 20 đến 29.
- Cột 4 (index 3): Chỉ chứa các số từ 30 đến 39.
- Cột 5 (index 4): Chỉ chứa các số từ 40 đến 49.
- Cột 6 (index 5): Chỉ chứa các số từ 50 đến 59.
- Cột 7 (index 6): Chỉ chứa các số từ 60 đến 69.
- Cột 8 (index 7): Chỉ chứa các số từ 70 đến 79.
- Cột 9 (index 8): Chỉ chứa các số từ 80 đến 90.

2. QUY TẮC DÒNG:
- Mỗi dòng PHẢI CÓ CHÍNH XÁC 5 con số và 4 ô trống.
- Ô trống (không có số) bắt buộc phải ghi là: null.
- Mảng kết quả bắt buộc phải có chính xác 9 dòng (9 mảng con).

3. ĐỊNH DẠNG ĐẦU RA:
- CHỈ TRẢ VỀ mã JSON thuần túy định dạng mảng 2 chiều.
- KHÔNG bọc trong markdown \`\`\`json, KHÔNG có bất kỳ văn bản giải thích nào khác.

Ví dụ định dạng đầu ra chuẩn xác:
[
    [9, null, 25, 38, null, 53, null, null, 86],
    [null, 15, null, 36, null, 51, 64, null, 90],
    [2, null, 28, null, 47, null, 66, 78, null],
    ... (tiếp tục cho đủ 9 dòng)
]
`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const text = result.response.text();

        // Dọn dẹp string trong trường hợp Gemini vô tình bọc markdown ```json
        const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const matrix = JSON.parse(cleanJsonStr);

        return NextResponse.json({ matrix });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: 'Không thể xử lý ảnh' }, { status: 500 });
    }
}