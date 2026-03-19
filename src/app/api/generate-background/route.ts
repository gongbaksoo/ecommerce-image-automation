import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, width, height, apiKey: clientApiKey, model: clientModel } = await request.json();

    // 클라이언트에서 전달받은 키 우선, 없으면 환경변수
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다. 설정 페이지에서 Gemini API 키를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json({ error: 'prompt가 필요합니다' }, { status: 400 });
    }

    const systemPrompt = [
      `Create an event promotion background image for an e-commerce banner.`,
      `Size: ${width || 1200}x${height || 800} pixels.`,
      `Style: Clean, professional, visually appealing.`,
      `IMPORTANT: Do NOT include any text, letters, numbers, or words in the image.`,
      `Leave empty space for product images and text overlays.`,
      `User request: ${prompt}`,
    ].join('\n');

    const modelId = clientModel || 'gemini-2.0-flash-exp';
    const isImagen = modelId.startsWith('imagen');

    let imageUrl: string;

    if (isImagen) {
      // Imagen API — 별도 엔드포인트 사용
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: systemPrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: width && height ? `${width}:${height}` : '16:9',
            },
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Imagen API error:', res.status, errorData);
        const errorMsg = errorData?.error?.message || `API 호출 실패 (${res.status})`;
        return NextResponse.json(
          { error: `Imagen: ${errorMsg}. 다른 모델을 선택하거나 직접 업로드를 이용해주세요.` },
          { status: 500 }
        );
      }

      const data = await res.json();
      const prediction = data?.predictions?.[0];
      if (!prediction?.bytesBase64Encoded) {
        return NextResponse.json(
          { error: 'Imagen이 이미지를 생성하지 못했습니다. 프롬프트를 수정해주세요.' },
          { status: 500 }
        );
      }
      imageUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
    } else {
      // Gemini generateContent API — 이미지 생성 모드
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseModalities: ['IMAGE', 'TEXT'],
            },
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Gemini API error:', res.status, errorData);
        const errorMsg = errorData?.error?.message || `API 호출 실패 (${res.status})`;
        return NextResponse.json(
          { error: `${modelId}: ${errorMsg}. 다른 모델을 선택하거나 직접 업로드를 이용해주세요.` },
          { status: 500 }
        );
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts;
      if (!parts) {
        return NextResponse.json(
          { error: 'AI 응답에서 이미지를 찾을 수 없습니다. 다른 모델을 시도해주세요.' },
          { status: 500 }
        );
      }

      const imagePart = parts.find(
        (p: { inlineData?: { mimeType: string; data: string } }) =>
          p.inlineData?.mimeType?.startsWith('image/')
      );

      if (!imagePart?.inlineData) {
        return NextResponse.json(
          { error: '이 모델은 이미지를 생성하지 못했습니다. 다른 모델을 선택해주세요.' },
          { status: 500 }
        );
      }

      const { mimeType, data: base64Data } = imagePart.inlineData;
      imageUrl = `data:${mimeType};base64,${base64Data}`;
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'AI 배경 생성에 실패했습니다. 직접 업로드를 이용해주세요.' },
      { status: 500 }
    );
  }
}
