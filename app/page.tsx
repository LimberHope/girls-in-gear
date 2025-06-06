import Image from "next/image";

export default function Home() {
  return (
    <div className="px-4 py-8 bg-[#fbf2fc] size-full">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Where are we located?</h1>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
                <div className="relative">
                    <select className="bg-cyan-400 text-white px-6 py-3 rounded-full font-semibold appearance-none pr-10 cursor-pointer hover:bg-cyan-500 transition-colors">
                        <option>Select Location</option>
                        <option>Alaska</option>
                        <option>Virginia</option>
                        <option>Other States</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                
                <div className="relative">
                    <input type="text" placeholder="Vienna, VA 22181" className="px-6 py-3 rounded-full border-2 border-gray-200 focus:border-cyan-400 focus:outline-none w-64" />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                
                <button className="bg-cyan-200 text-cyan-700 px-6 py-3 rounded-full font-semibold hover:bg-cyan-300 transition-colors">
                    Reset Map
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 bg-white rounded-2xl p-6 shadow-lg">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">48 Local Chapters Found</h3>
                    <p className="text-gray-600 text-sm">Girls in your area need your support!</p>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                            👟
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-cyan-600 text-sm">Girls on the Run Alaska</h4>
                            <p className="text-xs text-gray-600">Anchorage, Matanuska Susitna</p>
                            <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                            <p className="text-xs text-cyan-500">🌐 www.gotrsouthcentralak.org</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>

                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                            👟
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-cyan-600 text-sm">Girls on the Run Southcentral Ala...</h4>
                            <p className="text-xs text-gray-600">Anchorage, Matanuska Susitna</p>
                            <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                            <p className="text-xs text-cyan-500">🌐 www.gotrsouthcentralak.org</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>

                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                            👟
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-cyan-600 text-sm">Girls on the Run Southcentral Ala...</h4>
                            <p className="text-xs text-gray-600">Anchorage, Matanuska Susitna</p>
                            <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                            <p className="text-xs text-cyan-500">🌐 www.gotrsouthcentralak.org</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>

                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                            👟
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-cyan-600 text-sm">Girls on the Run Southcentral Ala...</h4>
                            <p className="text-xs text-gray-600">Anchorage, Matanuska Susitna</p>
                            <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                            <p className="text-xs text-cyan-500">🌐 www.gotrsouthcentralak.org</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>

                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                            👟
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-cyan-600 text-sm">Girls on the Run Southcentral Ala...</h4>
                            <p className="text-xs text-gray-600">Anchorage, Matanuska Susitna</p>
                            <p className="text-xs text-gray-500">📞 (907) 306-0789</p>
                            <p className="text-xs text-cyan-500">🌐 www.gotrsouthcentralak.org</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="lg:w-2/3 relative">
                <div id="map" className="w-full h-96 lg:h-full rounded-2xl shadow-lg min-h-[400px]"></div>
                
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg max-w-xs">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white text-sm">
                            👟
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-cyan-600 text-sm mb-1">Girls on the Run Southcentral Alaska</h4>
                            <p className="text-xs text-gray-600 mb-1">Anchorage, Matanuska Susitna</p>
                            <p className="text-xs text-gray-500 mb-1">📞 (907) 306-0789</p>
                            <p className="text-xs text-cyan-500 mb-3">🌐 www.gotrsouthcentralak.org</p>
                            <button className="bg-cyan-400 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-cyan-500 transition-colors">
                                View Directions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
