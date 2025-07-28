import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to default language (Korean)
  redirect('/ko')
}