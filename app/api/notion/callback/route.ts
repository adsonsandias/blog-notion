import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'nodejs';

const NOTION_VERSION = '2025-09-03';

export async function GET(req: NextRequest) {
  const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
  const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/notion/callback`;
  const code = req.nextUrl.searchParams.get('code');
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
  }
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    return NextResponse.json({ error: 'Token exchange failed', detail: err }, { status: 502 });
  }
  const data = await res.json();
  const accessToken = data.access_token as string | undefined;
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 502 });
  }
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`);
  response.cookies.set('notion_access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: false
  });
  return response;
}
