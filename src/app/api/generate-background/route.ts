import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY가 설정되지 않았습니다. .env.local에 추가해주세요.' },
      { status: 500 }
    );
  }

  try {
    const { prompt, width, height } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'prompt가 필요합니다' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = [
      `Create an event promotion background image for an e-commerce banner.`,
      `Size: ${width || 1200}x${height || 800} pixels.`,
      `Style: Clean, professional, visually appealing.`,
      `IMPORTANT: Do NOT include any text, letters, numbers, or words in the image.`,
      `Leave empty space for product images and text overlays.`,
      `User request: ${prompt}`,
    ].join('\n');

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    // Gemini text model doesn't generate images directly.
    // For MVP, return a placeholder and guide user to use upload instead.
    return NextResponse.json({
      error: 'AI 이미지 생성은 Gemini Imagen API가 필요합니다. 현재는 배경 업로드를 이용해주세요.',
      suggestion: text,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'AI 배경 생성에 실패했습니다. 직접 업로드를 이용해주세요.' },
      { status: 500 }
    );
  }
}
