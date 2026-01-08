/**
 * Exit Preview API Route
 * Disables Next.js draft mode
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
    const draft = await draftMode();
    draft.disable();
    redirect('/');
}
