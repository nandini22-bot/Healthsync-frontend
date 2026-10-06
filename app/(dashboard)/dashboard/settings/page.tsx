import { redirect } from 'next/navigation';

// Settings has been merged into the Profile page.
// This redirect ensures any deep-links or sidebar clicks still work.
export default function SettingsPage() {
  redirect('/dashboard/profile');
}
