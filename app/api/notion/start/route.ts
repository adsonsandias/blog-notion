import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/notion/callback`;
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
  }
  const state = Math.random().toString(36).slice(2);
  const url = new URL('https://api.notion.com/v1/oauth/authorize');
  url.searchParams.set('owner', 'user');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);
  return NextResponse.redirect(url.toString(), { status: 302 });
}
