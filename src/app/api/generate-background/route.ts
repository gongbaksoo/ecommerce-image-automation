import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      width,
      height,
      apiKey: clientApiKey,
      model: clientModel,
      productImage,
      subImage1,
      subImage2,
      subImage3,
      referenceImage,
      textPositionGuide,
    } = await request.json();

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

    // 글로벌 규칙: 상품 이미지 원본 보존
    const PRODUCT_IMAGE_RULE = [
      `[GLOBAL RULE - PRODUCT IMAGE PRESERVATION]`,
      `The main product image MUST remain EXACTLY as provided.`,
      `- DO NOT alter the product's shape, color, texture, design, logo, or any visual detail.`,
      `- You MAY adjust the product's angle or orientation slightly.`,
      `- The product must be the focal point of the final image.`,
      `- Only the background, staging, lighting, and surrounding environment may be generated or modified.`,
    ].join('\n');

    const w = width || 1200;
    const h = height || 800;
    const aspectRatio = w / h;
    const orientation = aspectRatio > 1.2 ? 'landscape (wide)' : aspectRatio < 0.8 ? 'portrait (tall)' : 'square';

    const systemPromptParts = [
      `Create a product staging/lifestyle photo for an e-commerce banner.`,
      `CRITICAL - Image dimensions: ${w}x${h} pixels (aspect ratio ${aspectRatio.toFixed(2)}:1, ${orientation}).`,
      `The image MUST be generated in ${orientation} orientation matching this exact aspect ratio.`,
      `Style: Clean, professional, visually appealing.`,
      PRODUCT_IMAGE_RULE,
      textPositionGuide ? `[TEXT OVERLAY ZONE] ${textPositionGuide}` : '',
      `IMPORTANT: Do NOT include any text, letters, numbers, or words in the image. Text will be overlaid separately.`,
      referenceImage ? `Use the provided reference image as a style/mood guide for the background and staging.` : '',
      `User request: ${prompt}`,
    ].filter(Boolean).join('\n');

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
            instances: [{ prompt: systemPromptParts }],
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
      // base64 data URL에서 mimeType과 데이터 추출하는 헬퍼
      const parseBase64 = (dataUrl: string) => {
        const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
        return match ? { mimeType: match[1], data: match[2] } : null;
      };

      // 멀티모달 파트 구성: 텍스트 프롬프트 + 상품 이미지 + 레퍼런스 이미지
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestParts: any[] = [
        { text: systemPromptParts },
      ];

      if (productImage) {
        const parsed = parseBase64(productImage);
        if (parsed) {
          requestParts.push({ inlineData: parsed });
          requestParts.push({ text: 'Above is the main product image. Preserve it EXACTLY — do NOT change its shape, color, texture, or design. You may only adjust the angle slightly. This is the primary/hero product.' });
        }
      }

      const subImages = [
        { data: subImage1, name: '서브 이미지 1 (Sub Image 1)' },
        { data: subImage2, name: '서브 이미지 2 (Sub Image 2)' },
        { data: subImage3, name: '서브 이미지 3 (Sub Image 3)' },
      ];
      for (const sub of subImages) {
        if (sub.data) {
          const parsed = parseBase64(sub.data);
          if (parsed) {
            requestParts.push({ inlineData: parsed });
            requestParts.push({ text: `Above is ${sub.name}. Include this item in the scene alongside the main product. Preserve its appearance exactly. Place it naturally as a secondary/supporting element.` });
          }
        }
      }

      if (referenceImage) {
        const parsed = parseBase64(referenceImage);
        if (parsed) {
          requestParts.push({ inlineData: parsed });
          requestParts.push({ text: 'Above is a reference/mood image. Use it as a style guide for the background and staging only.' });
        }
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: requestParts }],
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
      const responseParts = data?.candidates?.[0]?.content?.parts;
      if (!responseParts) {
        return NextResponse.json(
          { error: 'AI 응답에서 이미지를 찾을 수 없습니다. 다른 모델을 시도해주세요.' },
          { status: 500 }
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imagePart = responseParts.find(
        (p: any) => p.inlineData?.mimeType?.startsWith('image/')
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
