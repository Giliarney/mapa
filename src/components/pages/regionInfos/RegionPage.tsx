import React from 'react';
import { CircleArrowLeft, ArrowRight } from "lucide-react"
import BrazilMap from './mapRegionPage/map';
{/*import TableInfos from "../../table/Table"*/ }
import Cards from "../../cards/Cards"
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

const RegionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedOrigin = searchParams.get("origin");
  const selectedDestination = searchParams.get("destination");
  const selectedRegions = [
    ...(selectedOrigin ? [selectedOrigin] : []),
    ...(selectedDestination ? [selectedDestination] : [])
  ];

  return (
      <main className='w-full h-full flex flex-col xl:flex-row items-center justify-center bg-[#f5f5f5] border-[#3b3b3b2a] border relative'>
        <div className='flex items-center w-fit absolute z-10
          left-4 top-4 p-1 text-xs sm:p-2 sm:text-base lg:p-3 gap-1 hover:cursor-pointer
          rounded-[6px] hover:bg-[#282828] text-[#282828] hover:text-white lg:text-sm transition-all'
          onClick={() => navigate("/")}
        >
          <CircleArrowLeft className='w-4 lg:w-6' />
          <h1>Voltar</h1>
        </div>

        <section className='w-full xl:w-[45%] 2xl:w-[35%] flex flex-col items-center justify-center p-4'>

          <div className='w-full flex flex-col-reverse xl:flex-col justify-center items-center relative'>

            <div className='flex w-fit px-4 sm:py-1 lg:py-2 items-center justify-center gap-4 xl:text-base
              rounded-[8px] border border-[#7a7a7a] bg-[#282828] text-xs sm:text-base '
            >
              <h1 className="text-[white]">Estado Origem: <span className='text-[#FCA311]'>{selectedOrigin}</span></h1>
              <ArrowRight className='w-5 lg:w-8 text-emerald-600' onClick={() => navigate("/")} />
              <h1 className="text-[white]">Estado Destino: <span className='text-[#FCA311]'>{selectedDestination}</span></h1>
            </div>

            <div className='w-[80%] sm:w-[60%] lg:w-[50%] xl:w-full flex items-center justify-center relative px-4'>
              <BrazilMap selectedRegions={selectedRegions} />
            </div>
          </div>


        </section>

        <section className='xl:w-[90%]'>
          <Cards></Cards>
        </section>


      </main>
  );
};


export default RegionPage;