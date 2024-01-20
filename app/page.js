import Image from "next/image";

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-tr from-[#60072C]
    via-[#120B2E] to-[#091498] px-8 md:px-14 lg:px-36 pb-10 pt-7'>
      <button type="button" class="text-white rounded px-10 py-5 
      bg-gradient-to-r from-green-400 to-blue-500 
      hover:from-pink-500 hover:to-yellow-500">
        Volunteer
      </button>
      <button type="button" class="text-white rounded px-10 py-5 
      bg-gradient-to-r from-green-400 to-blue-500 
      hover:from-pink-500 hover:to-yellow-500">
        Get Help
      </button>
    </main>
  );
}
