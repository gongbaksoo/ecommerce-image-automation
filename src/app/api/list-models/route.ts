import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API 키가 필요합니다' }, { status: 400 });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `모델 목록 조회 실패 (${res.status}). API 키를 확인해주세요.` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const models = (data.models || [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        m.supportedGenerationMethods?.includes('generateContent')
      )
      .map((m: { name: string; displayName: string; description: string; supportedGenerationMethods: string[] }) => ({
        id: m.name.replace('models/', ''),
        name: m.displayName,
        description: m.description?.slice(0, 100) || '',
        methods: m.supportedGenerationMethods,
      }));

    return NextResponse.json({ models });
  } catch (error) {
    console.error('List models error:', error);
    return NextResponse.json({ error: '모델 목록 조회에 실패했습니다' }, { status: 500 });
  }
}
