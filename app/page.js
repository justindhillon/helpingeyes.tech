import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-tr from-[#60072C]
    via-[#120B2E] to-[#091498] flex justify-center'>
      <div className="max-width-xl my-24">
        {/* Image */}
        <div className="flex flex-col lg:flex-row text-white">
          <div className="lg:w-1/2 lg:block hidden">
            <div className="h-full flex flex-col items-center justify-center">
              <p className="font-black text-6xl text-yellow-500">Your Virtual Eyes</p>
              <Image
                src="/shooting-star.png"
                className="w-[20em] h-auto"
                width={1000}
                height={1000}
                alt="Picture of the author"
              />
            </div>
          </div>

          <div className="lg:w-1/2">
            <Image
              src="/blind.png"
              className="w-full h-auto"
              width={1000}
              height={1000}
              alt="Picture of the author"
            />
          </div>

          <div className="lg:hidden mt-4">
            <div className="h-full flex flex-col items-center justify-center">
              <p className="font-black text-5xl text-yellow-500">Your Virtual Eyes</p>
              <Image
                src="/shooting-star.png"
                className="w-[20em] h-auto"
                width={1000}
                height={1000}
                alt="Picture of the author"
              />
            </div>
          </div>
        </div>


        <div className="mt-12 w-full flex flex-col gap-10 lg:mt-24 lg:flex-row">
          <button type="button" className="text-white rounded px-10 py-5 w-full
          bg-gradient-to-r from-pink-500 to-yellow-500 hover:brightness-50">
            Get Help
          </button>
          <Link href="/api/auth/signin" className="w-full">
            <button type="button" className="text-white rounded px-10 py-5 w-full
            bg-gradient-to-r from-pink-500 to-yellow-500 hover:brightness-50">
              Volunteer
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
