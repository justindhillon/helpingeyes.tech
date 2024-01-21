import Image from "next/image";

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-tr from-[#60072C]
    via-[#120B2E] to-[#091498] flex justify-center'>
      <div className="max-width-xl">
        {/* Image */}
        <div className="flex flex-col lg:flex-row text-white">
          <div className="lg:w-1/2 lg:block hidden">
            <p className="text-lg">Your text here...</p>
          </div>

          <div className="lg:w-1/2">
            <Image
              src="/blind.png"
              className="w-full h-auto"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>

          <div className="lg:hidden mt-4">
            <p className="text-lg">Your text here...</p>
          </div>
        </div>


        <div>
          <button type="button" className="text-white rounded px-10 py-5 
          bg-gradient-to-r from-pink-500 to-yellow-500 hover:brightness-50">
            Get Help
          </button>
          <button type="button" className="text-white rounded px-10 py-5 
          bg-gradient-to-r from-pink-500 to-yellow-500 hover:brightness-50">
            Get Help
          </button>
        </div>
      </div>
    </main>
  );
}
