import React from 'react';
import { CircleArrowLeft, ArrowRight } from "lucide-react"
import BrazilMap from './mapRegionPage/map';
import { Button } from "@/components/ui/button"
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
    <div className='flex w-full lg:h-screen flex-col gap-3'>

      <header className="h-18 pt-2 bg-white flex items-center justify-center">
        <div className='w-full flex items-center justify-center'>
          <img src="https://i.imgur.com/ChvkVE0.png" alt="" className='w-28' />
        </div>
      </header>

      <div className='flex flex-col h-full lg:flex-row items-center justify-center bg-[#f5f5f5] border-[#3b3b3b2a] border relative'>
        <div className='flex items-center w-fit absolute 
          left-4 top-4 px-3 py-1 gap-1 hover:cursor-pointer
          rounded-[6px] bg-[#282828] text-[#bdbdbd] hover:text-white text-sm'
          onClick={() => navigate("/")}
          >
          <Button className=' p-0'>
            <CircleArrowLeft className='w-6 h-6 ' />
          </Button> 
            <h1>Voltar</h1>
        </div>
        <div className='flex flex-col justify-center items-center relative gap-4 border-r'>


          <div className='flex w-fit px-4 py-2 items-center justify-center gap-4 text-lg
           rounded-[10px] border border-[#7a7a7a] bg-[#282828] '>
            <h1 className="text-[white]">Estado Origem: <span className='text-[#FCA311]'>{selectedOrigin}</span></h1>
            <ArrowRight className='w-8 h-8 text-emerald-600' onClick={() => navigate("/")} />
            <h1 className="text-[white]">Estado Destino: <span className='text-[#FCA311]'>{selectedDestination}</span></h1>
          </div>
          <div className='flex items-center justify-center relative px-4'>

            <BrazilMap selectedRegions={selectedRegions} />
          </div>
        </div>

        <div className='w-full h-full'>
          {/*<div className='flex items-center justify-center w-full h-16 border-t rounded'>
              <h1 className='text-xl sm:text-3xl text-center rounded text-white bg-slate-700 w-full p-4'>Tributação</h1>
            </div>*/}

          <Cards></Cards>
          {/*<TableInfos></TableInfos>*/}
        </div>


      </div>
    </div>
  );
};


export default RegionPage;