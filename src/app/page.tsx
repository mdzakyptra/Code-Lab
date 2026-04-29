import { redirect } from 'next/navigation';

export default function Home() {
  // Mengarahkan ke dashboard. Dashboard akan mendeteksi apakah sudah login atau belum.
  redirect('/dashboard');
}
